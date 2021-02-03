import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MdbTableDirective, MdbTablePaginationComponent, MDBModalRef, MDBModalService } from "angular-bootstrap-md";
import { DonationFeeService } from '../../services/donation-fee.service';
import { EditarDonationFeeComponent } from './editar-donation-fee/editar-donation-fee.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-donation-fee',
  templateUrl: './donation-fee.component.html'
})
export class DonationFeeComponent implements OnInit {

  @ViewChild('tableDonationFee', { static: true }) mdbTableDonationFee: MdbTableDirective;
  @ViewChild('tableFamily', { static: true }) mdbTableFamily: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;

  modalRef: MDBModalRef;

  public elements: any = [];
  public elementsDonation: any = [];
  public elementsFamily: any = [];
  public previousDonationFee: any = [];
  public previousFamily: any = [];
  public headElementsDonationFee = ['Nombre', 'Precio', 'Acción'];
  public headElementsFamily = ['Codigo de Familia'];

  public submitted: boolean = false;
  // public formDonationFee: FormGroup;

  constructor(
    // private formBuilder: FormBuilder,
    private _donationFeeService: DonationFeeService,
    // private _familyService: FamilyService,
    private modalService: MDBModalService
  ) { }

  ngOnInit(): void {
    // this.formDonationFee = this.formBuilder.group({
    //   nameDonationFee: [null, Validators.required],
    //   costDonationFee: [null, Validators.required]
    // })
    this.getDonationFees();
    // this.getFamiliasPayDonationFee();
  }

  // get f() {
	// 	return this.formDonationFee.controls;
  // }
  
  /**
   * Metodo que permite obtener los Donation Fee
   */
  getDonationFees() {
    // Obtener DonationFee
		this._donationFeeService.getDonationFees().subscribe(
			response => {
        if(response.status) {
          this.elementsDonation = response.donationFees;
          this.mdbTableDonationFee.setDataSource(this.elementsDonation);
          this.previousDonationFee = this.mdbTableDonationFee.getDataSource();
        } else {
          console.log("Error get data");
        }
			},
			error => {
				console.log(error);
			}
		)
  }

  editarDonationFee(el: any) {
    const elementIndex = this.elementsDonation.findIndex((elem: any) => el === elem);
    const modalOptions = {
      data: {
        editableRow: el
      }
    };
    this.modalRef = this.modalService.show(EditarDonationFeeComponent, modalOptions);
    this.modalRef.content.saveButtonClicked.subscribe((newElement: any) => {
      this.elementsDonation[elementIndex].name = newElement.name;
      this.elementsDonation[elementIndex].cost = +newElement.cost;
      this.updateDonationFee(this.elementsDonation[elementIndex]);
    });
    this.mdbTableDonationFee.setDataSource(this.elementsDonation);
  }

  updateDonationFee(donationFee: any) {
    // Actualizar Donation Fee
    this._donationFeeService.updateDonationFee(donationFee).subscribe(
			response => {
        Swal.fire({
          title: 'Exitoso!',
          text: 'Donation Fee actualizado correctamente',
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
  //  * Metodo que permite guardar una nueva Donation Fee
  //  */
  // saveDonationFee() {
  //   // Save DonationFee
  //   let donationFee = this.formDonationFee.value;
  //   this._donationFeeService.saveDonationFee(donationFee).subscribe(
	// 		response => {
  //       if(response.admissionFee) {
  //         this.formDonationFee.reset();
  //         this.getDonationFees();       
  //       } else {
  //         console.log("Error saved Data");
  //       }
	// 		},
	// 		error => {
	// 			console.log(<any>error);
	// 		}
	// 	)
  // }

  // /**
  //  * Metodo que permite obtener las familias que deben 
  //  * pagar el Donation Fee
  //  */
  // public getFamiliasPayDonationFee(): void {
  //   this._familyService.getFamiliasPayDonationFee().subscribe(
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
}
