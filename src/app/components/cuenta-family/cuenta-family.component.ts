import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FamilyService } from '../../services/family.service';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { CuentaFamilyService } from '../../services/cuenta-family.service';
import Swal from 'sweetalert2';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-cuenta-family',
  templateUrl: './cuenta-family.component.html',
  providers: [DecimalPipe]
})
export class CuentaFamilyComponent implements OnInit {

  public familyCode: string;
  public family: any = [];
  public ultimoEstadoCuentaFamily: any;
  public cuentaFamilyForm: FormGroup;
  public mostarInfoFamily: boolean = false;
  public submitted: boolean = false;

  public cuentaStudentForm: FormGroup;
  public controlFormStudent: any;
  public students: any;
  public listStudent: Array<any> = [];

  @Input() fromFamily : boolean = false;
  @Input() codigoFamilia: string = '';
  @Input() idStudent: string = '';

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private familyService: FamilyService,
    private formBuilder: FormBuilder,
    private cuentaFamilyService: CuentaFamilyService,
    private _decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    if(this.fromFamily) {
      this._route.params.subscribe(params => {
        this.familyCode = params.code;
      });
    } else {
      this.familyCode = this.codigoFamilia;
    }
    this.getFamilyFromCuenta(this.familyCode);
    this.cuentaFamilyForm = this.formBuilder.group({
      donativoFuturo: [null, Validators.required],
      donativoAnual: [null, Validators.required],
      // cuido: [null, Validators.required],
      yearbook: [null, Validators.required],
      security: [null, Validators.required],
      maintenance: [null, Validators.required],
      technology: [null, Validators.required],
      recargo: [null, Validators.required],
      // montoLibrosDigitales: [null, Validators.required]
		})
  }

  get f() {
		return this.cuentaFamilyForm.controls;
  }

  get x() {
    return this.cuentaStudentForm.controls;
  }

  /**
   * Metodo que permite obtener la informacion de familia
   * @param code Codigo familia
   */
  public getFamilyFromCuenta(code: any): void {
    this.familyService.getFamilyFromCuenta(code).subscribe(
      response => {
        this.mostarInfoFamily = true;
        this.family = response.family;
        if(this.fromFamily) {
          this.students = response.family.students;
        } else {
          this.students = response.family.students.filter(student => student._id === this.idStudent);
        }
        this.ultimoEstadoCuentaFamily = response.family.estadoCuenta[response.family.estadoCuenta.length - 1];
        this.getInfoForms();
        // SET Valores to Form
        if(this.ultimoEstadoCuentaFamily) {
          this.f.donativoFuturo.setValue(this.transformDecimal(this.ultimoEstadoCuentaFamily.donativoFuturo));
          this.f.donativoAnual.setValue(this.transformDecimal(this.ultimoEstadoCuentaFamily.donativoAnual));
          // this.f.cuido.setValue(this.transformDecimal(this.ultimoEstadoCuentaFamily.cuido));
          this.f.recargo.setValue(this.transformDecimal(this.ultimoEstadoCuentaFamily.recargo));
          // this.f.montoLibrosDigitales.setValue(this.transformDecimal(this.ultimoEstadoCuentaFamily.montoLibrosDigitales));
          // this.f.totalGraduationFee.setValue(this.transformDecimal(this.ultimoEstadoCuentaFamily.totalGraduationFee));
          // Cuotas especiales
          this.f.yearbook.setValue(this.transformDecimal(this.ultimoEstadoCuentaFamily.yearbook));
          this.f.security.setValue(this.transformDecimal(this.ultimoEstadoCuentaFamily.security));
          this.f.maintenance.setValue(this.transformDecimal(this.ultimoEstadoCuentaFamily.maintenance));
          this.f.technology.setValue(this.transformDecimal(this.ultimoEstadoCuentaFamily.technology));
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'No existe estado de cuenta, verificar DB',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }


        console.log(response);
      },
      error => {
        console.log(error);
      }
    )
  }

  private getInfoForms():void {
    this.students.forEach((elemen, index) => {
      this.crearFormStudent(index);
      this.x['instruccionAnualStudent' + index].setValue(this.transformDecimal(elemen.instruccionAnualStudent));
      this.x['meses' + index].setValue(elemen.meses);
      this.x['instruccionStudent' + index].setValue(this.transformDecimal(elemen.instruccionStudent));
      this.x['matriculaStudent' + index].setValue(this.transformDecimal(elemen.matriculaStudent));
      this.x['seguroStudent' + index].setValue(this.transformDecimal(elemen.seguroStudent));
      this.x['graduacionStudent' + index].setValue(this.transformDecimal(elemen.graduationFee));
      this.x['cuidoStudent' + index].setValue(this.transformDecimal(elemen.cuido));
      this.x['librosDigitalesStudent' + index].setValue(this.transformDecimal(elemen.librosDigitales));
      //console.log(elemen);
    });
  }

  public actualizarCuenta(planPagoDonaciones?: any, isFamiliy?: boolean): void {
    if (this.ultimoEstadoCuentaFamily) {
      if(this.family.students.length > 0) this.getDatosFormCuentaStudents();
      if(this.fromFamily) this.getDatosFormCuenta();
      this.crearTotales();
      // crear totalMensualidadDonativo para EC
      let totalMensualidadDonativo = 0;
      if(planPagoDonaciones == 1 || planPagoDonaciones == 2) {
        totalMensualidadDonativo = this.family.estadoCuenta[0].donativoAnual / 10;
      } else {
        totalMensualidadDonativo = this.family.estadoCuenta[0].donativoAnual;
      }
      this.family.estadoCuenta[0].totalMensualidadDonativo = totalMensualidadDonativo;
      // End
      this.cuentaFamilyService.updateEstadoCuentaFamily(this.family).subscribe(
        response => {
          if(response.status) {
            if(isFamiliy) return;
            Swal.fire({
              title: 'Exitoso!',
              text: response.messagge,
              icon: 'success',
              confirmButtonText: 'Aceptar',
              timer: 2000
            });
          }
          //console.log(response);
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  /**
   * Metodo que permite SET los valores del formualrio en cada estudiante
   */
  public getDatosFormCuentaStudents():void {
    this.cuentaStudentForm.updateValueAndValidity();
    this.ultimoEstadoCuentaFamily.totalMensualidadGradoStudents = 0;
    this.ultimoEstadoCuentaFamily.totalAnualMensualidadGradoStudents = 0;
    this.ultimoEstadoCuentaFamily.totalMatriculaStudents = 0;
    this.ultimoEstadoCuentaFamily.totalSeguroStudents = 0;
    this.ultimoEstadoCuentaFamily.totalGraduationFee = 0;
    this.ultimoEstadoCuentaFamily.cuido = 0;
    this.ultimoEstadoCuentaFamily.montoLibrosDigitales = 0;
    this.family.students.forEach((element, index) => {
      element.instruccionAnualStudent = +this.cuentaStudentForm.value['instruccionAnualStudent' + index].replace(',', '');
      element.meses = +this.cuentaStudentForm.value['meses' + index];
      element.instruccionStudent = +this.cuentaStudentForm.value['instruccionStudent' + index].replace(',', '');
      element.matriculaStudent = +this.cuentaStudentForm.value['matriculaStudent' + index].replace(',', '');
      element.seguroStudent = +this.cuentaStudentForm.value['seguroStudent' + index].replace(',', '');
      element.cuidoStudent = +this.cuentaStudentForm.value['cuidoStudent' + index].replace(',', '');
      element.librosDigitalesStudent = +this.cuentaStudentForm.value['librosDigitalesStudent' + index].replace(',', '');

      if(element.graduationFee) {
        element.graduationFee = +this.cuentaStudentForm.value['graduacionStudent' + index].replace(',', '');
        this.ultimoEstadoCuentaFamily.totalGraduationFee += element.graduationFee;
      }

      this.ultimoEstadoCuentaFamily.totalMensualidadGradoStudents += element.instruccionStudent;
      this.ultimoEstadoCuentaFamily.totalAnualMensualidadGradoStudents += element.instruccionAnualStudent;
      this.ultimoEstadoCuentaFamily.totalMatriculaStudents += element.matriculaStudent;
      this.ultimoEstadoCuentaFamily.totalSeguroStudents += element.seguroStudent;
      this.ultimoEstadoCuentaFamily.cuido += element.cuidoStudent;
      this.ultimoEstadoCuentaFamily.montoLibrosDigitales += element.librosDigitalesStudent;

    });
    console.log(this.family);
  }

  // Get valores to form
  private getDatosFormCuenta():void {
    this.ultimoEstadoCuentaFamily.donativoFuturo = +this.f.donativoFuturo.value.replace(',' ,'');
    this.ultimoEstadoCuentaFamily.donativoAnual = +this.f.donativoAnual.value.replace(',' ,'');
    // this.ultimoEstadoCuentaFamily.cuido = +this.f.cuido.value;
    this.ultimoEstadoCuentaFamily.recargo = +this.f.recargo.value;
    // this.ultimoEstadoCuentaFamily.montoLibrosDigitales = +this.f.montoLibrosDigitales.value;
    // this.ultimoEstadoCuentaFamily.totalGraduationFee = +this.f.totalGraduationFee.value;
    // Cuotas especiales
    this.ultimoEstadoCuentaFamily.yearbook = +this.f.yearbook.value;
    this.ultimoEstadoCuentaFamily.security = +this.f.security.value;
    this.ultimoEstadoCuentaFamily.maintenance = +this.f.maintenance.value;
    this.ultimoEstadoCuentaFamily.technology = +this.f.technology.value;
  }

  /**
   * Metodo que permite SET todos los totales con los valores modificados
   */
  private crearTotales():void {
    let total = 0;

    total += (
      this.ultimoEstadoCuentaFamily.maintenance +
      this.ultimoEstadoCuentaFamily.security +
      this.ultimoEstadoCuentaFamily.technology +
      this.ultimoEstadoCuentaFamily.yearbook
    ) + this.ultimoEstadoCuentaFamily.donativoAnual + this.ultimoEstadoCuentaFamily.donativoFuturo + this.ultimoEstadoCuentaFamily.recargo;

    if(this.ultimoEstadoCuentaFamily.totalAnualMensualidadGradoStudents) {
      this.ultimoEstadoCuentaFamily.totalAdmissionFeeStudents = this.ultimoEstadoCuentaFamily.totalMatriculaStudents + this.ultimoEstadoCuentaFamily.totalSeguroStudents;
      total += this.ultimoEstadoCuentaFamily.totalAnualMensualidadGradoStudents + this.ultimoEstadoCuentaFamily.totalAdmissionFeeStudents + this.ultimoEstadoCuentaFamily.totalGraduationFee + this.ultimoEstadoCuentaFamily.cuido + this.ultimoEstadoCuentaFamily.montoLibrosDigitales;
    }
    // Estudiantes
    // if(this.fromFamily) {

    // } else {
    //   this.ultimoEstadoCuentaFamily.totalAnualMensualidadGradoStudents = this.ultimoEstadoCuentaFamily.totalMensualidadGradoStudents * 10;
    //   this.ultimoEstadoCuentaFamily.totalAdmissionFeeStudents = this.ultimoEstadoCuentaFamily.totalMatriculaStudents + this.ultimoEstadoCuentaFamily.totalSeguroStudents;
    //   total += (this.ultimoEstadoCuentaFamily.totalMensualidadGradoStudents * 10) + this.ultimoEstadoCuentaFamily.totalAdmissionFeeStudents + this.ultimoEstadoCuentaFamily.totalGraduationFee;
    // }
    // Total Anual
    this.ultimoEstadoCuentaFamily.totalAnual = total;
  }
  /**
   * Metodo que permite crear el control para el formulario del estudiante
   * @param idStudent idControl para crear fomurlario estudiante
   */
  public crearFormStudent(idStudent: any, studentNuevo?: boolean): void {
    let student = {};
    student["students" + idStudent] = [
      { label: "instruccionAnualStudent" + idStudent },
      { label: "meses" + idStudent },
      { label: "instruccionStudent" + idStudent },
      { label: "matriculaStudent" + idStudent },
      { label: "seguroStudent" + idStudent },
      { label: "graduacionStudent" + idStudent },
      { label: "cuidoStudent" + idStudent },
      { label: "librosDigitalesStudent" + idStudent }
    ]

    let arrStudent = []
    arrStudent.push(student);
    this.controlFormStudent = arrStudent;
    this.listStudent = this.listStudent.concat(arrStudent);

    this.addStudentToForm();
  }

   /**
   * Metodo que permite agregar un estudiante al formulario
   * de creacion
   */
  public addStudentToForm() {
    let group = {}
    this.cuentaStudentForm = this.cuentaStudentForm ? this.cuentaStudentForm : new FormGroup(group);
    this.controlFormStudent.forEach(e => {
      for (const key in e) {
        if (e.hasOwnProperty(key)) {
          const element = e[key];
          element.forEach(el => {
            group[el.label] = new FormControl(null, [Validators.required]);
            this.cuentaStudentForm.addControl(el.label, group[el.label]);
          })
        }
      }
    })
  }

  public validateControlErrors(nameControl: any, posicion: any) {
    return this.x[nameControl + posicion].errors;
  }

  public validateControlInvalid(nameControl: any, posicion: any) {
    return this.x[nameControl + posicion].invalid;
  }

  /**
	 * Metodo que permite cambiar de vista para registrar una nueva familia
	 */
  public volver(): void {
    this._router.navigate(['/dashboard', { outlets: { procesoDashboard: ['family'] } }]);
  }

  /**
   * Metodo que permite convertir numero con decimalPipe
   * @param num Numero a transformar
   */
  transformDecimal(num) {
    return this._decimalPipe.transform(num, '1.2-2');
  }

  public obtenerInstruccionMensual(event: any): void {
    if(event) {
      this.cuentaStudentForm.updateValueAndValidity();
      let instruccionAnual = +this.x.instruccionAnualStudent0.value.replace(',', '');
      let instruccionMensual = (instruccionAnual / +event).toFixed(2);
      this.x.instruccionStudent0.setValue(this.transformDecimal(instruccionMensual));
      this.x.instruccionAnualStudent0.setValue(this.transformDecimal(instruccionAnual));
    }
  }

}
