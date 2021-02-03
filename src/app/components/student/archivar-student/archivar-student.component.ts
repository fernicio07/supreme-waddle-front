import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { StudentService } from '../../../services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-archivar-student',
  templateUrl: './archivar-student.component.html'
})
export class ArchivarStudentComponent implements OnInit, AfterViewInit {

  public students: Array<any> = [];

  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;   
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;

  public elements: any = [];
  public headElements = ['Código familia', 'Nombre completo', 'Apellidos', 'Grado', 'Fecha nacimiento', 'Acciones'];
  public previous: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.getStudents();
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(8);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  public getStudents(): void {
    // Obtener estudiantes inactivos 
		this.studentService.getStudentsInactivos().subscribe(
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

  public desarchivarEstudiante(estudiante: any): void {
    estudiante.archivar = false;
    this.studentService.inactivarStudent(estudiante).subscribe(
      response => {
        if(response.status) {
          Swal.fire({
            title: 'Exitoso!',
            text: 'Estudiante activado',
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

}
