import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { MdbTableDirective, MdbTablePaginationComponent, MDBModalRef, MDBModalService } from "angular-bootstrap-md";
import Swal from 'sweetalert2';
import { CrearDepositoComponent } from './crear-deposito/crear-deposito.component';
import { DepositoService } from '../../services/deposito.service';
import { ReportesService } from '../../services/reportes.service';
import { PagoService } from '../../services/pago.service';
import { EditarPagoComponent } from '../pagos/editar-pago/editar-pago.component';
import { DecimalPipe } from '@angular/common';
import { StartAnioService } from '../../services/start-anio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deposito',
  templateUrl: './deposito.component.html',
  providers: [DecimalPipe]

})
export class DepositoComponent implements OnInit {

  @ViewChild('mdbTablePagos', { static: true }) mdbTablePagos: MdbTableDirective;
  @ViewChild('mdbTableDeposito', { static: true }) mdbTableDeposito: MdbTableDirective;
  @ViewChild('mdbTablePaginationDeposito', { static: true }) mdbTablePaginationDeposito: MdbTablePaginationComponent;
  @ViewChild('mdbTablePaginationPagos', { static: true }) mdbTablePaginationPagos: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;

  public sumaTotalPago: any = 0;
  public sumaMensualidadInstruccionPagado: any = 0;
  public sumaMontoDonationFeePagado: any = 0;
  public sumaMontoTotalCuidoPagado: any = 0;
  public sumaMontoGraduationFeePagado: any = 0;
  public sumaMontoTotalMatriculaStudentsPagado: any = 0;
  public sumaMontoTotalSeguroStudentsPagado: any = 0;
  public sumaMontoSecurityFeePagado: any = 0;
  public sumaMontoTechnologyFeePagado: any = 0;
  public sumaMontoMaintenanceFeePagado: any = 0;
  public sumaMontoYearbookPagado: any = 0;
  public sumaMontoLibrosDigitalesPagado: any = 0;
  public sumaMontoRecargoPagado: any = 0;

  public disabledDownloadPdf : boolean = false;
  public listaAnios: Array<any> = [];
  public pagosRealizados: Array<any> = [];
  public listaPagosRealizadosSeleccionados: Array<any> = [];
  public tipoDePago: string = 'CH-EF';

  public checked: boolean = false;
  modalRef: MDBModalRef;

  public depositos: any = [];
  elements: any = [];
  headElements = ['', 'Codigo Familia', 'Tipo de pago', 'Fecha pago', 'Total', 'Instrucción', 'Donativo', 'Cuido', 'Graduación', 'Matricula', 'Seguro', 'Seguridad', 'Tecnología', 'Mantenimiento', 'Anuario', 'Libros digitales', 'Recargo', 'Acción'];
  headElementsDeposito = ['Numero deposito', 'total', 'Instrucción', 'Donativo', 'Cuido', 'Matricula', 'Graduación', 'Seguro', 'Seguridad', 'Tecnología', 'Mantenimiento', 'Anuario', 'Lib. Digitales', 'Recargos', 'Acción'];
  
  public tiposDePago: Array<any> = [
    { code: 'CH-EF', name: 'Cheque/Efectivo'},
    { code: 'ATH', name: 'ATH'},
    // { code: 'CH', name: 'Cheque'},
    { code: 'VM', name: 'Visa/MasterCard'},
    // { code: 'M', name: 'MasterCard'},
    { code: 'AE', name: 'American Express'},
    { code: 'VME', name: 'Visa/MasterCard Elect'},
    { code: 'AEE', name: 'American Express Elect'},
    { code: 'VMPA', name: 'Visa/MasterCard Pago Automático'},
    { code: 'AEPA', name: 'American Express Pago Automático'},
  ]

  constructor(
    private cdRef: ChangeDetectorRef,
    private modalService: MDBModalService,
    private depositoService: DepositoService,
    private pagoService: PagoService,
    private reportesService: ReportesService,
    private _decimalPipe: DecimalPipe,
    private startAnioService: StartAnioService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.getPagosRealizados(this.tipoDePago);
    this.getDepositos();
    this.getAnios();
  }

