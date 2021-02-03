import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from "angular-bootstrap-md";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-editar-pago',
  templateUrl: './editar-pago.component.html',
  providers: [DecimalPipe]
})
export class EditarPagoComponent implements OnInit {

  public valorFecha: any;
  public mostrarCamposDeCheque: boolean = false;
  public verificarTotal: boolean = false;

  // public editableRow: { 
  //   instruccion: string, 
  //   donativo: string,
  //   cuido: string,
  //   matricula: string,
  //   seguro: string,
  //   seguridad: string,
  //   tecnologia: string,
  //   mantenimiento: string,
  //   anuario: boolean
  // };

  public formasDePago: Array<any> = [
    { code: 'EF', name: 'Efectivo'},
    { code: 'ATH', name: 'ATH'},
    { code: 'CH', name: 'Cheque'},
    { code: 'V', name: 'Visa'},
    { code: 'M', name: 'Mastercard'},
    { code: 'AE', name: 'American Express'},
    { code: 'VME', name: 'Visa/MasterCard Elect'},
    { code: 'AEE', name: 'American Express Elect'},
  ]

  public editableRow: {
    codigoDeposito: string,
    fechaCreoPago: string,
    tipoPago: string,
    numeroDeCheque: string,
    banco: string,
    totalPago: number,
    montoTotalMensualidadGradoStudentsPagado: number, 
    montoDonationFeePagado: number,
    montoTotalCuidoPagado: number,
    montoGraduationFeePagado: number,
    montoTotalMatriculaStudentsPagado: number,
    montoTotalSeguroStudentsPagado: number,
    montoYearbookPagado: number,
    montoMaintenanceFeePagado: number,
    montoSecurityFeePagado: number,
    montoTechnologyFeePagado: number,
    montoLibrosDigitalesPagado: number,
    montoRecargoPagado: number,
    _id: string
  };

  public saveButtonClicked: Subject<any> = new Subject<any>();

  public form: FormGroup = new FormGroup({
    fechaCreoPago: new FormControl('', Validators.required),
    tipoPago: new FormControl('', Validators.required),
    numeroDeCheque: new FormControl('', null),
    banco: new FormControl('', null),
    totalPago: new FormControl('', Validators.required),    
    instruccion: new FormControl('', Validators.required),
    donativo: new FormControl('', Validators.required),
    cuido: new FormControl('', Validators.required),
    graduacion: new FormControl('', Validators.required),
    matricula: new FormControl('', Validators.required),
    seguro: new FormControl('', Validators.required),
    anuario: new FormControl('', Validators.required),
    mantenimiento: new FormControl('', Validators.required),
    seguridad: new FormControl('', Validators.required),
    tecnologia: new FormControl('', Validators.required),    
    librosDigitales: new FormControl('', Validators.required),
    recargo: new FormControl('', Validators.required),    
    _id: new FormControl('')
  });

  constructor(
    public modalRef: MDBModalRef,
    private _decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.form.controls['fechaCreoPago'].patchValue(moment.utc(this.editableRow.fechaCreoPago));

    let tipoDePago = this.formasDePago.filter(pago => pago.code === this.editableRow.tipoPago)[0].code;
    // let tipoDePago = this.tiposDePago.filter(pago => pago.code === this.editableRow.tipoPago)[0].code;
    this.form.controls['tipoPago'].patchValue(tipoDePago);
    if(tipoDePago == 'CH') {
      this.mostrarCamposDeCheque = true;
      this.form.controls['numeroDeCheque'].patchValue(this.editableRow.numeroDeCheque);
      this.form.controls['banco'].patchValue(this.editableRow.banco);
    }
    
    this.form.controls['totalPago'].patchValue(this.transformDecimal(this.editableRow.totalPago));
    this.form.controls['instruccion'].patchValue(this.transformDecimal(this.editableRow.montoTotalMensualidadGradoStudentsPagado));
    this.form.controls['donativo'].patchValue(this.transformDecimal(this.editableRow.montoDonationFeePagado));
    this.form.controls['cuido'].patchValue(this.transformDecimal(this.editableRow.montoTotalCuidoPagado));
    this.form.controls['graduacion'].patchValue(this.transformDecimal(this.editableRow.montoGraduationFeePagado));
    this.form.controls['matricula'].patchValue(this.transformDecimal(this.editableRow.montoTotalMatriculaStudentsPagado));
    this.form.controls['seguro'].patchValue(this.transformDecimal(this.editableRow.montoTotalSeguroStudentsPagado));
    this.form.controls['anuario'].patchValue(this.transformDecimal(this.editableRow.montoYearbookPagado));
    this.form.controls['mantenimiento'].patchValue(this.transformDecimal(this.editableRow.montoMaintenanceFeePagado));
    this.form.controls['seguridad'].patchValue(this.transformDecimal(this.editableRow.montoSecurityFeePagado));
    this.form.controls['tecnologia'].patchValue(this.transformDecimal(this.editableRow.montoTechnologyFeePagado));
    this.form.controls['librosDigitales'].patchValue(this.transformDecimal(this.editableRow.montoLibrosDigitalesPagado));
    this.form.controls['recargo'].patchValue(this.transformDecimal(this.editableRow.montoRecargoPagado));
    this.form.controls['_id'].patchValue(this.editableRow._id);
  }

