import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FamilyService } from '../../../services/family.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DadComponent } from '../dad/dad.component';
import { MomComponent } from '../mom/mom.component';
import { GuardianComponent } from '../guardian/guardian.component';
import { CuentaFamilyComponent } from '../../cuenta-family/cuenta-family.component';
import Swal from 'sweetalert2';
import { PriceGradeService } from '../../../services/price-grade.service';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import { Observable, Subject } from 'rxjs';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-edit-family',
  templateUrl: '../create-family/create-family.component.html'
})
export class EditFamilyComponent implements OnInit, AfterViewInit {

  public familyForm: FormGroup;
  public showFormGuardian: boolean = false;
  public submitted: boolean = false;
  public family: any;
  public items: Array<any> = [];
  public posicionesControl: Array<any> = [];
  public mostrarFormDad: boolean = true;
  public mostrarFormMom: boolean = true;
  public priceGrades: Array<any> = [];
  public isModoEdit: boolean = true;
  public desactivarBotonSig: boolean = false;
  public familyCode: string;
  public arrInfoFamily: Array<any> = [];
  public newStudents: any;
  public mostrarTipoTarjeta: boolean = false;
  public mostrarDonativos: boolean = false;
  public verificarTotal: boolean = false;
  public mostrarMensajeError: boolean = false;