  ngAfterViewInit() {
    this.mdbTablePaginationPagos.setMaxVisibleItemsNumberTo(8);
    this.mdbTablePaginationPagos.calculateFirstItemIndex();
    this.mdbTablePaginationPagos.calculateLastItemIndex();
    this.mdbTablePaginationDeposito.setMaxVisibleItemsNumberTo(8);
    this.mdbTablePaginationDeposito.calculateFirstItemIndex();
    this.mdbTablePaginationDeposito.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  public getPagosRealizados(codeTipoDePago: any):void {
    this.tipoDePago = codeTipoDePago;
    this.listaPagosRealizadosSeleccionados = [];
    this.pagoService.getPagosByTipoPago(codeTipoDePago).subscribe(
      response => {
        if(response.status) {
          this.pagosRealizados = response.pagosRealizados;
          this.seleccionarAllRegistros();
          this.mdbTablePagos.setDataSource(this.pagosRealizados);
          this.pagosRealizados = this.mdbTablePagos.getDataSource();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  public seleccionarAllRegistros(): void {
    if(this.pagosRealizados.length > 0) {
      for (let index = 0; index < this.pagosRealizados.length; index++) {
        this.registroSeleccionado(index);
      }
    } else {
      this.sumarTotalRegistroSeleccionado();
    }
  }

  public sumarTotalRegistroSeleccionado(): void {
    this.sumaTotalPago = 0;
    this.sumaMensualidadInstruccionPagado = 0;
    this.sumaMontoDonationFeePagado = 0;
    this.sumaMontoTotalCuidoPagado = 0;
    this.sumaMontoGraduationFeePagado = 0;
    this.sumaMontoTotalMatriculaStudentsPagado = 0;
    this.sumaMontoTotalSeguroStudentsPagado = 0;
    this.sumaMontoSecurityFeePagado = 0;
    this.sumaMontoTechnologyFeePagado = 0;
    this.sumaMontoMaintenanceFeePagado = 0;
    this.sumaMontoYearbookPagado = 0;
    this.sumaMontoLibrosDigitalesPagado = 0;
    this.sumaMontoRecargoPagado = 0;
    this.listaPagosRealizadosSeleccionados.forEach(item => {
      this.sumaTotalPago += item.totalPago;
      this.sumaMensualidadInstruccionPagado += item.mensualidadInstruccionPagado;
      this.sumaMontoDonationFeePagado += item.montoDonationFeePagado;
      this.sumaMontoTotalCuidoPagado += item.montoTotalCuidoPagado;
      this.sumaMontoGraduationFeePagado += item.montoGraduationFeePagado;
      this.sumaMontoTotalMatriculaStudentsPagado += item.montoTotalMatriculaStudentsPagado;
      this.sumaMontoTotalSeguroStudentsPagado += item.montoTotalSeguroStudentsPagado;
      this.sumaMontoSecurityFeePagado += item.montoSecurityFeePagado;
      this.sumaMontoTechnologyFeePagado += item.montoTechnologyFeePagado;
      this.sumaMontoMaintenanceFeePagado += item.montoMaintenanceFeePagado;
      this.sumaMontoYearbookPagado += item.montoYearbookPagado;
      this.sumaMontoLibrosDigitalesPagado += item.montoLibrosDigitalesPagado;
      this.sumaMontoRecargoPagado += item.montoRecargoPagado;
    });
  }

  public registroSeleccionado(posicion: any): void {
    let aporte = this.pagosRealizados[posicion];
    if(!aporte.seleccionado) {
      this.pagosRealizados[posicion].seleccionado = true;
      this.listaPagosRealizadosSeleccionados.push(aporte);
    } else {
      this.pagosRealizados[posicion].seleccionado = false;
      for (let i = 0; i < this.listaPagosRealizadosSeleccionados.length; i++) {
        const aporteSeleccionado = this.listaPagosRealizadosSeleccionados[i];
        if(aporteSeleccionado._id === aporte._id) {
          this.listaPagosRealizadosSeleccionados.splice(i, 1);
          break;
        }        
      }
    }
    this.sumarTotalRegistroSeleccionado();
  }
  
  public openModalCrearDeposito():void {    
    this.modalRef = this.modalService.show(CrearDepositoComponent);
    this.modalRef.content.saveButtonClicked.subscribe((newElement: any) => {
      let indexDeposito = this.depositos.filter(d => d.numeroDeposito === newElement.numeroDeposito)[0];
      if(indexDeposito ) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning...',
          text: 'Ya existe un deposito con este numero: ' + newElement.numeroDeposito
        })        
      } else {
        this.crearDeposito(newElement.numeroDeposito, newElement.dateNow);
      }
    });    
  }

  public eliminarPago(pago: any): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se eliminara el pago seleccionado",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => { 
      if (result.value) {
        this.pagoService.deletePago(pago._id).subscribe(
          response => {
            if(response.status){
              Swal.fire({
                title: 'Exitoso!',
                text: 'Pago Eliminado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.getPagosRealizados(this.tipoDePago);
            }
          },
          error => {
            console.log(error);
          }
        )
      }
    })
  }

  /**
   * Metodo que permite crear un deposito
   * @param numeroDeposito Numero de deposito
   */
  public crearDeposito(numeroDeposito: string, fecha: string): void {
    if(this.listaPagosRealizadosSeleccionados.length == 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning...',
        text: 'Debes seleccionar un pago para poder crear un deposito'
      })
      return;
    }
    let deposito = {
      fecha: fecha,
      numeroDeposito: numeroDeposito,
      pagos: this.listaPagosRealizadosSeleccionados,
      fromDateAnio: this.listaAnios[this.listaAnios.length - 1].fromDateAnio,
      toDateAnio: this.listaAnios[this.listaAnios.length - 1].toDateAnio
    }
    this.depositoService.saveDeposito(deposito).subscribe(
      response => {
        if(response.status) {
          this.getDepositos();
          this.getPagosRealizados(this.tipoDePago);
          Swal.fire({
            title: 'Exitoso!',
            text: response.message,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.descargarDeposito(response.deposito);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo que permite obtener los depositos creados
   */
  public getDepositos():void {
    this.depositoService.getDepositos().subscribe(
      response => {
        if(response.status){
          this.depositos = response.depositos;
          this.mdbTableDeposito.setDataSource(this.depositos);
          this.depositos = this.mdbTableDeposito.getDataSource();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo que permite abrir modal para editar pago
   */
  public modalEditarPago(el: any): void {
    const modalOptions = {
      data: {
        editableRow: el,
        tiposDePago: this.tiposDePago
      },
      class: 'modal-lg'
    };
    this.modalRef = this.modalService.show(EditarPagoComponent, modalOptions);
    this.modalRef.content.saveButtonClicked.subscribe((newElement: any) => {
      this.actualizarPago(newElement);
    });
    this.mdbTableDeposito.setDataSource(this.pagosRealizados);
  }

  /**
   * Metodo que permite actualizar un pago realizado
   * @param pago Pago
   */
  public actualizarPago(pago: any): void {
    this.pagoService.updatePago(pago).subscribe(
      response => {
        if(response.status) {
          Swal.fire({
            title: 'Exitoso!',
            text: response.messagge,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.getPagosRealizados(this.tipoDePago);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo que permite eliminar un deposito
   * @param deposito deposito
   */
  public eliminarDeposito(deposito: any):void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se eliminara el deposito seleccionado",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => { 
      if (result.value) {
        this.depositoService.deleteDeposito(deposito._id).subscribe(
          response => {
            if(response.status){
              Swal.fire({
                title: 'Exitoso!',
                text: 'Deposito Eliminado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.getDepositos();
            }
          },
          error => {
            console.log(error);
          }
        )
      }
    })
  }

  public descargarDeposito(deposito: any):void {
    deposito = this.setNumbersToDecimal(deposito);
    this.disabledDownloadPdf = true;
    this.reportesService.getReportDeposito(deposito).subscribe(
      response => {
        this.disabledDownloadPdf = false;
        let data = response.rest.data;
        const file = new Blob([new Uint8Array(data).buffer], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);

        window.open(fileURL); 
        var a         = document.createElement('a');
        a.href        = fileURL; 
        a.target      = '_blank';
        a.download    = 'reporte-depositos.pdf';
        document.body.appendChild(a);
        a.click();
      },
      error => {
        console.log(error);
      }
    )
  }

  private setNumbersToDecimal(deposito): any {
    var copiaDeposito =  JSON.parse(JSON.stringify(deposito));

    delete copiaDeposito.fromDateAnio;
    delete copiaDeposito.toDateAnio;
    delete copiaDeposito.__v;
    delete copiaDeposito._id;
    delete copiaDeposito.inactivar;

    for (const key in copiaDeposito) {
      if(key !== 'pagos' && key !== 'numeroDeposito') {
        copiaDeposito[key] = this.transformDecimal(copiaDeposito[key]);
      } else if(key === 'pagos') {
        copiaDeposito[key].forEach(pago => {
          pago.mensualidadInstruccionPagado = this.transformDecimal(pago.mensualidadInstruccionPagado);
          pago.montoDonationFeePagado = this.transformDecimal(pago.montoDonationFeePagado);
          pago.montoTotalMatriculaStudentsPagado = this.transformDecimal(pago.montoTotalMatriculaStudentsPagado);
          pago.montoGraduationFeePagado = this.transformDecimal(pago.montoGraduationFeePagado);
          pago.montoYearbookPagado = this.transformDecimal(pago.montoYearbookPagado);
          pago.montoSecurityFeePagado = this.transformDecimal(pago.montoSecurityFeePagado);
          pago.montoMaintenanceFeePagado = this.transformDecimal(pago.montoMaintenanceFeePagado);
          pago.montoTotalSeguroStudentsPagado = this.transformDecimal(pago.montoTotalSeguroStudentsPagado);
          pago.montoTechnologyFeePagado = this.transformDecimal(pago.montoTechnologyFeePagado);
          pago.montoLibrosDigitalesPagado = this.transformDecimal(pago.montoLibrosDigitalesPagado);
          pago.montoTotalCuidoPagado = this.transformDecimal(pago.montoTotalCuidoPagado);
          pago.montoRecargoPagado = this.transformDecimal(pago.montoRecargoPagado);
        });
      }
    }

    return copiaDeposito;
  };

  /**
   * Metodo que permite convertir numero con decimalPipe
   * @param num Numero a transformar
   */
  transformDecimal(num) {
    return this._decimalPipe.transform(num, '1.2-2');
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

  /**
   * Metodo que permite editar un deposito
   */
  public editarDeposito(deposito: any): void {
    this._router.navigate(['/dashboard', { outlets: { procesoDashboard: ['editar-deposito', deposito._id] } }]);
  }

}
