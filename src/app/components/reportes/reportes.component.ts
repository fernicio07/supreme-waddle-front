import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
import { StudentService } from '../../services/student.service';
import { PriceGradeService } from '../../services/price-grade.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import Swal from 'sweetalert2';
import { DecimalPipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  providers: [DecimalPipe]
})
export class ReportesComponent implements OnInit, AfterViewInit {

  //@ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @ViewChild('tableStudents', { static: true }) mdbTableStudents: MdbTableDirective;
  @ViewChild('tableTotalesAnio', { static: true }) mdbTableTotalesAnio: MdbTableDirective;
  @ViewChild('tableTotalesPeriodo', { static: true }) mdbTableTotalesPeriodo: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;

  public elements: any = [];
  public elementsTotalesAnio: any = [];
  public elementsTotalesPeriodo: any = [];
  public headElements = ['Name', 'Lastname', 'MiddleName', 'CodigoFamilia'];
  public headElementsTotalAnio = ['Mensualidad Total', 'Donativo Total', 'Matricula Total', 'Graduation Total', 'Suma Total'];
  public headElementsTotalPeriodo = ['Instruccion', 'Donativo', 'Graduacion', 'Matricula', 'Anuario', 'Mantenimiento', 'Seguridad', 'Tecnologia', 'Total'];
  public priceGrades: Array<any> = [];
  public formReportStudentGrade: FormGroup;

  public mostrarTablaStudents: boolean;
  public mostrarTablaTotalesAnio: boolean;
  public mostrarTablaTotalesPeriodo: boolean;
  public mostrarTablaDonativos: boolean;

  public listStudents: Array<any> = [];
  public listTotalesAnio: Array<any> = [];
  public listTotalesPeriodo: Array<any> = [];
  public listDonativos: Array<any> = [];

  public disabledDownloadPdf : boolean = false;
  public tipoDeReportes: Array<any> = [
    { key: 1, description: 'Listado de estudiantes por grado' },
    { key: 2, description: 'Ingreso total a recibir en el año' },
    { key: 3, description: 'Ingreso total en periodo'},
    { key: 4, description: 'Reporte donativo anual y futuro' }
  ];
  public valorFecha: any;
  public fromDateISO: string;
  public toDateISO: string;

  constructor(
    private reportesService: ReportesService,
    private studentService: StudentService,
    private priceGradeService: PriceGradeService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private _decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.getGradePrices();
    this.formReportStudentGrade = this.formBuilder.group({ 
      priceGrade: [null],
      tipoDeReporte: [null],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    })
  }

