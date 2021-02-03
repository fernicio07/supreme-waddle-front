import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MDBModalRef, MDBModalService, MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { DepositoService } from 'src/app/services/deposito.service';
import { PagoService } from 'src/app/services/pago.service';
import { EditarPagoComponent } from '../../pagos/editar-pago/editar-pago.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-editar-deposito',
  templateUrl: './editar-deposito.component.html'
})
export class EditarDepositoComponent implements OnInit {

  public idDeposito: string;
  public deposito: any;
  public elements: any = [];
  public pagosRealizados: any = [];
  public headElements = ['Codigo Familia', 'Tipo de pago', 'Fecha pago', 'Total', 'Instrucción', 'Donativo', 'Cuido', 'Graduación', 'Matricula', 'Seguro', 'Seguridad', 'Tecnología', 'Mantenimiento', 'Anuario', 'Libros digitales', 'Recargo', 'Acción'];
  public headElementsNoSeleccionados = ['', 'Codigo Familia', 'Tipo de pago', 'Fecha pago', 'Total', 'Instrucción', 'Donativo', 'Cuido', 'Graduación', 'Matricula', 'Seguro', 'Seguridad', 'Tecnología', 'Mantenimiento', 'Anuario', 'Libros digitales', 'Recargo'];

  @ViewChild('mdbTablePaginationPagos', { static: true }) mdbTablePaginationPagos: MdbTablePaginationComponent;
  @ViewChild('mdbTablePagos', { static: true }) mdbTablePagos: MdbTableDirective;
  @ViewChild('mdbTablePaginationPagosTemporales', { static: true }) mdbTablePaginationPagosTemporales: MdbTablePaginationComponent;
  @ViewChild('mdbTablePagosTemporales', { static: true }) mdbTablePagosTemporales: MdbTableDirective;

