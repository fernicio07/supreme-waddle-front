import { Component, OnInit, ViewChild } from '@angular/core';
import { MDBModalRef } from "angular-bootstrap-md";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import { FamilyService } from 'src/app/services/family.service';
import { DecimalPipe } from '@angular/common';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-editar-estudiante',
  templateUrl: './editar-estudiante.component.html',
  providers: [DecimalPipe]
})
export class EditarEstudianteComponent implements OnInit {

  public valorFecha: string;
  public nameParents: any;
  public tmpInstruccionAnual: any;
  public tmpInstruccionMensual: any;
  public cantidadStudentForm: FormGroup;
  public submitted: boolean = false;

  public editableRow: { 
    grade: any,
    name: string, 
    lastName: string,
    birthdayDate: string,
    birthdayPlace: string,
    ciudadania: string,
    numberPhone: string,
    insuranceSocial: string,
    livewith: string,
    hijoMaestro: boolean,
    vuelveAnioProximo: boolean,
    _id: string,
    codigoFamilia: string,
    instruccionAnualStudent: number,
    meses: number,
    instruccionStudent: number,
    matriculaStudent: number,
    seguroStudent: number,
    graduationFee: number,
    cuido: number,
    librosDigitales: number
  };
  public priceGrades : Array<any>;  
  public saveButtonClicked: Subject<any> = new Subject<any>();

  public form: FormGroup = new FormGroup({
    grade: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    birthdayDate: new FormControl('', Validators.required),
    birthdayPlace: new FormControl('', Validators.required),
    ciudadania: new FormControl('', Validators.required),
    // numberPhone: new FormControl('', Validators.required),
    insuranceSocial: new FormControl('', Validators.required),
    livewith: new FormControl('', Validators.required),
    hijoMaestro: new FormControl('', Validators.required),
    vuelveAnioProximo: new FormControl(true),
    codigoFamilia: new FormControl(''),
    namePadre: new FormControl(''),
    nameMadre: new FormControl('')
  });

  constructor(
    public modalRef: MDBModalRef,
    private familyService: FamilyService,
    private _decimalPipe: DecimalPipe,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.cantidadStudentForm = this.formBuilder.group({
      instruccionAnualStudent: [0, Validators.required],
      meses: [0, Validators.required],
      instruccionStudent: [0, Validators.required],
      matriculaStudent: [0, Validators.required],
      seguroStudent: [0, Validators.required],
      graduationFee: [0, Validators.required],
      cuido: [0, Validators.required],
      librosDigitales: [0, Validators.required]
    })

    this.agregarValoresEstudiante();
    this.agregarValoresCantidad();
  }

  get f() {
		return this.cantidadStudentForm.controls;
  }

  agregarValoresCantidad() {
    this.f.instruccionAnualStudent.setValue(this.transformDecimal(this.editableRow.instruccionAnualStudent));
    this.f.meses.setValue(this.editableRow.meses);
    this.f.instruccionStudent.setValue(this.transformDecimal(this.editableRow.instruccionStudent));
    this.f.matriculaStudent.setValue(this.transformDecimal(this.editableRow.matriculaStudent));
    this.f.seguroStudent.setValue(this.transformDecimal(this.editableRow.seguroStudent));
    this.f.graduationFee.setValue(this.transformDecimal(this.editableRow.graduationFee));
    this.f.cuido.setValue(this.transformDecimal(this.editableRow.cuido));
    this.f.librosDigitales.setValue(this.transformDecimal(this.editableRow.librosDigitales));
  }

  agregarValoresEstudiante() {
    this.form.controls['grade'].patchValue(this.editableRow.grade._id);
    this.form.controls['name'].patchValue(this.editableRow.name);
    this.form.controls['lastName'].patchValue(this.editableRow.lastName);

    let birthdayDate = moment(this.editableRow.birthdayDate, 'MM/DD/YYYY');
    this.form.controls['birthdayDate'].patchValue(birthdayDate);

    this.form.controls['birthdayPlace'].patchValue(this.editableRow.birthdayPlace);
    this.form.controls['ciudadania'].patchValue(this.editableRow.ciudadania);
    // this.form.controls['numberPhone'].patchValue(this.editableRow.numberPhone);
    
    this.form.controls['insuranceSocial'].patchValue(this.onInputChange(this.editableRow.insuranceSocial));
    this.form.controls['livewith'].patchValue(this.editableRow.livewith);
    this.form.controls['hijoMaestro'].patchValue(this.editableRow.hijoMaestro);

    if(this.editableRow.vuelveAnioProximo) this.form.controls['vuelveAnioProximo'].patchValue(this.editableRow.vuelveAnioProximo);
    
    this.form.controls['codigoFamilia'].patchValue(this.editableRow.codigoFamilia);
    this.getParents(this.editableRow.codigoFamilia);
  }

