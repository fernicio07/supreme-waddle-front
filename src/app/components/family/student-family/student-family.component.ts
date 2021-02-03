import { DecimalPipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;
import Swal from 'sweetalert2';

@Component({
  selector: 'student-family',
  templateUrl: './student-family.component.html',
  providers: [DecimalPipe]
})
export class StudentFamilyComponent implements OnInit {

  @Input() submitted: boolean;
  @Input() priceGrades: Array<any> = [];
  // @Input() idStudent: number;
  @Input() isModoEdit: boolean;
  public items: Array<any> = [0];
  public posicionesControl: Array<any> = [0];
  public controlFormStudent: any;
  public valorFecha: string;
  public birthDayStudents: any = {};
  public tmpInstruccionAnual: any;
  public tmpInstruccionMensual: any;

  public listStudent: Array<any> = [];
  public familyStudentForm: FormGroup;

  constructor(
    private _decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.crearFormStudent(0, false);
  }
  public addStudent(studentNuevo: boolean): void {
    this.items.push(this.items.length);
    //if(!this.isModoEdit) {
      this.posicionesControl.push(this.items.length - 1);
    //}    
    this.crearFormStudent(this.items.length - 1, studentNuevo);
  }

  /**
   * Metodo que permite crear el control para el formulario del estudiante
   * @param idStudent idControl para crear fomurlario estudiante
   */
  public crearFormStudent(idStudent: any, studentNuevo: boolean): void {
    let student = {};
    student["students" + idStudent] = [
      { label: "gradeStudent" + idStudent },
      { label: "nameStudent" + idStudent },
      // { label: "middleNameStudent" + idStudent },
      { label: "lastNameStudent" + idStudent },
      //{ label: "maidenNameStudent" + idStudent },
      { label: "birthdayDateStudent" + idStudent },
      { label: "birthdayPlaceStudent" + idStudent },
      { label: "ciudadaniaStudent" + idStudent },
      // { label: "numberPhoneStudent" + idStudent },      
      { label: "insuranceSocialStudent" + idStudent },
      { label: "livewithStudent" + idStudent },
      { label: "hijoMaestroStudent" + idStudent },

      { label: "instruccionAnualStudent" + idStudent},
      { label: "meses" + idStudent},
      { label: "instruccionMensualStudent" + idStudent},
      { label: "matriculaStudent" + idStudent},
      { label: "seguroStudent" + idStudent},
      { label: "cuidoStudent" + idStudent},
      { label: "librosDigitalesStudent" + idStudent},
      { label: "_idStudent" + idStudent }
      
    ]

    let arrStudent = []
    arrStudent.push(student);
    this.controlFormStudent = arrStudent;

    if(studentNuevo) {
      var objStudent =  JSON.parse(JSON.stringify(student));
      objStudent['studentNuevo'] = studentNuevo;
      let item = [];
      item.push(objStudent);
      this.listStudent = this.listStudent.concat(item);
    } else {
      this.listStudent = this.listStudent.concat(arrStudent);
    }   
    
    this.addStudentToForm();
  }

  /**
   * Metodo que permite agregar un estudiante al formulario
   * de creacion
   */
  public addStudentToForm() {
    let group = {}
    this.familyStudentForm = this.familyStudentForm ? this.familyStudentForm : new FormGroup(group);
    this.controlFormStudent.forEach(e => {
      for (const key in e) {
        if (e.hasOwnProperty(key)) {
          const element = e[key];
          element.forEach(el => {
            if(el.label.indexOf("_id") >= 0) {
              group[el.label] = new FormControl(null);
            } else {
              group[el.label] = new FormControl(null, [Validators.required]);
              if(el.label.indexOf("hijoMaestro") >= 0) {
                group[el.label].setValue(false);
              }
              if(el.label.indexOf("meses") >= 0) {
                group[el.label].setValue(10);
              }
              if(el.label.indexOf("matriculaStudent") >= 0) {
                group[el.label].setValue(this.transformDecimal(0));
              }
              if(el.label.indexOf("seguroStudent") >= 0) {
                group[el.label].setValue(this.transformDecimal(0));
              }
              if(el.label.indexOf("cuidoStudent") >= 0) {
                group[el.label].setValue(this.transformDecimal(0));
              }
              if(el.label.indexOf("librosDigitalesStudent") >= 0) {
                group[el.label].setValue(this.transformDecimal(0));
              }
            }
            this.familyStudentForm.addControl(el.label, group[el.label]);
          })
        }
      }
    })
    //this.familyStudentForm = new FormGroup(group);
  }

  public obtenerInstruccionMensual(event: any, indexControl: any): void {
    if(event) {
      let gradoSeleccionado = this.priceGrades.find(grado => grado._id == this.f["gradeStudent" + indexControl].value);
      let instruccionAnualTmp = gradoSeleccionado.cost * 10;
      let instruccionMensualTmp = instruccionAnualTmp / this.f['meses' + indexControl].value;
      this.tmpInstruccionAnual = this.transformDecimal(instruccionAnualTmp);
      this.tmpInstruccionMensual = this.transformDecimal(instruccionMensualTmp);
      this.f['instruccionAnualStudent' + indexControl].setValue(this.transformDecimal(instruccionAnualTmp));
      this.f['instruccionMensualStudent' + indexControl].setValue(this.transformDecimal(instruccionMensualTmp));
    }
  }

  /**
   * Metodo que permite eliminar un estudiante dentro del formulario de
   * creacion.
   * @param posicion posicion de la lista de estudiantes
   */
  public removeStudent(posicion: any): void {    
    let objStudentControl = this.listStudent[posicion]['students' + this.posicionesControl[posicion]];
    for (const key in objStudentControl) {
      if (objStudentControl.hasOwnProperty(key)) {
        const element = objStudentControl[key];
        this.familyStudentForm.removeControl(element.label);
      }
    } 
    this.listStudent.splice(posicion, 1);
    this.posicionesControl.splice(posicion, 1);
  }

  public removeStudentFromEdit(posicion: any): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se eliminara el estudiante",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        console.log("Eliminando estudiante...");
        if(this.listStudent.length > 1) {
          let objStudentControl = this.listStudent[posicion]['students' + this.posicionesControl[posicion]];
          for (const key in objStudentControl) {
            if (objStudentControl.hasOwnProperty(key)) {
              const element = objStudentControl[key];
              this.familyStudentForm.removeControl(element.label);
            }
          } 
          this.listStudent.splice(posicion, 1);
          this.posicionesControl.splice(posicion, 1);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'No se puede eliminar el estudiante por que la familia debe tener al menos uno!!'
          })
        }
      }
    })
  }

  public validateControlErrors(nameControl: any, posicion: any) {
    return this.f[nameControl + posicion].errors;
  }

  public validateControlInvalid(nameControl: any, posicion: any) {
    return this.f[nameControl + posicion].invalid;
  }

  get f() {
    return this.familyStudentForm.controls;
  }

  get dateValue() {
    return moment(this.valorFecha, 'MM/DD/YYYY');
  }

  set dateValue(val) {
    this.valorFecha = moment(val).format('MM/DD/YYYY');
    this.propagateChange(this.valorFecha);
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>, controlName: any) {
    this.dateValue = moment(event.value, 'MM/DD/YYYY');
    this.birthDayStudents[controlName] = this.valorFecha;
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.dateValue = moment(value, 'MM/DD/YYYY');
    }
  }
  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  public cambio(event: any, formControlName: any): void {
    var expreg = new RegExp("[a-z]+");
    if(isNaN(event) && expreg.test(event) && event.length < 2) {
      this.f[formControlName].setValue(null);
    }
  }

  public cambioGrado(event: string, indexControl: any): void {
    if(event) {
      let gradoSeleccionado = this.priceGrades.find(grado => grado._id == event);
      let instruccionAnualTmp = gradoSeleccionado.cost * 10;
      let instruccionMensualTmp = instruccionAnualTmp / this.f['meses' + indexControl].value;
      this.tmpInstruccionAnual = this.transformDecimal(instruccionAnualTmp);
      this.tmpInstruccionMensual = this.transformDecimal(instruccionMensualTmp);
      this.f['instruccionAnualStudent' + indexControl].setValue(this.transformDecimal(instruccionAnualTmp));
      this.f['instruccionMensualStudent' + indexControl].setValue(this.transformDecimal(instruccionMensualTmp));
    }
  }

  transformDecimal(num) {
    return this._decimalPipe.transform(num, '1.2-2');
  }

  public modelChanged(event: any, indexControl: any): void {
    if(event) {
      this.tmpInstruccionAnual = this.f['instruccionAnualStudent' + indexControl].value;
      let instruccionAnualStudent = this.f['instruccionAnualStudent' + indexControl].value;
      instruccionAnualStudent = +(+instruccionAnualStudent.replace(',', '') / 2).toFixed(2);
      this.f['instruccionAnualStudent' + indexControl].setValue(this.transformDecimal(instruccionAnualStudent));
      // Mensual
      this.tmpInstruccionMensual = this.f['instruccionMensualStudent' + indexControl].value;
      let instruccionStudent = this.f['instruccionMensualStudent' + indexControl].value;
      instruccionStudent = +(+instruccionStudent / 2).toFixed(2);
      this.f['instruccionMensualStudent' + indexControl].setValue(this.transformDecimal(instruccionStudent));
    } else {
      this.f['instruccionAnualStudent' + indexControl].setValue(this.tmpInstruccionAnual);
      this.f['instruccionMensualStudent' + indexControl].setValue(this.tmpInstruccionMensual);
    }
  }
}
