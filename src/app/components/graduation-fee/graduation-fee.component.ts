import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MdbTableDirective, MdbTablePaginationComponent, MDBModalRef, MDBModalService } from "angular-bootstrap-md";
import { GraduationFeeService } from '../../services/graduation-fee.service';
import Swal from 'sweetalert2';
import { EditarGraduationFeeComponent } from './editar-graduation-fee/editar-graduation-fee.component';
import { CuentaFamilyService } from '../../services/cuenta-family.service';

@Component({
  selector: 'app-graduation-fee',
  templateUrl: './graduation-fee.component.html'
})
export class GraduationFeeComponent implements OnInit {

  @ViewChild('tableGraduationFee', { static: true }) mdbTableGraduationFee: MdbTableDirective;
  @ViewChild('tableFamily', { static: true }) mdbTableFamily: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;

  modalRef: MDBModalRef;

  public elements: any = [];
  public elementsGraduation: any = [];
  public elementsFamily: any = [];
  public previousGraduationFee: any = [];
  public previousFamily: any = [];
  public headElementsGraduationFee = ['Nombre', 'Precio', 'Acción'];
  public headElementsFamily = ['Codigo de Familia'];

  public submitted: boolean = false;
  // public formGraduationFee: FormGroup;

  constructor(
    // private formBuilder: FormBuilder,
    private _graduationFeeService: GraduationFeeService,
    // private _familyService: FamilyService,
    private modalService: MDBModalService,
    private cuentaFamilyService: CuentaFamilyService
  ) { }

  ngOnInit(): void {
    // this.formGraduationFee = this.formBuilder.group({
    //   nameGraduationFee: [null, Validators.required],
    //   costGraduationFee: [null, Validators.required]
    // })
    this.getGraduationFees();
    //this.getFamiliasPayGraduationFee();
  }

  // get f() {
	// 	return this.formGraduationFee.controls;
  // }
  
  /**
   * Metodo que permite obtener los Graduation Fee
   */
  getGraduationFees() {
    // Obtener GraduationFee
		this._graduationFeeService.getGraduationFees().subscribe(
			response => {
        if(response.status) {
          this.elementsGraduation = response.graduationFees;
          this.mdbTableGraduationFee.setDataSource(this.elementsGraduation);
          this.previousGraduationFee = this.mdbTableGraduationFee.getDataSource();
        } else {
          console.log("Error get data");
        }
			},
			error => {
				console.log(error);
			}
		)
  }

  editarGraduationFee(el: any) {
    const elementIndex = this.elementsGraduation.findIndex((elem: any) => el === elem);
    const modalOptions = {
      data: {
        editableRow: el
      }
    };
    this.modalRef = this.modalService.show(EditarGraduationFeeComponent, modalOptions);
    this.modalRef.content.saveButtonClicked.subscribe((newElement: any) => {
      this.elementsGraduation[elementIndex].name = newElement.name;
      this.elementsGraduation[elementIndex].cost = +newElement.cost;
      this.updateGraduationFee(this.elementsGraduation[elementIndex]);
    });
    this.mdbTableGraduationFee.setDataSource(this.elementsGraduation);
  }

  updateGraduationFee(graduationFee: any) {
    // Actualizar Graduation Fee
    this._graduationFeeService.updateGraduationFee(graduationFee).subscribe(
			response => {
        Swal.fire({
          title: 'Exitoso!',
          text: 'Graduation Fee actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
			},
			error => {
				console.log(error);
			}
		)
  }

  // /**
  //  * Metodo que permite guardar una nueva Graduation Fee
  //  */
  // saveGraduationFee() {
  //   // Save GraduationFee
  //   let graduationFee = this.formGraduationFee.value;
  //   this._graduationFeeService.saveGraduationFee(graduationFee).subscribe(
	// 		response => {
  //       if(response.graduationFee) {
  //         this.formGraduationFee.reset();
  //         this.getGraduationFees();       
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
   * Metodo que permite obtener las familias que deben 
   * pagar el Graduation Fee
   */
  // public getFamiliasPayGraduationFee(): void {
  //   this._familyService.getFamiliasPayGraduationFee().subscribe(
  //     response => {
  //       this.elementsFamily = response.families;
  //       this.mdbTableFamily.setDataSource(this.elementsFamily);
  //       this.previousFamily = this.mdbTableFamily.getDataSource();
  //     },
  //     error => {
  //       console.log(<any>error);
  //     }
  //   )
    
  // }

  /**
   * Metodo que permite adjudicar cuota de graduación al ultimo estado de cuenta
   * 
   */
  public agregarGraduacion(): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Se aplicará la graduación a estudiantes de Kinder, 8vo y 12mo.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        this.cuentaFamilyService.addGraduacionEstadoCuenta().subscribe(
          response => {
            if(response.status) {
              Swal.fire({
                title: 'Exitoso!',
                text: ' Se aplico la graduación a los estudiantes',
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
