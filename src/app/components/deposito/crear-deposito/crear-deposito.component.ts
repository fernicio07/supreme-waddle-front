import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from "angular-bootstrap-md";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-crear-deposito',
  templateUrl: './crear-deposito.component.html'
})
export class CrearDepositoComponent implements OnInit {

  public valorFecha: string;

  public editableRow: { 
    numeroDeposito: string
    dateNow: string
  };

  public saveButtonClicked: Subject<any> = new Subject<any>();

  public form: FormGroup = new FormGroup({
    numeroDeposito: new FormControl('', Validators.required),
    dateNow: new FormControl(moment(new Date()), Validators.required),
  });

  constructor(public modalRef: MDBModalRef) { }

  ngOnInit(): void {
  }

  saveProduct() {
    this.editableRow = this.form.getRawValue();
    this.editableRow.dateNow = moment(this.editableRow.dateNow).format('MM/DD/YYYY');
    this.saveButtonClicked.next(this.editableRow);
    this.modalRef.hide();
  }

  get numeroDeposito() { return this.form.get('numeroDeposito'); }
  get dateNow() { return this.form.get('dateNow'); }

  get dateValue() {
    return moment(this.valorFecha, 'MM/DD/YYYY');
  }

  set dateValue(val) {
    this.valorFecha = moment(val).format('MM/DD/YYYY');
    this.propagateChange(this.valorFecha);
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.dateValue = moment(event.value, 'MM/DD/YYYY');
    // let fechaCreoRegistro = moment(new Date()).format('MM/DD/YYYY');
    // this.dateNow.setValue(fechaCreoRegistro);
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

}