  //@ViewChild(StudentFamilyComponent, { static: false }) studentFamilyComponent;
  @ViewChild(DadComponent, { static: false }) dadComponent;
  @ViewChild(MomComponent, { static: false }) momComponent;
  @ViewChild(GuardianComponent, { static: false }) guardianComponent;  
  @ViewChild(CuentaFamilyComponent, { static: false }) cuentaFamilyComponent;
  @ViewChild('inputCodigoFamilia', { static: false }) inputCodigoFamilia;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private familyService: FamilyService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    // private _priceGradeService: PriceGradeService
  ) { }

  ngOnInit(): void {
    // this.getGradePrices();
    this._route.params.subscribe(params => {
      this.familyCode = params.code;

      this.getFamily(this.familyCode);
    });
    
    this.familyForm = this.formBuilder.group({
      addFormGuardian: [false],
      // formStudent: [null, Validators.required],
      formDad: [null, Validators.required],
      formMom: [null, Validators.required],
      formGuardian: [null],
      pagoAutomatico: [false, Validators.required],
      tipoTarjeta: [null],
      planPagoDonaciones: [null],
      distribuirTotal: [0],
      cuantoPagaInstruccion: [0],
      cuantoPagaDonativo: [0],
      cuantoPagaCuido: [0],
      codigoFamilia: [null],
      // billingAddress: [null],
      // circularAddress: [null]
      addressFacturacionLineOne: [null],
      addressFacturacionLineTwo: [null],
      addressFacturacionCity: [null],
      addressFacturacionCountry: [null],
      facturacionZipCode: [null],
      addressCircularLineOne: [null],
      addressCircularLineTwo: [null],
      addressCircularCity: [null],
      addressCircularCountry: [null],
      circularZipCode: [null],
    })    
  }

  ngAfterViewInit() :void {
    // this.desactivarGradosEstudiantes();
    // this.cdr.detectChanges();
  }

  get f() {
    return this.familyForm.controls;
  }


  /**
   * Metodo que permite obtener la familia
   * @param code codigoFamilia
   */
  public getFamily(code: any): void {
    this.familyService.getFamily(code).subscribe(
      response => {
        this.family = response.family;
        this.f.pagoAutomatico.setValue(this.family.pagoAutomatico)
        this.f.addFormGuardian.setValue(this.family.addFormGuardian)
        this.f.tipoTarjeta.setValue(this.family.tipoTarjeta)
        this.f.planPagoDonaciones.setValue(this.family.planPagoDonaciones);
        this.f.cuantoPagaInstruccion.setValue(this.family.cuantoPagaInstruccion);
        this.f.cuantoPagaDonativo.setValue(this.family.cuantoPagaDonativo);
        this.f.cuantoPagaCuido.setValue(this.family.cuantoPagaCuido);
        this.f.codigoFamilia.setValue(this.family.codigoFamilia);
        // this.f.billingAddress.setValue(this.family.billingAddress);
        // this.f.circularAddress.setValue(this.family.circularAddress);
        this.f.distribuirTotal.setValue(this.family.distribuirTotal);
        this.f.addressFacturacionLineOne.setValue(this.family.addressFacturacionLineOne);
        this.f.addressFacturacionLineTwo.setValue(this.family.addressFacturacionLineTwo);
        this.f.addressFacturacionCity.setValue(this.family.addressFacturacionCity);
        this.f.addressFacturacionCountry.setValue(this.family.addressFacturacionCountry);
        this.f.facturacionZipCode.setValue(this.family.facturacionZipCode);
        this.f.addressCircularLineOne.setValue(this.family.addressCircularLineOne);
        this.f.addressCircularLineTwo.setValue(this.family.addressCircularLineTwo);
        this.f.addressCircularCity.setValue(this.family.addressCircularCity);
        this.f.addressCircularCountry.setValue(this.family.addressCircularCountry);
        this.f.circularZipCode.setValue(this.family.circularZipCode);
        // this.f.planPagoDonaciones.disable();
        // console.log(response)
        if(this.family.addFormGuardian) {
          this.showFormGuardian = this.f.addFormGuardian.value;
          this.cdr.detectChanges();
          // this.f.addFormGuardian.setValue(true);
          this.agregarDataFormGuardian();
        }
        this.getInfoForms();
      },
      error => {
        console.log(error);
      }
    )
  }

  public modelDonativo(event: any) {
    return;
  }

  public modelPagoAutomatico(event: any) {
    if(event) {
      this.mostrarTipoTarjeta = true;
      this.f.tipoTarjeta.setValidators([Validators.required])
    } else {
      this.f.tipoTarjeta.setValue(null);
      this.f.cuantoPagaInstruccion.setValue(0);
      this.f.cuantoPagaDonativo.setValue(0);
      this.f.cuantoPagaCuido.setValue(0);
      this.f.tipoTarjeta.clearValidators();
      this.mostrarTipoTarjeta = false;
    }
    this.f.tipoTarjeta.updateValueAndValidity();
  }

  /**
   * Metodo que rellena el formulario con la informacion de la familia
   */
  public getInfoForms(): void {

    // Form dad
    let dad = this.family.dad;
    let objDad = {};
    for (const key in dad) {
      if(key != '_id' && key != '__v' && key != 'codigoFamilia' && key != 'inactivar') {
        if (dad.hasOwnProperty(key)) {
          const element = dad[key];
          objDad[key + 'Dad'] = element;           
        }
      }
    }
    this.dadComponent.familyDadForm.setValue(objDad);
    this.f.formDad.setValue(this.dadComponent.familyDadForm);

    // form Mom
    let mom = this.family.mom;
    let objMom = {};
    for (const key in mom) {
      if(key != '_id' && key != '__v' && key != 'codigoFamilia' && key != 'inactivar') {
        if (mom.hasOwnProperty(key)) {
          const element = mom[key];
          objMom[key + 'Mom'] = element;           
        }
      }
    }
    this.momComponent.familyMomForm.setValue(objMom);
    this.f.formMom.setValue(this.momComponent.familyMomForm);

  }

  /**
   * Metodo que controla el evento para mostrar form guardian
   * @param event evento switch guardian
   */
  public cambio(event: any) {
    this.showFormGuardian = event;
    this.cdr.detectChanges();
    if(event) {
      this.agregarDataFormGuardian();
    }
  }

  public agregarDataFormGuardian(): void {
    // Form guardian
    let guardian = this.family.guardian;
    let objGuardian = {};
    for (const key in guardian) {
      if(key != '_id' && key != '__v' && key != 'codigoFamilia' && key != 'inactivar') {
        if (guardian.hasOwnProperty(key)) {
          const element = guardian[key];
          objGuardian[key + 'Guardian'] = element;           
        }
      }
    }
    this.guardianComponent.familyGuardianForm.setValue(objGuardian);
    this.f.formGuardian.setValue(this.guardianComponent.familyGuardianForm);
  }

  /**
   * Metodo que permite actualizar una familia
   */
  public updateFamily(): void {
    this.submitted = true;
    this.f.distribuirTotal.setErrors(null);
    if (this.familyForm.invalid || !this.familyForm.value.formMom.valid || !this.familyForm.value.formDad.valid) {
      return;
    }

    // Validar campo total
    let valorTotal = +this.f.distribuirTotal.value;
    if(!isNaN(valorTotal)){
      let sumaValores = (+this.f.cuantoPagaInstruccion.value + +this.f.cuantoPagaDonativo.value + +this.f.cuantoPagaCuido.value);
      if(valorTotal !== sumaValores) {
        this.f.distribuirTotal.setErrors({'incorrect': true});
        this.verificarTotal = true;
        return this.alertaWarning('Valores deben coincidir con el campo total');
      }
      this.verificarTotal = false;
    }

    //Validar codigo de familia
    let codigoFamilia = this.f.codigoFamilia.value;
    if(codigoFamilia.length !== 5) return this.alertaWarning('Código de familia debe tener 5 caracteres.');
    if(!isNaN(codigoFamilia[0])) return this.alertaWarning('Codigo de Familia, el primer caracter del codigo de Familia debe ser una letra.');
    if(isNaN(+codigoFamilia.split(codigoFamilia[0]).reverse()[0]) && codigoFamilia.split(codigoFamilia[0]).reverse()[0].length == 4) return this.alertaWarning('Codigo de Familia, solo puede entrar una letra del abecedario y 4 números');
    this.validarCodigoFamilia(codigoFamilia).subscribe((res) => {
      if(res && codigoFamilia != this.family.codigoFamilia) return this.alertaWarning('Código de familia ya existe.');

      this.setInformacionFamily(this.familyForm.value.formDad.value, this.family.dad, 'Dad');
      this.setInformacionFamily(this.familyForm.value.formMom.value, this.family.mom, 'Mom');
      if(this.familyForm.value.formGuardian) {
        this.familyForm.value.formGuardian.updateValueAndValidity();
        this.setInformacionFamily(this.familyForm.value.formGuardian.value, this.family.guardian, 'Guardian');
      }
      
      this.family.pagoAutomatico = this.f.pagoAutomatico.value;
      this.family.addFormGuardian = this.f.addFormGuardian.value;
      this.family.tipoTarjeta = this.f.tipoTarjeta.value;
      this.family.planPagoDonaciones = this.f.planPagoDonaciones.value;
      this.family.cuantoPagaInstruccion = isNaN(+this.f.cuantoPagaInstruccion.value) ? 0 : +this.f.cuantoPagaInstruccion.value;
      this.family.cuantoPagaDonativo = isNaN(+this.f.cuantoPagaDonativo.value) ? 0 : +this.f.cuantoPagaDonativo.value;
      this.family.cuantoPagaCuido = isNaN(+this.f.cuantoPagaCuido.value) ? 0 : +this.f.cuantoPagaCuido.value;
      this.family.codigoFamilia = codigoFamilia;

      // Actualiza la cuenta
      this.cuentaFamilyComponent.actualizarCuenta(this.family.planPagoDonaciones);
      this.familyService.updateFamily(this.family).subscribe(
        response => {
          if(response.status) {
            Swal.fire({
              title: 'Exitoso!',
              text: response.messagge,
              icon: 'success',
              confirmButtonText: 'Aceptar',
              timer: 2500
            });
            this.volver();
          }
        },
        error => {
          console.log(error);
        }
      )
    });
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
   * Método que permite SET la informacion de la familia para actualizar
   * @param formData Data del formulario
   * @param familyData Informacion de la familia viene del REST
   * @param parentesco Parentesco de la familia
   */
  public setInformacionFamily(formData: any, familyData: any, parentesco: any) {
    for (const key in familyData) {
      if(key != '_id' && key != '__v') {
        if (familyData.hasOwnProperty(key)) {
          familyData[key] = formData[key + parentesco];
          if(key === 'inactivar') familyData[key] = false;
        }
      }
    }
    familyData['codigoFamilia'] = this.family.codigoFamilia;
  }

  
  /**
   * Metodos que se necesitan declarar por que se usa el mismo HTML del componente
   * de crear, entonces en el TS sale error por no tenerlos...
   */
  public saveFamily():void {
    return;
  }
  public siguienteFormulario(): void {
    return;
  }

  alertaWarning(msg: any): void {
    Swal.fire({
      title: 'warning!',
      text: msg,
      icon: 'warning'
    });
  }

  /**
	 * Metodo que permite cambiar de vista para registrar una nueva familia
	 */
  public volver(): void {
    this._router.navigate(['/dashboard', { outlets: { procesoDashboard: ['family'] } }]);
  }

  public buscarFamiliaByCode(event: any): void {    
    let codigoFamilia = event.trim();
    this.f.distribuirTotal.setErrors(null);
    this.mostrarMensajeError = false;
    if(codigoFamilia.toUpperCase() !== this.family.codigoFamilia && codigoFamilia.length == 5) {
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
