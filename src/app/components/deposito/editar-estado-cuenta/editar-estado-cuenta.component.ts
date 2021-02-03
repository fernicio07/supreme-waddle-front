import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from "angular-bootstrap-md";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";

@Component({
  selector: 'app-editar-estado-cuenta',
  templateUrl: './editar-estado-cuenta.component.html'
})
export class EditarEstadoCuentaComponent implements OnInit {

  // public editableRow: { 
  //   instruccion: string, 
  //   donativo: string,
  //   cuido: string,
  //   matricula: string,
  //   seguro: string,
  //   seguridad: string,
  //   tecnologia: string,
  //   mantenimiento: string,
  //   anuario: boolean
  // };

  public editableRow: { 
    montoTotalMensualidadGradoStudentsPagado: number, 
    montoTotalMensualidadDonativoPagado: number,
    montoTotalCuidoPagado: number,
    montoTotalMatriculaStudentsPagado: number,
    montoTotalSeguroStudentsPagado: number,
    montoSecurityFeePagado: number,
    montoTechnologyFeePagado: number,
    montoMaintenanceFeePagado: number,
    montoYearbookPagado: number,
    montoGraduationFeePagado: number,
    _id: string
  };

  public saveButtonClicked: Subject<any> = new Subject<any>();

  public form: FormGroup = new FormGroup({
    instruccion: new FormControl('', Validators.required),
    donativo: new FormControl('', Validators.required),
    cuido: new FormControl('', Validators.required),
    matricula: new FormControl('', Validators.required),
    seguro: new FormControl('', Validators.required),
    seguridad: new FormControl('', Validators.required),
    tecnologia: new FormControl('', Validators.required),
    mantenimiento: new FormControl('', Validators.required),
    anuario: new FormControl('', Validators.required),
    graduacion: new FormControl('', Validators.required),
    _id: new FormControl('')
  });

  constructor(public modalRef: MDBModalRef) { }

  ngOnInit(): void {
    this.form.controls['instruccion'].patchValue(this.editableRow.montoTotalMensualidadGradoStudentsPagado);
    this.form.controls['donativo'].patchValue(this.editableRow.montoTotalMensualidadDonativoPagado);
    this.form.controls['cuido'].patchValue(this.editableRow.montoTotalCuidoPagado);
    this.form.controls['matricula'].patchValue(this.editableRow.montoTotalMatriculaStudentsPagado);
    this.form.controls['seguro'].patchValue(this.editableRow.montoTotalSeguroStudentsPagado);
    this.form.controls['seguridad'].patchValue(this.editableRow.montoSecurityFeePagado);
    this.form.controls['tecnologia'].patchValue(this.editableRow.montoTechnologyFeePagado);
    this.form.controls['mantenimiento'].patchValue(this.editableRow.montoMaintenanceFeePagado);
    this.form.controls['anuario'].patchValue(this.editableRow.montoYearbookPagado);
    this.form.controls['graduacion'].patchValue(this.editableRow.montoGraduationFeePagado);
    this.form.controls['_id'].patchValue(this.editableRow._id);
    
  }

  editRow() {
    this.editableRow = this.form.getRawValue();
    for (const key in this.editableRow) {
      if(key != '_id'){
        this.editableRow[key] = +this.editableRow[key];
      }      
    }
    this.saveButtonClicked.next(this.editableRow);
    this.modalRef.hide();
  }

  get instruccion() { return this.form.get('instruccion'); }
  get donativo() { return this.form.get('donativo'); }
  get cuido() { return this.form.get('cuido'); }
  get matricula() { return this.form.get('matricula'); }
  get seguro() { return this.form.get('seguro'); }
  get seguridad() { return this.form.get('seguridad'); }
  get tecnologia() { return this.form.get('tecnologia'); }
  get mantenimiento() { return this.form.get('mantenimiento'); }
  get anuario() { return this.form.get('anuario'); }
  get graduacion() { return this.form.get('graduacion'); }
  
}
