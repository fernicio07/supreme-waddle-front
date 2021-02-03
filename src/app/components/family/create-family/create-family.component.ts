import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FamilyService } from '../../../services/family.service';
import { DadComponent } from '../dad/dad.component';
import { MomComponent } from '../mom/mom.component';
import { GuardianComponent } from '../guardian/guardian.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { StartAnioService } from '../../../services/start-anio.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'create-family',
  templateUrl: './create-family.component.html'
})
export class CreateFamilyComponent implements OnInit, AfterViewInit {

  public listaAnios: Array<any> = [];
  public isModoEdit: boolean = false;
  public mostrarTipoTarjeta: boolean = false;
  public mostrarDonativos: boolean = false;
  public verificarTotal: boolean = false;
  public mostrarMensajeError: boolean = false;

	@ViewChild(DadComponent, { static: false }) dadComponent; 
	@ViewChild(MomComponent, { static: false }) momComponent;
	@ViewChild(GuardianComponent, { static: false }) guardianComponent;
	@ViewChild('inputCodigoFamilia', { static: false }) inputCodigoFamilia;

	public familyForm: FormGroup;
  public showFormGuardian: boolean = false;
  public familyCode: string = "";

  public submitted: boolean = false;
  private existeCodigo: boolean;
	// public desactivarBotonSig: boolean = false;
	// public mostrarFormMom: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
		private familyService: FamilyService,
		private cdr: ChangeDetectorRef,
    private router: Router,
    private startAnioService: StartAnioService
  ) { }

  ngOnInit(): void {
		this.familyForm = this.formBuilder.group({
			addFormGuardian: [false],
			formDad: [null, Validators.required],
			formMom: [null, Validators.required],
      formGuardian: [null],
      pagoAutomatico: [false, Validators.required],
      tipoTarjeta: [null],
      planPagoDonaciones: [null, Validators.required],
      distribuirTotal: [0],
      cuantoPagaInstruccion: [0],
      cuantoPagaDonativo: [0],
      cuantoPagaCuido: [0],
      codigoFamilia: [null, Validators.required],
      donativoAnual: [0],
      donativoFuturo: [0],
      // billingAddress: [null],
      // circularAddress: [null],
      addressFacturacionLineOne: [null],
      addressFacturacionLineTwo: [null],
      addressFacturacionCity: [null],
      addressFacturacionCountry: ['PR'],
      facturacionZipCode: [null],
      addressCircularLineOne: [null],
      addressCircularLineTwo: [null],
      addressCircularCity: [null],
      addressCircularCountry: ['PR'],
      circularZipCode: [null],

    })
    this.getAnios();
    this.f.planPagoDonaciones.setValue(0);
    this.modelDonativo(0);
  }
  
  ngAfterViewInit() { }

  get f() {
		return this.familyForm.controls;
	}

  public cambio(event: any) {
    this.showFormGuardian = event;   
  }

  public modelDonativo(event: any) {
    if(!isNaN(event)) {
      this.mostrarDonativos = true;
      this.f.donativoAnual.setValidators([Validators.required])
      this.f.donativoFuturo.setValidators([Validators.required])
    } else {
      this.f.donativoAnual.clearValidators();
      this.f.donativoAnual.setValue(0);
      this.f.donativoFuturo.clearValidators();
      this.f.donativoFuturo.setValue(0);
      this.mostrarDonativos = false;
    }
    this.f.donativoAnual.updateValueAndValidity();
    this.f.donativoFuturo.updateValueAndValidity();
  }
  
  public modelPagoAutomatico(event: any) {
    if(event) {
      this.mostrarTipoTarjeta = true;
      this.f.tipoTarjeta.setValidators([Validators.required])
    } else {
      this.f.tipoTarjeta.setValue(null);
      this.f.tipoTarjeta.clearValidators();
      this.mostrarTipoTarjeta = false;
    }
    this.f.tipoTarjeta.updateValueAndValidity();
  }

	/**
	 * Método que permite validar el formulario y guardar la familia
	 */
	public saveFamily(): void {
    this.submitted = true;
    this.f.formMom.setValue(this.momComponent.familyMomForm);
    this.f.formDad.setValue(this.dadComponent.familyDadForm);
    this.f.distribuirTotal.setErrors(null);
    
		if (this.familyForm.invalid || this.momComponent.familyMomForm.invalid || this.dadComponent.familyDadForm.invalid) {
      this.alertaWarning('Algunos campos son requeridos...');
      return;
    }

    // Validar campo total
    let valorTotal = +this.f.distribuirTotal.value;
    let sumaValores = (+this.f.cuantoPagaInstruccion.value + +this.f.cuantoPagaDonativo.value + +this.f.cuantoPagaCuido.value);
    
    if(valorTotal !== sumaValores) {
      this.f.distribuirTotal.setErrors({'incorrect': true});
      this.verificarTotal = true;
      return this.alertaWarning('Valores deben coincidir con el campo total');
    }
    this.verificarTotal = false;
    
    //Validar codigo de familia
    let codigoFamilia = this.f.codigoFamilia.value;
    if(codigoFamilia.length !== 5) return this.alertaWarning('Código de familia debe tener 5 caracteres.');
    if(!isNaN(codigoFamilia[0])) return this.alertaWarning('El primer caracter del codigo de Familia debe ser una letra.');
    if(isNaN(+codigoFamilia.split(codigoFamilia[0]).reverse()[0]) && codigoFamilia.split(codigoFamilia[0]).reverse()[0].length == 4) return this.alertaWarning('Solo puede entrar una letra del abecedario y 4 números');

    this.validarCodigoFamilia(codigoFamilia).subscribe((res) => {
      if(res) return this.alertaWarning('Código de familia ya existe.');
      
      if (this.familyForm.valid) {
        let familyForm = {
          addFormGuardian: this.f.addFormGuardian.value,
          dadForm: this.familyForm.value.formDad.value,
          momForm: this.familyForm.value.formMom.value,
          pagoAutomatico: this.f.pagoAutomatico.value,
          planPagoDonaciones: this.f.planPagoDonaciones.value,
          codigoFamilia: this.f.codigoFamilia.value.toUpperCase(),
          donativoAnual: this.f.donativoAnual.value,
          donativoFuturo: this.f.donativoFuturo.value,
          // billingAddress: this.f.billingAddress.value,
          // circularAddress: this.f.circularAddress.value
          addressFacturacionLineOne: this.f.addressFacturacionLineOne.value,
          addressFacturacionLineTwo: this.f.addressFacturacionLineTwo.value,
          addressFacturacionCity: this.f.addressFacturacionCity.value,
          addressFacturacionCountry: this.f.addressFacturacionCountry.value,
          facturacionZipCode: this.f.facturacionZipCode.value,
          addressCircularLineOne: this.f.addressCircularLineOne.value,
          addressCircularLineTwo: this.f.addressCircularLineTwo.value,
          addressCircularCity: this.f.addressCircularCity.value,
          addressCircularCountry: this.f.addressCircularCountry.value,
          circularZipCode: this.f.circularZipCode.value,
          distribuirTotal: this.f.distribuirTotal.value,
          cuantoPagaInstruccion: this.f.cuantoPagaInstruccion.value,
          cuantoPagaDonativo: this.f.cuantoPagaDonativo.value,
          cuantoPagaCuido: this.f.cuantoPagaCuido.value
        }
  
        //Value Tipo de tarjeta
        familyForm['tipoTarjeta'] = this.f.tipoTarjeta.value ? this.f.tipoTarjeta.value : null;
        // this.f.tipoTarjeta.value ? familyForm['tipoTarjeta'] = this.f.tipoTarjeta.value : familyForm['tipoTarjeta'] = null;
  
        if (this.showFormGuardian) {
          familyForm["guardianForm"] = this.guardianComponent.familyGuardianForm.value
        }
        // valida que existan años para crear la familia
        if(this.listaAnios.length == 0) {
          this.alertaWarning('Se debe iniciar el año para crear una familia');
          return;
        }
        // Fechas startAnio
        familyForm["fromDateAnio"] = this.listaAnios[this.listaAnios.length - 1].fromDateAnio;
        familyForm["toDateAnio"] = this.listaAnios[this.listaAnios.length - 1].toDateAnio;
  
        this.familyService.saveFamily(familyForm).subscribe(
          res => {
            Swal.fire({
              title: 'Exitoso!',
              text: 'Familia creada correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              timer: 2500
            });
            this.setFormFamily();
          },
          err => {
            console.log(err);
          }
        )
      }
    });
	}
  
  public updateFamily():void {
    return;
  }

  validarCodigoFamilia(codigoFamilia: any): Observable<boolean> {
    var subject = new Subject<boolean>();
    this.familyService.validateFamily(codigoFamilia.toUpperCase()).subscribe(
      res => {
        subject.next(res.existeFamiliaByCode);
      },
      err => {
        console.log(err);
      }
    )

    return subject.asObservable();      
  }

	/**
	 * Metodo que permite controlar las acciones del boton siguiente
	 */
	// public siguienteFormulario(): void {
	// 	this.submitted = true;

	// 	if (!this.mostrarFormMom && !this.dadComponent.familyDadForm.invalid) {
	// 		this.mostrarFormMom = true;
	// 		this.submitted = false;
	// 		this.cdr.detectChanges();
	// 		this.f.formDad.setValue(this.dadComponent.familyDadForm);
	// 		this.desactivarBotonSig = true;
	// 	}
  // }
  
  private setFormFamily() {
		this.cdr.detectChanges();
		this.submitted = false;
		if(this.dadComponent) {
			this.dadComponent.familyDadForm.reset();
		}
		if(this.momComponent) {
			this.momComponent.familyMomForm.reset();
		}
		if(this.guardianComponent) {
			this.guardianComponent.familyGuardianForm.reset();
		}
		// this.mostrarFormDad = false;
		// this.mostrarFormMom = false;
		// this.desactivarBotonSig = false;
		this.familyForm.reset();
		this.f.addFormGuardian.setValue(false);
		this.f.pagoAutomatico.setValue(false);		
  }
  
  /**
	 * Metodo que permite cambiar de vista para registrar una nueva familia
	 */
	public volver(): void {
    this.router.navigate(['/dashboard', { outlets: { procesoDashboard: ['family'] } }]);
  }

  alertaWarning(msg: any): void {
    Swal.fire({
      title: 'warning!',
      text: msg,
      icon: 'warning'
    });
  }
  
  /**
   * Metodo que permite obtener la lista de anios creados
   */
  public getAnios(): void {
    this.startAnioService.getStartAnios().subscribe(
      response => {
        if(response.status) {
          this.listaAnios = response.startAnios;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  public buscarFamiliaByCode(event: any): void {
    let codigoFamilia = event.trim();
    this.f.distribuirTotal.setErrors(null);
    this.mostrarMensajeError = false;
    if(codigoFamilia.length == 5) {
      this.f.codigoFamilia.disable();
      this.validarCodigoFamilia(codigoFamilia).subscribe((res) => {
        this.f.codigoFamilia.enable();
        if(res) return this.alertaWarning('Código de familia ya existe.');
        if(codigoFamilia.length > 5) return this.alertaWarning('Código de familia debe tener 5 caracteres.');
      })
    }
  }

  public validarCaracteres(event: any): void {
    let codigoFamilia = event.trim();
    this.mostrarMensajeError = false;
    if(codigoFamilia.length < 5) {
      this.f.codigoFamilia.setErrors({'incorrect': true});
      this.mostrarMensajeError = true;
    }
  }
}
