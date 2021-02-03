import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MdbTableDirective, MdbTablePaginationComponent, MDBModalRef, MDBModalService } from "angular-bootstrap-md";
import { AdmissionFeeService } from '../../services/admission-fee.service';
import { EditarAdmissionFeeComponent } from './editar-admission-fee/editar-admission-fee.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admission-fee',
  templateUrl: './admission-fee.component.html'
})
export class AdmissionFeeComponent implements OnInit {

  @ViewChild('tableStudent', { static: true }) mdbTableStudent: MdbTableDirective;
  @ViewChild('tableFamily', { static: true }) mdbTableFamily: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;

  modalRef: MDBModalRef;

  public elements: any = [];
  public elementsStudent: any = [];
  public elementsFamily: any = [];
  public previousStudent: any = [];
  public previousFamily: any = [];
  public headElements = ['Nombre', 'Precio', 'Acción'];

  public listCategoryAdmissionFee: Array<any> = ['Student', 'Family']

  public submitted: boolean = false;
  // public formAdmissionFee: FormGroup;

  constructor(
    // private formBuilder: FormBuilder,
    private _admissionFeeService: AdmissionFeeService,
    private modalService: MDBModalService
  ) { }

  ngOnInit(): void {
    // this.formAdmissionFee = this.formBuilder.group({
    //   nameAdmissionFee: [null, Validators.required],
    //   costAdmissionFee: [null, Validators.required],
    //   categoryAdmissionFee: [null, Validators.required]
    // })
    this.getAdmissionFees();
  }

  // get f() {
	// 	return this.formAdmissionFee.controls;
	// }

  getAdmissionFees() {
    // Obtener AdmissionFee
		this._admissionFeeService.getAdmissionFees().subscribe(
			response => {
        if(response.status) {
          this.elementsStudent = response.objAdmissionFee.student;
          this.elementsFamily = response.objAdmissionFee.family;
          //this.elements = response.objAdmissionFee;
          this.mdbTableStudent.setDataSource(this.elementsStudent);
          this.mdbTableFamily.setDataSource(this.elementsFamily);
          //this.elements = this.mdbTable.getDataSource();
          this.previousStudent = this.mdbTableStudent.getDataSource();
          this.previousFamily = this.mdbTableFamily.getDataSource();
        } else {
          console.log("Error get data");
        }
			},
			error => {
				console.log(error);
			}
		)
  }

  editarAdmissionFeeStudent(el: any) {
    const elementsStudentIndex = this.elementsStudent.findIndex((elem: any) => el === elem);
    const modalOptions = {
      data: {
        editableRow: el
      }
    };
    this.modalRef = this.modalService.show(EditarAdmissionFeeComponent, modalOptions);
    this.modalRef.content.saveButtonClicked.subscribe((newElement: any) => {
      this.elementsStudent[elementsStudentIndex].name = newElement.name;
      this.elementsStudent[elementsStudentIndex].cost = +newElement.cost;
      this.updateAdmissionFee(this.elementsStudent[elementsStudentIndex]);
    });
    this.mdbTableStudent.setDataSource(this.elementsStudent);
  }

  editarAdmissionFeeFamily(el: any) {
    const elementsFamilyIndex = this.elementsFamily.findIndex((elem: any) => el === elem);
    const modalOptions = {
      data: {
        editableRow: el
      }
    };
    this.modalRef = this.modalService.show(EditarAdmissionFeeComponent, modalOptions);
    this.modalRef.content.saveButtonClicked.subscribe((newElement: any) => {
      this.elementsFamily[elementsFamilyIndex].name = newElement.name;
      this.elementsFamily[elementsFamilyIndex].cost = +newElement.cost;
      this.updateAdmissionFee(this.elementsFamily[elementsFamilyIndex]);
    });
    this.mdbTableStudent.setDataSource(this.elementsFamily);
  }

  updateAdmissionFee(admissionFee: any) {
    // Actualizar Admission Fee
    this._admissionFeeService.updateAdmissionFee(admissionFee).subscribe(
			response => {
        Swal.fire({
          title: 'Exitoso!',
          text: 'Admission Fee actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
			},
			error => {
				console.log(error);
			}
		)
  }

  // saveAdmissionFee() {
  //   // Save AdmissionFee
  //   let admisionFee = this.formAdmissionFee.value;
  //   this._admissionFeeService.saveAdmissionFee(admisionFee).subscribe(
	// 		response => {
  //       if(response.admissionFee) {
  //         this.formAdmissionFee.reset();
  //         this.getAdmissionFees();       
  //       } else {
  //         console.log("Error saved Data");
  //       }
	// 		},
	// 		error => {
	// 			console.log(<any>error);
	// 		}
	// 	)
  // }

  /**
   * Metodo que permite adjudicar cantidades para los estudiantes activos
   * y de grado PP a 11mo grado
   */
  public agregarCantidadEstudiantes(): void {
    Swal.fire({
			title: '¿Estas seguro?',
			text: "Se van a adjudicar los cargos a todas las familias con hijas de PP a 11mo grado que estén activas",
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
		}).then((result) => {
			if (result.value) {
				this._admissionFeeService.agregarCantidadEstudiantes().subscribe(
          response => {
            if(response.status) {
              Swal.fire({
                title: 'Exitoso!',
                text: response.messagge,
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
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
   * Metodo que permite adjudicar cantidades para las familias activas
   */
  public agregarCantidadFamilias(): void {
    Swal.fire({
			title: '¿Estas seguro?',
			text: "Se van a adjudicar los cargos a todas las familias con hijas de PP a 11mo grado que estén activas",
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
		}).then((result) => {
			if (result.value) {
				this._admissionFeeService.agregarCantidadFamilias().subscribe(
          response => {
            if(response.status) {
              Swal.fire({
                title: 'Exitoso!',
                text: response.messagge,
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          error => {
            console.log(error);
          }
        )
			}
		})
  }

}