  getParents(code: any) {
    this.familyService.getNameParents(code).subscribe(
      response => {
        this.nameParents = response.parents;
        this.form.controls['namePadre'].patchValue(this.nameParents.dad.name + ' ' + this.nameParents.dad.lastName);
        this.form.controls['nameMadre'].patchValue(this.nameParents.mom.name + ' ' + this.nameParents.mom.lastName);
      },
      error => {
        console.log(error);
      }
    )
  }

  editRow() {
    
    this.editableRow = this.form.getRawValue();
    delete this.editableRow.codigoFamilia;
    delete this.editableRow['namePadre'];
    delete this.editableRow['nameMadre'];
    this.editableRow.grade = this.priceGrades.filter(a => a._id == this.editableRow.grade)[0]
    this.editableRow.birthdayDate = moment(this.editableRow.birthdayDate).format('MM/DD/YYYY');
    let items = {
      editableRow: this.editableRow,
      cantidadesEstudiante: this.cantidadStudentForm.getRawValue()
    }
    this.saveButtonClicked.next(items);
    this.modalRef.hide();
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

  public modelChanged(event: any) {
    if(event) {
      this.tmpInstruccionAnual = this.f.instruccionAnualStudent.value;
      let instruccionAnualStudent = this.f.instruccionAnualStudent.value;
      instruccionAnualStudent = +(+instruccionAnualStudent.replace(',', '') / 2).toFixed(2);
      this.f.instruccionAnualStudent.setValue(this.transformDecimal(instruccionAnualStudent));
      // Mensual
      this.tmpInstruccionMensual = this.f.instruccionStudent.value;
      let instruccionStudent = this.f.instruccionStudent.value;
      instruccionStudent = +(+instruccionStudent / 2).toFixed(2);
      this.f.instruccionStudent.setValue(this.transformDecimal(instruccionStudent));
    } else {
      this.f.instruccionAnualStudent.setValue(this.tmpInstruccionAnual);
      this.f.instruccionStudent.setValue(this.tmpInstruccionMensual);
    }
  }

  public obtenerInstruccionMensual(event: any): void {
    if(event) {
      this.cantidadStudentForm.updateValueAndValidity();
      let instruccionAnualStudent = +this.f.instruccionAnualStudent.value.replace(',', '');
      let instruccionStudent = (instruccionAnualStudent / +event).toFixed(2);
      this.f.instruccionStudent.setValue(this.transformDecimal(instruccionStudent));    
      this.f.instruccionAnualStudent.setValue(this.transformDecimal(instruccionAnualStudent));
    }
  }

  /**
   * Metodo que permite convertir numero con decimalPipe
   * @param num Numero a transformar
   */
  transformDecimal(num) {
    return this._decimalPipe.transform(num, '1.2-2');
  }

  get grade() { return this.form.get('grade'); }
  get name() { return this.form.get('name'); }
  get lastName() { return this.form.get('lastName'); }
  get birthdayDate() { return this.form.get('birthdayDate'); }
  get birthdayPlace() { return this.form.get('birthdayPlace'); }
  get ciudadania() { return this.form.get('ciudadania'); }
  // get numberPhone() { return this.form.get('numberPhone'); }
  get insuranceSocial() { return this.form.get('insuranceSocial'); }
  get livewith() { return this.form.get('livewith'); }
  get hijoMaestro() { return this.form.get('hijoMaestro'); }
  get vuelveAnioProximo() { return this.form.get('vuelveAnioProximo'); }

  onInputChange(event) {
    if(event) {
      let newVal = event.replace(/\D/g, '');
      if(newVal.length > 9) {
        newVal = newVal.substring(0, 9);
      }
      if (newVal.length === 0) {
        newVal = '';
      } else if (newVal.length <= 3) {
        newVal = newVal.replace(/^(\d{0,3})/, '$1');
      } else if (newVal.length < 6) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,2})/, '$1-$2');
      } else if (newVal.length == 6) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,2})(\d{0,4})/, '$1-$2-$3');
      } else if (newVal.length <= 10) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,2})(\d{0,4})/, '$1-$2-$3');
      } else {
        newVal = newVal.substring(0, 10);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,2})(\d{0,4})/, '$1-$2-$3');
      }
      return newVal;
    }
  }
}
