import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from "angular-bootstrap-md";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";

@Component({
  selector: 'app-editar-graduation-fee',
  templateUrl: './editar-graduation-fee.component.html'
})
export class EditarGraduationFeeComponent implements OnInit {

  public editableRow: { 
    name: string, 
    cost: string
  };
  
  public saveButtonClicked: Subject<any> = new Subject<any>();

  public form: FormGroup = new FormGroup({
    name: new FormControl({value: '', disabled: true}),
    cost: new FormControl('', Validators.required),
  });

  constructor(public modalRef: MDBModalRef) { }

  ngOnInit(): void {
    this.form.controls['name'].patchValue(this.editableRow.name);
    this.form.controls['cost'].patchValue(this.editableRow.cost);
  }

  editRow() {
    this.editableRow = this.form.getRawValue();
    this.saveButtonClicked.next(this.editableRow);
    this.modalRef.hide();
  }

  get cost() { return this.form.get('cost'); }

}