  previous: any = [];



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
  ];

  // public tipoDePago: string = 'CH-EF';
  public listaPagosRealizadosSeleccionados: Array<any> = [];
  public pagosTemporales: Array<any> = [];

  modalRef: MDBModalRef;

  constructor(
    private _route: ActivatedRoute,
    private router: Router,
    private depositoService: DepositoService,
    private modalService: MDBModalService,
    private pagoService: PagoService,
    private cdRef: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.idDeposito = params.id;
      this.getDeposito(this.idDeposito);
    });
  }

  ngAfterViewInit() {
    this.mdbTablePaginationPagos.setMaxVisibleItemsNumberTo(8);
    this.mdbTablePaginationPagos.calculateFirstItemIndex();
    this.mdbTablePaginationPagos.calculateLastItemIndex();
    this.mdbTablePaginationPagosTemporales.setMaxVisibleItemsNumberTo(8);
    this.mdbTablePaginationPagosTemporales.calculateFirstItemIndex();
    this.mdbTablePaginationPagosTemporales.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  public getDeposito(idDeposito: string): void {
    this.depositoService.getDeposito(idDeposito).subscribe(
      response => {
        this.deposito = response.deposito;
        this.pagosRealizados = response.deposito.pagos;
        this.sumarTotalRegistroSeleccionado();
        this.mdbTablePagos.setDataSource(this.pagosRealizados);
        this.pagosRealizados = this.mdbTablePagos.getDataSource();
        this.previous = this.mdbTablePagos.getDataSource();
        this.getPagosRealizados();
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
	 * Metodo que permite cambiar de vista para registrar una nueva familia
	 */
	public volver(): void {
    this.router.navigate(['/dashboard', { outlets: { procesoDashboard: ['depositos'] } }]);
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
    this.deposito.pagos.forEach(item => {
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
    this.mdbTablePagos.setDataSource(this.pagosRealizados);
  }

  /**
   * Metodo que permite actualizar un pago realizado
   * @param pago Pago
   */
  public actualizarPago(pago: any): void {
    pago.codigoDeposito = this.deposito.numeroDeposito;
    // return;
    this.pagoService.updatePago(pago).subscribe(
      response => {
        if(response.status) {
          Swal.fire({
            title: 'Exitoso!',
            text: response.messagge,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          let pago = response.pago;
          this.deposito.pagos = this.deposito.pagos.map(p => {
            if(p._id == pago._id) {
              return p = pago;
            }
            return p;
          })
          // this.getDeposito(this.idDeposito);
          this.actualizarDeposito();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo que permite eliminar un pago del deposito
   * @param pagoSelected Pago Seleccionado
   */
  public eliminarPago(pagoSelected: any): void {
    pagoSelected.isDeleted = true;
    // pagoSelected.codigoDeposito = null;
    // this.deposito.pagos = this.deposito.pagos.filter(pago => pago._id !== pagoSelected._id);
    // console.log(this.deposito);
    // return;
    this.depositoService.eliminarPagoFromDeposito(this.deposito).subscribe(
      response => {
        if(response.status) {
          // this.actualizarPago(pagoSelected);
          this.getDeposito(this.idDeposito);
        }
      },
      error=> {
        console.log(error);
      }
    )
  }

  public getPagosRealizados():void {
    // this.tipoDePago = codeTipoDePago;
    let codeTipoDePago = this.getTipoDePago();
    this.listaPagosRealizadosSeleccionados = [];
    this.pagoService.getPagosByTipoPago(codeTipoDePago).subscribe(
      response => {
        if(response.status) {
          this.pagosTemporales = this.getPagosNoSeleccionados(response.pagosRealizados);
          // this.seleccionarAllRegistros();
          this.mdbTablePagosTemporales.setDataSource(this.pagosTemporales);
          this.pagosTemporales = this.mdbTablePagosTemporales.getDataSource();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  private getTipoDePago(): any {
    let str = '';
    str = this.pagosRealizados[0].tipoPago;
    if(this.pagosRealizados[0].tipoPago === 'CH' || this.pagosRealizados[0].tipoPago === 'EF') {
      str = "CH-EF"
    }
    return str;
  }

  /**
   * Metodo que retorna los pagos no seleccionados
   * @param pagosRealizados Pagos
   */
  private getPagosNoSeleccionados(pagosRealizados: any): Array<any> {
    let items =  JSON.parse(JSON.stringify(pagosRealizados));
    pagosRealizados.forEach(pago => {
      this.pagosRealizados.map(p => {
        if(p._id === pago._id) {
          items = items.filter(item => item._id !== p._id);
        }
      });
    });
    return items;
  }

  public registroSeleccionado(posicion: any): void {
    let aporte = this.pagosTemporales[posicion];
    if(!aporte.seleccionado) {
      this.pagosTemporales[posicion].seleccionado = true;
      this.listaPagosRealizadosSeleccionados.push(aporte);
    } else {
      this.pagosTemporales[posicion].seleccionado = false;
      for (let i = 0; i < this.listaPagosRealizadosSeleccionados.length; i++) {
        const aporteSeleccionado = this.listaPagosRealizadosSeleccionados[i];
        if(aporteSeleccionado._id === aporte._id) {
          this.listaPagosRealizadosSeleccionados.splice(i, 1);
          break;
        }        
      }
    }
    // this.sumarTotalRegistroSeleccionado();
    console.log(this.listaPagosRealizadosSeleccionados);
  }

  public agregarPagosDeposito(): void {
    if(this.listaPagosRealizadosSeleccionados.length === 0) {
      Swal.fire({
        title: 'warning!',
        text: 'Debe seleccionar almenos un pago',
        icon: 'warning'
      });
      return;
    }

    this.deposito.pagos = [...this.deposito.pagos, ...this.listaPagosRealizadosSeleccionados];
    this.actualizarDeposito();
    // this.depositoService.updateDeposito(this.deposito).subscribe(
    //   response => {
    //     if(response.status) {
    //       this.getDeposito(this.idDeposito);
    //     }
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // )
  }

  public actualizarDeposito(): void {
    this.depositoService.updateDeposito(this.deposito).subscribe(
      response => {
        if(response.status) {
          this.getDeposito(this.idDeposito);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

}