  editRow() {
    this.totalPago.setErrors(null);
    this.editableRow = this.form.getRawValue();
    let camposFormulario = this.setValoresFormulario();
    // Validar campo total
    let suma = 0;
    suma += camposFormulario['instruccion'];
    suma += camposFormulario['donativo'];
    suma += camposFormulario['cuido'];
    suma += camposFormulario['graduacion'];
    suma += camposFormulario['matricula'];
    suma += camposFormulario['seguro'];
    suma += camposFormulario['anuario'];
    suma += camposFormulario['mantenimiento'];
    suma += camposFormulario['seguridad'];
    suma += camposFormulario['tecnologia'];
    suma += camposFormulario['librosDigitales'];
    suma += camposFormulario['recargo'];
    this.verificarTotal = false;
    // Valida campo total con la suma de todos los numeros
    if(camposFormulario['totalPago']  != suma) {
      this.totalPago.setErrors({'incorrect': true});
      this.verificarTotal = true;
      return;
    }
    this.saveButtonClicked.next(camposFormulario);
    this.modalRef.hide();
  }

  setValoresFormulario() {
    let obj = {}
    let total = 0;
    for (const campo in this.editableRow) {
      let valor = this.editableRow[campo];      
      
      if(campo == 'fechaCreoPago') {
        obj[campo] = moment(valor, 'DD/MM/YYYY').utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0}).toISOString();
      } else {
        valor = valor.replace(/,/gi, '');
        // Se valida si el valor es un numero
        if(isNaN(+valor) || valor.length === 0) {
          obj[campo] = valor;
        } else {
          obj[campo] = +valor;
          total += +valor;
        }
      }
    }
    if(obj['tipoPago'] !== 'CH') {
      obj['banco'] = '';
      obj['numeroDeCheque'] = '';
    }
    obj['montoTotalAnualPagado'] = total;
    obj['montoTotalAdmissionFeeStudentsPagado'] = obj['seguro'] + obj['matricula'];
    return obj;
  }

  /**
   * Metodo que permite mostrar los campos relaciones con CHEQUE
   * @param event Codigo de tipo de pago
   */
  public getTipoDePago(event: any): void {
    this.mostrarCamposDeCheque = false;
    if(event === 'CH') {
      this.mostrarCamposDeCheque = true;
    }
  }

  get fechaCreoPago() { return this.form.get('fechaCreoPago'); }
  get tipoPago() { return this.form.get('tipoPago'); }
  get numeroDeCheque() { return this.form.get('numeroDeCheque'); }
  get banco() { return this.form.get('banco'); }
  get totalPago() { return this.form.get('totalPago'); }
  get instruccion() { return this.form.get('instruccion'); }
  get donativo() { return this.form.get('donativo'); }
  get cuido() { return this.form.get('cuido'); }
  get graduacion() { return this.form.get('graduacion'); }
  get matricula() { return this.form.get('matricula'); }
  get seguro() { return this.form.get('seguro'); }
  get anuario() { return this.form.get('anuario'); }
  get mantenimiento() { return this.form.get('mantenimiento'); }
  get seguridad() { return this.form.get('seguridad'); }
  get tecnologia() { return this.form.get('tecnologia'); }
  get librosDigitales() { return this.form.get('librosDigitales'); }
  get recargo() { return this.form.get('recargo'); }
  
  /**
   * Metodo que permite convertir numero con decimalPipe
   * @param num Numero a transformar
   */
  transformDecimal(num) {
    return this._decimalPipe.transform(num, '1.2-2');
  }

  get dateValue() {
    return moment(this.valorFecha, 'DD/MM/YYYY');
  }

  set dateValue(val) {
    var m = moment(val).utcOffset(0);
    m.set({hour:0,minute:0,second:0,millisecond:0})
    this.valorFecha = m.toISOString();
    this.propagateChange(this.valorFecha);
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    //console.log(event.value);
    this.dateValue = moment(event.value, 'DD/MM/YYYY');
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.dateValue = moment(value, 'DD/MM/YYYY');
    }
  }
  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  
}
