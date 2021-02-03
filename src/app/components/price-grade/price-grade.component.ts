import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { MdbTableDirective, MdbTablePaginationComponent, MDBModalRef, MDBModalService } from "angular-bootstrap-md";
// import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { PriceGradeService } from '../../services/price-grade.service';
import { EditarGradoComponent } from './editar-grado/editar-grado.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-price-grade',
  templateUrl: './price-grade.component.html'
})
export class PriceGradeComponent implements OnInit {

  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;

  modalRef: MDBModalRef;

  public submitted: boolean = false;

  //public formPriceGrade: FormGroup;

  public elements: any = [];
  public previous: any = [];
  public headElements = ['Nombre', 'Precio', 'Acción'];
  public priceGrades : Array<any> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    //private formBuilder: FormBuilder,
     private _priceGradeService: PriceGradeService,
     private modalService: MDBModalService
  ) { }

  ngOnInit(): void {
    // this.formPriceGrade = this.formBuilder.group({
    //   nameGrade: [null, Validators.required],
    //   costGrade: [null, Validators.required]
    // })
    this.getGradePrices();
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(8);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  // get f() {
	// 	return this.formPriceGrade.controls;
	// }

  getGradePrices() {
    // Obtener Price for Grade
		this._priceGradeService.getPriceGrades().subscribe(
			response => {
        if(response.priceGrades) {
          this.priceGrades = response.priceGrades;
          this.mdbTable.setDataSource(this.priceGrades);
          this.elements = this.mdbTable.getDataSource();
          this.previous = this.mdbTable.getDataSource();
        } else {
          console.log("Error get data");
        }
			},
			error => {
				console.log(error);
			}
		)
  }

  editarGrado(el: any) {
    const elementIndex = this.elements.findIndex((elem: any) => el === elem);
    const modalOptions = {
      data: {
        editableRow: el
      }
    };
    this.modalRef = this.modalService.show(EditarGradoComponent, modalOptions);
    this.modalRef.content.saveButtonClicked.subscribe((newElement: any) => {
      this.elements[elementIndex].name = newElement.name;
      this.elements[elementIndex].cost = +newElement.cost;
      this.updateGrado(this.elements[elementIndex]);
    });
    this.mdbTable.setDataSource(this.elements);
  }

  updateGrado(grado: any) {
    // Actualizar Grado
    this._priceGradeService.updateGrado(grado).subscribe(
			response => {
        Swal.fire({
          title: 'Exitoso!',
          text: 'Grado actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
			},
			error => {
				console.log(error);
			}
		)
  }

  // savePriceGrade() {
  //     if(this.formPriceGrade.valid) {
  //     // Save Price for Grade
  //     let priceGrade = this.formPriceGrade.value;
  //     priceGrade.codeGrade = this.priceGrades.length;
  //     this._priceGradeService.savePriceGrade(priceGrade).subscribe(
  //       response => {
  //         if(response.priceGrade) {
  //           this.formPriceGrade.reset();
  //           this.getGradePrices();       
  //         } else {
  //           console.log("Error saved Data");
  //         }
  //       },
  //       error => {
  //         console.log(<any>error);
  //       }
  //     )
  //   }
  // }

}