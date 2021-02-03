import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { StudentService } from '../../services/student.service';
import { StartAnioService } from '../../services/start-anio.service';
import { MDBModalService, MDBModalRef } from 'angular-bootstrap-md';
import { StartAnioComponent } from './start-anio/start-anio.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  public listaAnios: Array<any> = [];

  modalRef: MDBModalRef;

  constructor(
    private modalService: MDBModalService,
    private startAnioService: StartAnioService
  ) { }

  ngOnInit(): void { }

  openModalStartAnio(): void {
    this.modalRef = this.modalService.show(StartAnioComponent);
    this.modalRef.content.saveButtonClicked.subscribe((newElement: any) => {
      if(newElement) {
        this.getAnios();
      }
    });
  }

  /**
   * Metodo que permite crear un anio
   */
  public crearAnio(): void {
    let anio = {};
    if(this.listaAnios.length > 0) {
      anio['fromDateAnio'] = ++this.listaAnios[this.listaAnios.length - 1].fromDateAnio;
      anio['toDateAnio'] = ++this.listaAnios[this.listaAnios.length - 1].toDateAnio;
    } else {
      let yearFrom = new Date().getFullYear();
      anio['fromDateAnio'] = yearFrom;
      anio['toDateAnio'] = yearFrom + 1;
    }

    this.startAnioService.saveStartAnio(anio).subscribe(
      response => {
        if(response.status) {
          Swal.fire({
            title: 'Exitoso!',
            text: 'Un nuevo año ha comenzado',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.startAnio();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo que permite obtener la lista de anios creados
   */
  public getAnios(): void {
    this.startAnioService.getStartAnios().subscribe(
      response => {
        if(response.status) {
          this.listaAnios = response.startAnios;
          this.crearAnio();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Metodo que permite SET toda la informacion para un nuevo año
   */
  public startAnio(): void {
    this.startAnioService.startAnio().subscribe(
      response => {
        if(response.status) {
          console.log(response);
        }
      },
      error => {
        console.log(error);
      }
    )
  }
}
