import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { PriceGradeService } from '../../services/price-grade.service';
import { FamilyService } from '../../services/family.service';
import { StartAnioService } from '../../services/start-anio.service';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html'
})
export class HomeDashboardComponent implements OnInit {
  public results: Array<any>;
  public listaNumber: Array<any> = [];
  public listaGrado: Array<any> = [];
  public listaAnios: Array<any> = [];
  public totalesAnio: any;
  public porcentajeMensualidad: number;
  public porcentajeDonativo: number;
  public porcentajeMatricula: number;
  public porcentajeGraduacion: number;
  public porcentajeCuotasEspeciales: number;
  public totalStudents: number = 0;

  public dateFrom: any;
  public dateTo: any;
  public totalFamiliasActivas: number;
  public totalFamilias: number;


  constructor(
    private studentService: StudentService,
    private priceGradeService: PriceGradeService,
    private startAnioService: StartAnioService,
    private familyService: FamilyService
  ) { }

  ngOnInit(): void {
    this.getStudentsByFilterGrade();
    this.getPriceGradeService();
    this.getAnios();
    this.familiasActivasSinEstudiantesDeBaja();
    this.getTotalFamilias();
  }

  public getStudentsByFilterGrade(): void {
    this.studentService.getStudentsByFilterGrade().subscribe(
      response => {
        this.results = response.results;
        this.results.forEach(student => {
          this.totalStudents += student.total;
        })
      },
      error => {
        console.log(error);
      }
    )
  }
  
  public getPriceGradeService(): void {
    this.priceGradeService.getTotalesAnio().subscribe(
      response => {
        this.totalesAnio = response;
        this.calcularPorcentajes();
      },
      error => {
        console.log(error);
      }
    )
  }

  calcularPorcentajes():void {
    this.porcentajeMensualidad = Number(((this.totalesAnio[0].totalMensualidadesAnio * 100) / this.totalesAnio[0].sumaTodosTotales).toFixed(2));
    this.porcentajeDonativo = Number(((this.totalesAnio[0].totalDonativoAnio * 100) / this.totalesAnio[0].sumaTodosTotales).toFixed(2));
    this.porcentajeMatricula = Number(((this.totalesAnio[0].totalMatriculaAnio * 100) / this.totalesAnio[0].sumaTodosTotales).toFixed(2));
    this.porcentajeGraduacion = Number(((this.totalesAnio[0].totalGraduationFeeAnio * 100) / this.totalesAnio[0].sumaTodosTotales).toFixed(2));
    this.porcentajeCuotasEspeciales = Number(((this.totalesAnio[0].totalCuotasEspecialesAnio * 100) / this.totalesAnio[0].sumaTodosTotales).toFixed(2)); 
  }

  /**
   * Metodo que permite obtener la lista de anios creados
   */
  public getAnios(): void {
    this.startAnioService.getStartAnios().subscribe(
      response => {
        if(response.status) {
          this.listaAnios = response.startAnios;
          this.setFecha();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  setFecha() {
      // From Date
      // let yearFrom = new Date().getFullYear();
      let yearFrom = this.listaAnios[this.listaAnios.length - 1].fromDateAnio;
      // this.dateFrom = new Date(yearFrom, 7, 1);
      this.dateFrom = `Agosto ${yearFrom}`

      // To Date
      // let yearTo = yearFrom + 1;
      let yearTo = this.listaAnios[this.listaAnios.length - 1].toDateAnio;
      var date = new Date(yearTo, 5)
      date.setDate(date.getDate() - 1);
      let day = date.getDate();
      // this.dateTo = new Date(yearTo, 6, day);
      this.dateTo = `Julio ${yearTo}`
  }

  public familiasActivasSinEstudiantesDeBaja(): void {
    this.familyService.familiasActivasSinEstudiantesDeBaja().subscribe(
      response => {
        this.totalFamiliasActivas = response.totalFamiliasActivas;
      },
      error => {
        console.log(error);
      }
    )
  }

  public getTotalFamilias(): void {
    this.familyService.getTotalFamilias().subscribe(
      response => {
        if(response.status) {
          this.totalFamilias = response.totalFamilias
        }
      },
      error => {
        console.log(error);
      }
    )
  }

}