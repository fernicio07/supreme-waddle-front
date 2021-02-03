import { Component, HostListener, ViewChild, OnInit, ChangeDetectorRef, ElementRef, AfterViewInit } from '@angular/core';
import { MdbTableDirective, MdbTablePaginationComponent, MDBModalService, MDBModalRef } from 'angular-bootstrap-md';
import { StudentService } from 'src/app/services/student.service';
import { Router } from '@angular/router';
import { EditarEstudianteComponent } from './editar-estudiante/editar-estudiante.component';
import { PriceGradeService } from '../../services/price-grade.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html'
})
export class StudentComponent implements OnInit, AfterViewInit {

  public students: Array<any> = [];
  public priceGrades: Array<any> = [];

  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;   
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;

  modalRef: MDBModalRef;

  public elements: any = [];
  public headElements = ['Código familia', 'Nombre completo', 'Apellidos', 'Grado', 'Fecha nacimiento', 'Acciones'];
  public searchText: string = '';
  public previous: string;

  constructor(
    private _priceGradeService: PriceGradeService,
    private cdRef: ChangeDetectorRef,
    private studentService: StudentService,
    private router: Router,
    private modalService: MDBModalService
  ) { }

  @HostListener('input') oninput() {
    this.searchItems();
  }
  
  ngOnInit(): void {
    this.getGradePrices();
    this.getStudents();
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(8);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  /**
   * Metodo para obtener los grados
   */
  getGradePrices() {
		// Obtener Price for Grade
		this._priceGradeService.getPriceGrades().subscribe(
			response => {
				if (response.priceGrades) {
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

  public getStudents(): void {
    // Obtener Students    
		this.studentService.getStudents().subscribe(
			response => {
        this.students = response.students;
        this.elements = this.students;
        this.mdbTable.setDataSource(this.elements);
        this.previous = this.mdbTable.getDataSource();
			},
			error => {
				console.log(error);
			}
		)
  }

  /**
   * Metodo que permite buscar en la tabla por codigo de familia
   */
  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.elements = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.elements = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['codigoFamilia', 'lastName']);
      this.mdbTable.setDataSource(prev);
    }
  }

  /**
   * Metodo que permite editar estudiante
   */
  public editarEstudiantes(el: any):void {
    const elementIndex = this.elements.findIndex((elem: any) => el === elem);
    const modalOptions = {
      data: {
        editableRow: el,
        priceGrades: this.priceGrades
      },
      class: 'modal-lg',
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(EditarEstudianteComponent, modalOptions);
    this.modalRef.content.saveButtonClicked.subscribe((newElement: any) => {
      for (const key in newElement.editableRow) {
        const element = newElement.editableRow[key];
        this.elements[elementIndex][key] = element;
      }
      for(const key in newElement.cantidadesEstudiante) {
        let element = +newElement.cantidadesEstudiante[key];
        if(typeof newElement.cantidadesEstudiante[key] === 'string' && newElement.cantidadesEstudiante[key].indexOf(',') > 0) {
          element = +newElement.cantidadesEstudiante[key].replace(',', '');
        }
        this.elements[elementIndex][key] = element;
      }
      this.updateStudent(this.elements[elementIndex]);
    });
    this.mdbTable.setDataSource(this.elements);
  }

  /**
   * Metodo que permite actualizar un estudiante de la familia
   * @param student estudiante actualizar
   */
  updateStudent(student: any) {
    // Actualizar Estudiante
    this.studentService.updateStudent(student).subscribe(
			response => {
        Swal.fire({
          title: 'Exitoso!',
          text: 'Estudiante actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
			},
			error => {
				console.log(error);
			}
		)
  }

  /**
   * Metodo que permite eliminar estudiante
   */
  public eliminarEstudiante(estudiante: any):void {    
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se eliminara el estudiante y todos sus datos asociados a la familia!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        this.studentService.deleteStudent(estudiante._id).subscribe(
          response => {
            if(response.status) {
              Swal.fire({
                title: 'Exitoso!',
                text: 'Estudiante eliminado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.getStudents();
            }
          },
          error => {
            console.log(error);
          }
        )        
      }
    })
  }

  public archivarEstudiante(estudiante: any): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se archivara el estudiante!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        estudiante.archivar = true;
        this.studentService.inactivarStudent(estudiante).subscribe(
          response => {
            if(response.status) {
              Swal.fire({
                title: 'Exitoso!',
                text: response.messagge,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                timer: 2000
              });
              this.getStudents();
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
	 * Metodo que permite cambiar de vista para crear estudiantes
	 */
	public crearEstudiante(): void {
		this.router.navigate(['/dashboard', { outlets: { procesoDashboard: ['create-student'] } }]);	
  }
  
}