  get f() {
    return this.formReportStudentGrade.controls;
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(8);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  /**
   * Metodo que obtiene los grados
   */
  getGradePrices() {
    // Obtener Price for Grade
		this.priceGradeService.getPriceGrades().subscribe(
			response => {
        if(response.priceGrades) {
          this.priceGrades = response.priceGrades;
        } else {
          console.log("Error get data");
        }
			},
			error => {
				console.log(error);
			}
		)
  }

  /**
   * Metodo que permite descargar reporte de los 
   * estudiantes por grado
   */
  public downloadReporte():void {
    this.disabledDownloadPdf = true;
    this.reportesService.getReportStudentsForGrade(this.listStudents).subscribe(
      response => {
        this.disabledDownloadPdf = false;
        let data = response.rest.data;
        const file = new Blob([new Uint8Array(data).buffer], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);

        window.open(fileURL); 
        var a         = document.createElement('a');
        a.href        = fileURL; 
        a.target      = '_blank';
        a.download    = 'report-students-grade.pdf';
        document.body.appendChild(a);
        a.click();
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo que permite obtener los estudiantes que pertenecen a X grado
   * @param idGrade IdGrado
   */
  public getStudentsForGrade(idGrade: any):void {
    this.studentService.getStudentsForGrade(idGrade).subscribe(
      response => {
        if(response.students.length > 0) {
          this.listStudents = response.students;
          this.elements = this.listStudents;
          this.mdbTableStudents.setDataSource(this.elements);
          this.elements = this.mdbTableStudents.getDataSource();
          this.mostrarTablaStudents = true;
        } else {
          this.mostrarTablaStudents = false;
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'No existen estudiantes para este grado.'
          })
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo que permite descargar reporte de totales anio
   */
  public downloadReporteTotalesAnio(): void {
    this.disabledDownloadPdf = true;
    this.reportesService.getReportTotalesAnio(this.listTotalesAnio).subscribe(
      response => {
        this.disabledDownloadPdf = false;
        let data = response.rest.data;
        const file = new Blob([new Uint8Array(data).buffer], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);

        window.open(fileURL); 
        var a         = document.createElement('a');
        a.href        = fileURL; 
        a.target      = '_blank';
        a.download    = 'report-total-anual.pdf';
        document.body.appendChild(a);
        a.click();
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo que obtiene todos los totales del anio
   */
  public getTotalesAño():void {
    this.priceGradeService.getTotalesAnio().subscribe(
      response => {
        if(response.length > 0) {
          this.listTotalesAnio = response;
          this.listTotalesAnio.forEach(element => {
            for(let key in element) {
              if (element.hasOwnProperty(key)) {
                element[key] = '$' + this.transformDecimal(element[key]);
                console.log(element[key]);
              }
            }
          })
          this.elementsTotalesAnio = this.listTotalesAnio;
          this.mdbTableTotalesAnio.setDataSource(this.elementsTotalesAnio);
          this.elementsTotalesAnio = this.mdbTableTotalesAnio.getDataSource();
          this.mostrarTablaTotalesAnio = true;
        } else {
          this.mostrarTablaTotalesAnio = false;
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'No existen datos'
          })
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo que obtiene los totales por periodo de fecha
   */
  public getTotalesPeriodo():void {
    let dates = {
      fromDateISO: this.fromDateISO,
      fromDate: this.f.fromDate.value.format('DD/MM/YYYY'),
      toDateISO: this.toDateISO,
      toDate: this.f.toDate.value.format('DD/MM/YYYY')
    }
    this.priceGradeService.getTotalesPeriodo(dates).subscribe(
      response => {
        if(response.totalPeriodo.length > 0) {
          this.listTotalesPeriodo = response.totalPeriodo;
          this.listTotalesPeriodo.forEach(element => {
            for(let key in element) {
              if (element.hasOwnProperty(key)) {
                element[key] = '$' + this.transformDecimal(element[key]);
              }
            }
          })
          this.elementsTotalesPeriodo = this.listTotalesPeriodo;
          this.mdbTableTotalesPeriodo.setDataSource(this.elementsTotalesPeriodo);
          this.elementsTotalesPeriodo = this.mdbTableTotalesPeriodo.getDataSource();
          this.mostrarTablaTotalesPeriodo = true;
        } else {
          this.mostrarTablaTotalesPeriodo = false;
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'No existen datos'
          })
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo que permite descargar reporte de totales periodo
   */
  public downloadReporteTotalesPeriodo(): void {
    this.disabledDownloadPdf = true;
    this.reportesService.getReportTotalesPeriodo(this.listTotalesPeriodo).subscribe(
      response => {
        this.disabledDownloadPdf = false;
        let data = response.rest.data;
        const file = new Blob([new Uint8Array(data).buffer], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);

        window.open(fileURL); 
        var a         = document.createElement('a');
        a.href        = fileURL; 
        a.target      = '_blank';
        a.download    = 'report-total-periodo.pdf';
        document.body.appendChild(a);
        a.click();
      },
      error => {
        console.log(error);
      }
    )
  }

  public getDonativosAnualFuturo(): void {
    this.priceGradeService.getDonativosAnualFuturo().subscribe(
      response => {
        //console.log(response);
        this.listDonativos = response;
        this.mostrarTablaDonativos = true;
      },
      error => {
        console.log(error);
        this.mostrarTablaDonativos = false;
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'No existen datos.'
          })
      }
    )
    console.log("Consultando donativos futuro y anual");
  }

  public downloadReporteDonativos():void {
    //this.disabledDownloadPdf = true;
    console.log(this.listDonativos);
    this.reportesService.getReportDonativos(this.listDonativos).subscribe(
      response => {
        this.disabledDownloadPdf = false;
        let data = response.rest.data;
        const file = new Blob([new Uint8Array(data).buffer], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);

        window.open(fileURL); 
        var a         = document.createElement('a');
        a.href        = fileURL; 
        a.target      = '_blank';
        a.download    = 'reporte-donativos.pdf';
        document.body.appendChild(a);
        a.click();
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo que se ejecuta cuando cambio el tipo de reporte
   * @param event key del tipo de reporte
   */
  public changeTipoReporte(event: any) {
    this.mostrarTablaStudents = false;
    this.mostrarTablaTotalesAnio = false;
    this.mostrarTablaTotalesPeriodo = false;
    this.mostrarTablaDonativos = false;
    if(event == '2') {
      this.getTotalesAño();
    }
    if(event == '4') {
      this.getDonativosAnualFuturo();
    }
  }

  /**
   * Metodo que permite convertir numero con decimalPipe
   * @param num Numero a transformar
   */
  transformDecimal(num) {
    return this._decimalPipe.transform(num, '1.2-2');
  }

  public searchTotalPeriodo():void {
    if(this.formReportStudentGrade.invalid) {      
      return;
    }
    if(this.fromDateISO > this.toDateISO) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning...',
        text: 'Fecha DESDE debe ser menor o igual que fecha HASTA'
      })
      return;
    }
    this.getTotalesPeriodo();
  }

  get dateValue() {
    return moment(this.valorFecha, 'DD/MM/YYYY');
  }

  set dateValue(val) {    
    this.valorFecha = moment(val).format('DD/MM/YYYY');
    this.propagateChange(this.valorFecha);
  }

  addEventFrom(event: MatDatepickerInputEvent<Date>) {
    this.dateValue = moment(event.value, 'DD/MM/YYYY');
    var m = moment(this.dateValue).utcOffset(0);
    m.set({hour:0,minute:0,second:0,millisecond:0})
    m.format();
    this.fromDateISO = m.toISOString();
  }

  addEventTo(event: MatDatepickerInputEvent<Date>) {
    this.dateValue = moment(event.value, 'DD/MM/YYYY');
    var m = moment(this.dateValue).utcOffset(0);
    m.set({hour:23,minute:59,second:59,millisecond:999})
    m.format();
    this.toDateISO = m.toISOString();
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
