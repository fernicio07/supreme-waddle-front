import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MdbTableDirective, MdbTablePaginationComponent, MDBModalRef, MDBModalService } from "angular-bootstrap-md";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FamilyService } from '../../services/family.service';
import Swal from 'sweetalert2';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;

import { MatInput } from '@angular/material/input';
import { CuentaFamilyService } from '../../services/cuenta-family.service';
import { PagoService } from '../../services/pago.service';
import { EditarPagoComponent } from './editar-pago/editar-pago.component';
import { StartAnioService } from '../../services/start-anio.service';
import { StudentService } from '../../services/student.service';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html'
})
export class PagosComponent implements OnInit, AfterViewInit {

  @ViewChild(MdbTableDirective, { static: false }) mdbTable: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: false }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: false }) row: ElementRef;
  @ViewChild('inputDatePicker', { read: MatInput }) inputDatePicker: MatInput;

  public balancePagos: any;
  public totalInstruccionDebePagar: any;
  public totalDonativoDebePagar: any;

  public formPagos: FormGroup;
  public codesFamily: Array<any> = [];
  public lastNameStudents: Array<any> = [];
  public pagosFamily: Array<any> = [];
  public familyInfo: any;
  public mostrarPagosFamily: boolean = false;
  public submitted: boolean = false;
  public estadoCuentasFamily: any;
  public valorFecha: any;
  public ocultarTablaCuentas: boolean = true;
  public mostrarCamposDeCheque: boolean = false;
  filteredOptionsCodigoFamilia: Observable<string[]>;
  filteredOptionsLastName: Observable<string[]>;
  public codeFamilyOfStudent: any;
  public verificarTotal: boolean = false;

  public valorBalanceInstruccion: any = 0;
  public valorBalanceDonativo: any = 0;
  public valorBalanceCuido: any = 0;  
  public valorBalanceMatricula: any = 0;
  public valorBalanceSeguro: any = 0;
  public valorBalanceSecurity: any = 0;
  public valorBalanceTecnology: any = 0;
  public valorBalanceMaintenance: any = 0;
  public valorBalanceYearbook: any = 0;
  public valorBalanceGraduation: any = 0;
  public valorBalanceLibrosDigitales: any = 0;
  public valorBalanceRecargo: any = 0;

  public totalRecibido: any = 0;
  public totalRecibir: any = 0;
  public balance: any = 0;

  public recibidoTotalPago: any = 0;
  public recibidoMensualidadInstruccionPagado: any = 0;
  public recibidoMontoDonationFeePagado: any = 0;
  public recibidoMontoTotalCuidoPagado: any = 0;
  public recibidoMontoGraduationFeePagado: any = 0;
  public recibidoMontoTotalMatriculaStudentsPagado: any = 0;
  public recibidoMontoTotalSeguroStudentsPagado: any = 0;
  public recibidoMontoYearbookPagado: any = 0;
  public recibidoMontoMaintenanceFeePagado: any = 0;
  public recibidoMontoSecurityFeePagado: any = 0;
  public recibidoMontoTechnologyFeePagado: any = 0;
  public recibidoMontoLibrosDigitalesPagado: any = 0;
  public recibidoMontoRecargoPagado: any = 0;

  public listaAnios: Array<any> = [];

  modalRef: MDBModalRef;

  elements: any = [];
  // headElements = ['Fecha de pago', 'Tipo de pago', 'Total', 'Total recibir', 'Total recibido', 'Balance', 'Acciones'];
  headElements = ['Tipo de pago', 'Fecha pago', 'Num. Dep', 'Total', 'Instrucción', 'Donativo', 'Cuido', 'Graduación', 'Matricula', 'Seguro', 'Seguridad', 'Tecnología', 'Mantenimiento', 'Anuario', 'Libros digitales', 'Recargo'];

  public tiposDePago: Array<any> = [
    { code: 'EF', name: 'Efectivo'},
    { code: 'ATH', name: 'ATH'},
    { code: 'CH', name: 'Cheque'},
    { code: 'V', name: 'Visa'},
    { code: 'M', name: 'Mastercard'},
    { code: 'AE', name: 'American Express'},
    { code: 'VME', name: 'Visa/MasterCard Elect'},
    { code: 'AEE', name: 'American Express Elect'},
  ]

  listaMeses: Array<any> = [];

  constructor(
    private formBuilder: FormBuilder,
    private familyService: FamilyService,
    private studentService: StudentService,
    private cuentaFamilyService: CuentaFamilyService,
    private cdRef: ChangeDetectorRef,
    private modalService: MDBModalService,
    private pagoService: PagoService,
    private startAnioService: StartAnioService
  ) { }

  ngOnInit(): void {
    this.getCodesFamily();
    this.getLastNameStudents();
    this.formPagos = this.formBuilder.group({ 
      codigoFamilia: [null],
      lastNameEstudiantes: [null],
      yearBook: [null],
      maintenanceFee: [null],
      securityFee: [null],
      technologyFee: [null],
      mensualidadGrados: [null],
      admission: [null],
      insurance: [null],
      donativo: [null],
      fechaCreoPago: [moment(new Date()), Validators.required],
      fechaCreoRegistro: [moment(new Date())],
      tipoDePago: [null, Validators.required],
      mesPendientePagar: [null],
      numeroDeCheque: [null],
      banco:[null],
      totalPago: [null],
      librosDigitales: [null],
      recargo: [null],
      // matriculaFamily: [null],
      // matriculaStudent: [null],
      graduation: [null],
      cuido: [null],
      selectorMes: [null, Validators.required]
    })
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(8);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    // this.ocultarTablaCuentas = true;
    this.cdRef.detectChanges();
  }

  get f() {
		return this.formPagos.controls;
  }

  /**
   * Metodo que permite filtrar en el autocomplete por codigo de familia
   * @param value valor escrito en el autocomplete
   */
  private _filterCodigoFamilia(value: string): string[] {
    const filterValue = value.toLowerCase();
    let existCodigoIngresado = this.codesFamily.map(codigo => codigo.codigoFamilia).indexOf(value);
    if(existCodigoIngresado >= 0) {
      this.codeFamilyOfStudent = value;
      this.getInfoFamily(value.toUpperCase());
      this.f.lastNameEstudiantes.setValue('');
      this.f.codigoFamilia.setValue('');
    } else {
      this.ocultarTablaCuentas = true;
      this.mostrarPagosFamily = false;
      return this.codesFamily.filter(option => option.codigoFamilia.toLowerCase().includes(filterValue));
    }
    return this.codesFamily.filter(option => option.codigoFamilia.toLowerCase().includes(""));
  }

  /**
   * Metodo que permite filtrar en el autocomplete por apellido de estudiante
   * @param value valor escrito en el autocomplete
   */
  private _filterLastNames(value: string): string[] {
    const filterValue = value.toLowerCase();
    let existCodigoIngresado = this.lastNameStudents.map(lastName => lastName.lastName).indexOf(value);
    if(existCodigoIngresado >= 0) {
      let lastName = this.lastNameStudents.filter(lastName => lastName.lastName == value)[0];
      this.codeFamilyOfStudent = lastName.codigoFamilia;
      this.getInfoFamily(lastName.codigoFamilia);
      this.f.codigoFamilia.setValue('');
      this.f.lastNameEstudiantes.setValue('');
    } else {
      this.ocultarTablaCuentas = true;
      this.mostrarPagosFamily = false;
      return this.lastNameStudents.filter(option => option.lastName.toLowerCase().includes(filterValue));
    }
    return this.lastNameStudents.filter(option => option.lastName.toLowerCase().includes(""));
  }

  /**
   * Metodo que trae los codigos de fmailia
   */
  public getCodesFamily(): void {
    this.familyService.getCodesFamily().subscribe(
      response => {
        this.codesFamily = response.codeFamily;
        this.filteredOptionsCodigoFamilia = this.f.codigoFamilia.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCodigoFamilia(value))
        );
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo que trae los apellidos de los estudiantes y el codigo de familia
   */
  public getLastNameStudents(): void {
    this.studentService.getLastNameStudents().subscribe(
      response => {
        this.lastNameStudents = response.lastnNameStudents;
        this.filteredOptionsLastName = this.f.lastNameEstudiantes.valueChanges.pipe(
          startWith(''),
          map(value => this._filterLastNames(value))
        );
      },
      error => {
        console.log(error);
      }
    )
  }

  public searchFamily() : void {
    console.log('Buscando familia');
  }

  /**
   * Metodo que permite buscar una familia por codigo
   * @param event Codigo de la Familia
   */
  public getInfoFamily(event: any): void {
    this.familyService.getFamily(event).subscribe(
      response => {
        this.familyInfo = response.family;
        if(response.family.estadoCuenta.length > 0) {
          this.estadoCuentasFamily = response.family.estadoCuenta[response.family.estadoCuenta.length - 1];          
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'No existen estados de cuenta para la familia'
          })
        }
        this.listaMeses = this.estadoCuentasFamily.mesesPendientesPagarMensualidad;
        this.pagosFamily = this.setPagosFamily(response.family.pagos);
        this.valorBalanceInstruccion = this.validarIsNaN(this.estadoCuentasFamily.totalAnualMensualidadGradoStudents) - this.valorBalanceInstruccion;
        this.valorBalanceDonativo = this.validarIsNaN(this.estadoCuentasFamily.donativoAnual) - this.valorBalanceDonativo;
        this.valorBalanceCuido = this.validarIsNaN(this.estadoCuentasFamily.cuido) - this.valorBalanceCuido;
        this.valorBalanceMatricula = this.validarIsNaN(this.estadoCuentasFamily.totalMatriculaStudents) - this.valorBalanceMatricula;
        this.valorBalanceSeguro = this.validarIsNaN(this.estadoCuentasFamily.totalSeguroStudents) - this.valorBalanceSeguro;
        this.valorBalanceSecurity = this.validarIsNaN(this.estadoCuentasFamily.security) - this.valorBalanceSecurity;
        this.valorBalanceTecnology = this.validarIsNaN(this.estadoCuentasFamily.technology) - this.valorBalanceTecnology;
        this.valorBalanceMaintenance = this.validarIsNaN(this.estadoCuentasFamily.maintenance) - this.valorBalanceMaintenance;
        this.valorBalanceYearbook = this.validarIsNaN(this.estadoCuentasFamily.yearbook) - this.valorBalanceYearbook;
        this.valorBalanceGraduation = this.validarIsNaN(this.estadoCuentasFamily.totalGraduationFee) - this.valorBalanceGraduation;
        this.valorBalanceLibrosDigitales = this.validarIsNaN(this.estadoCuentasFamily.montoLibrosDigitales) - this.valorBalanceLibrosDigitales;
        this.valorBalanceRecargo = this.validarIsNaN(this.estadoCuentasFamily.recargo) - this.valorBalanceRecargo;
        this.balancePagos = this.sumarPagosFamilia();
        this.ocultarTablaCuentas = false;
        this.mostrarPagosFamily = true;
        this.cdRef.detectChanges();
        this.mdbTable.setDataSource(this.pagosFamily)
        this.pagosFamily = this.mdbTable.getDataSource();

        // Desactivar campo Donativo y cuido si no tienen que pagar
        if(this.estadoCuentasFamily.totalMensualidadDonativo == 0) {
          this.f.donativo.disable();
        }
        if(this.estadoCuentasFamily.cuido == 0) {
          this.f.cuido.disable();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  public validarIsNaN(value: any) {
    return !isNaN(value) ? value : 0;
  }

  /**
   * Metodo que permite sumar los valores de pagos para mostrar balance de pagos
   */
  private sumarPagosFamilia(): object {
    let keys = {
      mensualidadInstruccionPagado: 0,
      montoDonationFeePagado: 0,
      montoTotalCuidoPagado: 0,
      montoTotalMatriculaStudentsPagado: 0,
      montoTotalSeguroStudentsPagado: 0,
      montoSecurityFeePagado: 0,
      montoTechnologyFeePagado: 0,
      montoMaintenanceFeePagado: 0,
      montoYearbookPagado: 0,
      montoGraduationFeePagado: 0
    };
    this.pagosFamily.forEach(pago => {
      keys.mensualidadInstruccionPagado += pago.mensualidadInstruccionPagado;
      keys.montoDonationFeePagado += pago.montoDonationFeePagado;
      keys.montoTotalCuidoPagado += pago.montoTotalCuidoPagado;
      keys.montoTotalMatriculaStudentsPagado += pago.montoTotalMatriculaStudentsPagado;
      keys.montoTotalSeguroStudentsPagado += pago.montoTotalSeguroStudentsPagado;
      keys.montoSecurityFeePagado += pago.montoSecurityFeePagado;
      keys.montoTechnologyFeePagado += pago.montoTechnologyFeePagado;
      keys.montoMaintenanceFeePagado += pago.montoMaintenanceFeePagado;
      keys.montoYearbookPagado += pago.montoYearbookPagado;
      keys.montoGraduationFeePagado += pago.montoGraduationFeePagado;
    })
    return keys;
  }

  /**
   * Metodo que permite SET lo pagos para mostrar recibido/recibit y balance
   * @param pagos Lista de pagos
   */
  private setPagosFamily(pagos: any): any {
    this.totalRecibido = 0;

    this.valorBalanceInstruccion = 0;
    this.valorBalanceDonativo = 0;
    this.valorBalanceCuido = 0;
    this.valorBalanceMatricula = 0;
    this.valorBalanceSeguro = 0;
    this.valorBalanceSecurity = 0;
    this.valorBalanceTecnology = 0;
    this.valorBalanceMaintenance = 0;
    this.valorBalanceYearbook = 0;
    this.valorBalanceGraduation = 0;
    this.valorBalanceLibrosDigitales = 0;
    this.valorBalanceRecargo = 0;

    this.recibidoMensualidadInstruccionPagado = 0;
    this.recibidoMontoDonationFeePagado = 0;
    this.recibidoMontoTotalCuidoPagado = 0;
    this.recibidoMontoGraduationFeePagado = 0;
    this.recibidoMontoTotalMatriculaStudentsPagado = 0;
    this.recibidoMontoTotalSeguroStudentsPagado = 0;
    this.recibidoMontoYearbookPagado = 0;
    this.recibidoMontoMaintenanceFeePagado = 0;
    this.recibidoMontoSecurityFeePagado = 0;
    this.recibidoMontoTechnologyFeePagado = 0;
    this.recibidoMontoLibrosDigitalesPagado = 0;
    this.recibidoMontoRecargoPagado = 0;
    pagos.forEach(pago => {
      let totalRecibido = 0;
      // totalRecibido += pago.totalPago;
      // this.recibidoTotalPago += pago.totalPago;

      this.valorBalanceInstruccion += pago.mensualidadInstruccionPagado;
      totalRecibido += pago.mensualidadInstruccionPagado;
      this.recibidoMensualidadInstruccionPagado += pago.mensualidadInstruccionPagado;
      
      this.valorBalanceDonativo += pago.montoDonationFeePagado;
      totalRecibido += pago.montoDonationFeePagado;
      this.recibidoMontoDonationFeePagado += pago.montoDonationFeePagado;

      this.valorBalanceCuido += pago.montoTotalCuidoPagado;
      totalRecibido += pago.montoTotalCuidoPagado;
      this.recibidoMontoTotalCuidoPagado += pago.montoTotalCuidoPagado;

      this.valorBalanceGraduation += pago.montoGraduationFeePagado;
      totalRecibido += pago.montoGraduationFeePagado;
      this.recibidoMontoGraduationFeePagado += pago.montoGraduationFeePagado;
      
      this.valorBalanceMatricula += pago.montoTotalMatriculaStudentsPagado;
      totalRecibido += pago.montoTotalMatriculaStudentsPagado;
      this.recibidoMontoTotalMatriculaStudentsPagado += pago.montoTotalMatriculaStudentsPagado;


      this.valorBalanceSeguro += pago.montoTotalSeguroStudentsPagado;
      totalRecibido += pago.montoTotalSeguroStudentsPagado;
      this.recibidoMontoTotalSeguroStudentsPagado += pago.montoTotalSeguroStudentsPagado;

      this.valorBalanceYearbook += pago.montoYearbookPagado;
      totalRecibido += pago.montoYearbookPagado;
      this.recibidoMontoYearbookPagado += pago.montoYearbookPagado;


      this.valorBalanceMaintenance += pago.montoMaintenanceFeePagado;
      totalRecibido += pago.montoMaintenanceFeePagado;
      this.recibidoMontoMaintenanceFeePagado += pago.montoMaintenanceFeePagado;


      this.valorBalanceSecurity += pago.montoSecurityFeePagado;
      totalRecibido += pago.montoSecurityFeePagado;
      this.recibidoMontoSecurityFeePagado += pago.montoSecurityFeePagado;

      this.valorBalanceTecnology += pago.montoTechnologyFeePagado;
      totalRecibido += pago.montoTechnologyFeePagado;
      this.recibidoMontoTechnologyFeePagado += pago.montoTechnologyFeePagado;

      this.valorBalanceLibrosDigitales += pago.montoLibrosDigitalesPagado;
      totalRecibido += pago.montoLibrosDigitalesPagado;
      this.recibidoMontoLibrosDigitalesPagado += pago.montoLibrosDigitalesPagado;

      this.valorBalanceRecargo += pago.montoRecargoPagado;
      totalRecibido += pago.montoRecargoPagado;
      this.recibidoMontoRecargoPagado += pago.montoRecargoPagado;

      this.totalRecibido += totalRecibido;
      this.totalRecibir = this.estadoCuentasFamily.totalAnual;
      this.balance = this.totalRecibir - this.totalRecibido;
    });

    return pagos;
  }

  /**
   * Metodo que permite hacer el pago de la familia
   */
  public payFamily(): void {
    this.submitted = true;
    this.f.totalPago.setErrors(null);
    
		if (this.formPagos.invalid) {
			return;
    }
    this.validarValores();
  }

  public validarValores(): void {
    let valoresFormPago = {};
    var valoresInput = this.formPagos.value;
    var updatePagosFamily = false;
    var total = 0;

    valoresFormPago['fechaCreoPago'] = moment(this.f.fechaCreoPago.value, 'DD/MM/YYYY').utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0}).toISOString();
    var m = moment(this.f.fechaCreoRegistro.value, 'DD/MM/YYYY').utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0}).toISOString();
    valoresFormPago['fechaCreoRegistro'] = m;

    if(valoresInput.tipoDePago) {
      valoresFormPago['tipoPago'] = valoresInput.tipoDePago;
    } else {
      valoresFormPago['tipoPago'] = '';
    }

    if(valoresInput.numeroDeCheque) {
      valoresFormPago['numeroDeCheque'] = valoresInput.numeroDeCheque;
    } else {
      valoresFormPago['numeroDeCheque'] = '';
    }

    if(valoresInput.banco) {
      valoresFormPago['banco'] = valoresInput.banco;
    } else {
      valoresFormPago['banco'] = '';
    }

    if(valoresInput.totalPago) {
      updatePagosFamily = true;
      valoresFormPago['totalPago'] = +valoresInput.totalPago;
    } else {
      valoresFormPago['totalPago'] = 0;
    }

    if (valoresInput.mensualidadGrados) {      
      updatePagosFamily = true;
      valoresFormPago['montoTotalAnualMensualidadGradoStudentsPagado'] = +valoresInput.mensualidadGrados;
      valoresFormPago['montoTotalMensualidadGradoStudentsPagado'] = +valoresInput.mensualidadGrados;
      valoresFormPago['mensualidadInstruccionPagado'] = +valoresInput.mensualidadGrados;
      total += +valoresInput.mensualidadGrados;          
    } else {
      valoresFormPago['montoTotalAnualMensualidadGradoStudentsPagado'] = 0;
      valoresFormPago['montoTotalMensualidadGradoStudentsPagado'] = 0;
      valoresFormPago['mensualidadInstruccionPagado'] = 0
    }

    if (valoresInput.donativo) {      
      updatePagosFamily = true;
      valoresFormPago['montoDonationFeePagado'] = +valoresInput.donativo;
      total += +valoresInput.donativo;
    } else {
      valoresFormPago['montoDonationFeePagado'] = 0;
    }

    if(valoresInput.cuido) {
      updatePagosFamily = true;
      valoresFormPago['montoTotalCuidoPagado'] = +valoresInput.cuido;
      total += +valoresInput.cuido;
    } else {
      valoresFormPago['montoTotalCuidoPagado'] = 0;
    }

    if(valoresInput.graduation) {
      updatePagosFamily = true;
      valoresFormPago['montoGraduationFeePagado'] = +valoresInput.graduation;
      total += +valoresInput.graduation;
    } else {
      valoresFormPago['montoGraduationFeePagado'] = 0;
    }

    if(valoresInput.admission) {
        updatePagosFamily = true;        
        valoresFormPago['montoTotalAdmissionFeeStudentsPagado'] = +valoresInput.admission;
        valoresFormPago['montoTotalMatriculaStudentsPagado'] = +valoresInput.admission;
        total += +valoresInput.admission;
    } else {
      valoresFormPago['montoTotalAdmissionFeeStudentsPagado'] = 0;
      valoresFormPago['montoTotalMatriculaStudentsPagado'] = 0;
    }

    if(valoresInput.insurance) {      
        updatePagosFamily = true;
        valoresFormPago['montoTotalAdmissionFeeStudentsPagado'] += +valoresInput.insurance;
        valoresFormPago['montoTotalSeguroStudentsPagado'] = +valoresInput.insurance;
        total += +valoresInput.insurance;      
    } else {
      valoresFormPago['montoTotalAdmissionFeeStudentsPagado'] = 0;
      valoresFormPago['montoTotalSeguroStudentsPagado'] = 0
    }

    if (valoresInput.yearBook) {    
      updatePagosFamily = true;        
      valoresFormPago['montoYearbookPagado'] = +valoresInput.yearBook;
      total += +valoresInput.yearBook;      
    } else {
      valoresFormPago['montoYearbookPagado'] = 0;
    }

    if (valoresInput.maintenanceFee) {
      updatePagosFamily = true;
      valoresFormPago['montoMaintenanceFeePagado'] = +valoresInput.maintenanceFee;
      total += +valoresInput.maintenanceFee;
    } else {
      valoresFormPago['montoMaintenanceFeePagado'] = 0;
    }

    if (valoresInput.securityFee) {
      updatePagosFamily = true;
      valoresFormPago['montoSecurityFeePagado'] = +valoresInput.securityFee;
      total += +valoresInput.securityFee;      
    } else {
      valoresFormPago['montoSecurityFeePagado'] = 0;
    }

    if (valoresInput.technologyFee) {
      updatePagosFamily = true;
      valoresFormPago['montoTechnologyFeePagado'] = +valoresInput.technologyFee;
      total += +valoresInput.technologyFee;      
    } else {
      valoresFormPago['montoTechnologyFeePagado'] = 0;
    }

    if(valoresInput.librosDigitales) {
      updatePagosFamily = true;
      valoresFormPago['montoLibrosDigitalesPagado'] = +valoresInput.librosDigitales;
      total += +valoresInput.librosDigitales;
    } else {
      valoresFormPago['montoLibrosDigitalesPagado'] = 0;
    }

    if(valoresInput.recargo) {
      updatePagosFamily = true;
      valoresFormPago['montoRecargoPagado'] = +valoresInput.recargo;
      total += +valoresInput.recargo;
    } else {
      valoresFormPago['montoRecargoPagado'] = 0;
    }

    if(updatePagosFamily){
      valoresFormPago['montoTotalAnualPagado'] = total;
      valoresFormPago['codigoFamilia'] = this.familyInfo.codigoFamilia;
      this.guardarPago(valoresFormPago);
    }
  }


  /**
   * Metodo que permite crear un pago realizado
   * @param total monto total anual pagado
   * @param valoresFormPago Valores del formulario de pago
   */
  public guardarPago(valoresFormPago: any): void { 
    
    // Validar campo total
    let suma = 0;
    suma += valoresFormPago.mensualidadInstruccionPagado;
    suma += valoresFormPago.montoDonationFeePagado;
    suma += valoresFormPago.montoTotalCuidoPagado;
    suma += valoresFormPago.montoGraduationFeePagado;
    suma += valoresFormPago.montoTotalMatriculaStudentsPagado;
    suma += valoresFormPago.montoTotalSeguroStudentsPagado;
    suma += valoresFormPago.montoYearbookPagado;
    suma += valoresFormPago.montoMaintenanceFeePagado;
    suma += valoresFormPago.montoSecurityFeePagado;
    suma += valoresFormPago.montoTechnologyFeePagado;
    suma += valoresFormPago.montoLibrosDigitalesPagado;
    suma += valoresFormPago.montoRecargoPagado;
    this.verificarTotal = false;
    // Valida campo total con la suma de todos los numeros
    if(valoresFormPago.totalPago  != suma) {
      this.f.totalPago.setErrors({'incorrect': true});
      this.verificarTotal = true;
      Swal.fire({
        title: 'Error!',
        text: 'El valor TOTAL no coincide con el resto de campos',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    // Validar si se debe seleccionar otro mes
    if(
      this.validarSelectorMeses(valoresFormPago.mensualidadInstruccionPagado, 'instruccion') ||
      (this.estadoCuentasFamily.totalMensualidadDonativo > 0 && this.validarSelectorMeses(valoresFormPago.montoDonationFeePagado, 'donativo')) ||
      (this.estadoCuentasFamily.cuido > 0 && this.validarSelectorMeses(valoresFormPago.montoTotalCuidoPagado, 'cuido'))
    ){
      Swal.fire({
        title: 'Error!',
        text: 'Favor de verificar las cantidades entradas y los meses seleccionados',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return
    }
   


    // Validar Mes seleccionado no se halla pagado
    let mesesSeleccionados = this.f.selectorMes.value;
    // let flagMonthPayed = false;
    // for (let index = 0; index < mesesSeleccionados.length; index++) {
    //   const mes = mesesSeleccionados[index];
    //   if(mes.payPorcentaje == 100) {
    //     Swal.fire({
    //       title: 'Error!',
    //       text: 'La instruccion del mes ' + mes.name +' ya ha sido pagado al 100%',
    //       icon: 'error',
    //       confirmButtonText: 'Aceptar'
    //     });
    //     flagMonthPayed = true;
    //     break;
    //   }
      
    // }
    // if(flagMonthPayed) return;

    // Agregamos meses seleccionados
    // Calcular porcentaje pagado de acuerdo a valores ingresados
    this.calcularPorcentajeMesesSeleccionados(valoresFormPago, mesesSeleccionados);
    valoresFormPago.mesesPendientesPagarMensualidad = this.estadoCuentasFamily.mesesPendientesPagarMensualidad;

    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se realizara un pago !!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        // Ejecuta metodo que obtener anions y realiza pago
        this.getAnios(valoresFormPago);        
      }
    })    
  }

  /**
   * Metodo que permite calcular el porcentaje de los valores (instruccion, donativo y cuido)
   * para agregarlos en cada mes del selector.
   * @param valoresFormPago Valores de campos ingresados
   * @param mesesSeleccionados Meses seleccionados selector
   */
  private calcularPorcentajeMesesSeleccionados(valoresFormPago, mesesSeleccionados): any {
    let mensualidad = valoresFormPago.mensualidadInstruccionPagado;
    let donativo = valoresFormPago.montoDonationFeePagado;
    let cuido = valoresFormPago.montoTotalCuidoPagado;

    mesesSeleccionados.map(mes => {
      // Valor pagando es mayor que la instruccion a pagar
      if(mensualidad >= this.estadoCuentasFamily.totalMensualidadGradoStudents) {
        mensualidad -= this.estadoCuentasFamily.totalMensualidadGradoStudents;
        mes.payPorcentaje = 100.00;
      } else {
        mes.payPorcentaje = +((mensualidad * 100) / this.estadoCuentasFamily.totalMensualidadGradoStudents).toFixed(2);
      }

      // Valor pagando es mayor que donativo a pagar
      if(this.estadoCuentasFamily.totalMensualidadDonativo > 0) {
        if(donativo >= this.estadoCuentasFamily.totalMensualidadDonativo) {
          donativo -= this.estadoCuentasFamily.totalMensualidadDonativo;
          mes.payDonationPorcentaje = 100.00;
        } else {
          mes.payDonationPorcentaje = +((donativo * 100) / this.estadoCuentasFamily.totalMensualidadDonativo).toFixed(2);
        }
      }

      // valor pagando es mayor que cuido a pagar
      if(this.estadoCuentasFamily.cuido > 0) {
        if(cuido >= this.estadoCuentasFamily.cuido) {
          cuido -= this.estadoCuentasFamily.cuido;
          mes.payCuidoPorcentaje = 100.00;
        } else {
          mes.payCuidoPorcentaje = +((cuido * 100) / this.estadoCuentasFamily.cuido).toFixed(2);
        }
      }
      return mes;
    });
  }

  /**
   * Metodo que permite validar si debe seleccionar otro mes para distribuir
   * el valor restante en otro mes, de acuerdo a la mensualidad ingresada en el campo
   * @param mensualidadValorPagado valor que se esta pagando 
   */
  private validarSelectorMeses(mensualidadValorPagado: any, type: any): boolean {
    let mesesSeleccionar = 0;
    let porcentajeValorPagado = 0;

    // porcentaje instruccion pagado
    if(type === 'instruccion') {
      porcentajeValorPagado = (mensualidadValorPagado / this.estadoCuentasFamily.totalAnualMensualidadGradoStudents) * 100;
    } else if(type === 'donativo') {
      porcentajeValorPagado = (mensualidadValorPagado / this.estadoCuentasFamily.totalMensualidadDonativo) * 10;
    } else {
      porcentajeValorPagado = (mensualidadValorPagado / this.estadoCuentasFamily.cuido) * 10;
    }
    
    //Switch para saber cuantos meses se debe seleccionar para distribuir valores
    switch (true) {
      case porcentajeValorPagado <= 10:
        mesesSeleccionar = 1;
        break;
      case porcentajeValorPagado <= 20:
        mesesSeleccionar = 2;
        break;
      case porcentajeValorPagado <= 30:
        mesesSeleccionar = 3;
        break;
      case porcentajeValorPagado <= 40:
        mesesSeleccionar = 4;
        break;
      case porcentajeValorPagado <= 50:
        mesesSeleccionar = 5;
        break;
      case porcentajeValorPagado <= 60:
        mesesSeleccionar = 6;
        break;
      case porcentajeValorPagado <= 70:
        mesesSeleccionar = 7;
        break;
      case porcentajeValorPagado <= 80:
        mesesSeleccionar = 8;
        break;
      case porcentajeValorPagado <= 90:
        mesesSeleccionar = 9;
        break;
      case porcentajeValorPagado <= 100:
        mesesSeleccionar = 10;
        break;
      default:
        break;
    }

    console.log('Meses pagado: ' + mesesSeleccionar);

    let mesesSeleccionados = this.f.selectorMes.value;
    if(mesesSeleccionados.length != mesesSeleccionar) {
      console.log('Se debe selecionar otro mes para distribuir valores restantes')
      return true;
    }
    return false;
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
    this.mdbTable.setDataSource(this.pagosFamily);
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
          this.getInfoFamily(this.familyInfo.codigoFamilia);
        }
      },
      error => {
        console.log(error);
      }
    )
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

  /**
   * Metodo que permite reset el formulario de pagos
   */
  public resetForm():void {
    this.f.fechaCreoRegistro.setValue(null);
    this.f.fechaCreoPago.setValue(null);

    this.f.totalPago.setValue(null);
    this.f.mensualidadGrados.setValue(null);
    this.f.donativo.setValue(null);
    this.f.cuido.setValue(null);
    this.f.graduation.setValue(null);
    this.f.admission.setValue(null);
    this.f.insurance.setValue(null);

    this.f.yearBook.setValue(null);
    this.f.maintenanceFee.setValue(null);
    this.f.securityFee.setValue(null);
    this.f.technologyFee.setValue(null);

    this.f.librosDigitales.setValue(null);
    this.f.recargo.setValue(null);

    this.f.numeroDeCheque.setValue(null);
    this.f.banco.setValue(null);
    
    this.inputDatePicker.value = '';
    this.valorFecha = null;
    this.f.tipoDePago.setValue(null);

    this.submitted = false;
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
    this.dateValue = moment(event.value, 'DD/MM/YYYY');
    let fechaCreoRegistro = moment(new Date()).format('DD/MM/YYYY');
    this.f.fechaCreoRegistro.setValue(fechaCreoRegistro);
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

  /**
   * Metodo que permite obtener la lista de anios creados
   */
  public getAnios(valoresFormPago: any): void {
    this.startAnioService.getStartAnios().subscribe(
      response => {
        if(response.status) {
          this.listaAnios = response.startAnios;
          // Fechas startAnio
          valoresFormPago["fromDateAnio"] = this.listaAnios[this.listaAnios.length - 1].fromDateAnio;
          valoresFormPago["toDateAnio"] = this.listaAnios[this.listaAnios.length - 1].toDateAnio;

          // Guardar pago
          this.pagoService.savePago(valoresFormPago).subscribe(
            response => {
              if(response.status) {
                Swal.fire({
                  title: 'Exitoso!',
                  text: response.messagge,
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                });
                this.resetForm();
                this.getInfoFamily(this.familyInfo.codigoFamilia);
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      },
      error => {
        console.log(error);
      }
    )
  }
}
