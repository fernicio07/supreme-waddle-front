import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-mom',
  templateUrl: './mom.component.html'
})
export class MomComponent implements OnInit {

  @Input() submitted: boolean;

  public familyMomForm: FormGroup;
  public mostrarAnioEstudio: boolean = false;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.familyMomForm = this.formBuilder.group({
      nameMom: [null],
			//middleNameMom: [null, Validators.required],
			lastNameMom: [null],
			//maidenNameMom: [null, Validators.required],
			occupationMom: [null],
			companyMom: [null],
			// physicalAddressMom: [null, Validators.required],
			// mailingAddressMom: [null, Validators.required],
			homePhoneMom: [null],
			workPhoneMom: [null],
			mobilePhoneMom: [null],
			emailMom: [null],
			hobbyMom: [null],
			exAlumnaMom: [null],
			yearStudyMom: [null]
    });
    this.f.exAlumnaMom.setValue(false);
  }

  get f() {
		return this.familyMomForm.controls;
  }

  public modelExAlumna(event: any) {
    if(event) {
      this.mostrarAnioEstudio = true;
      this.f.yearStudyMom.setValidators([Validators.required])
    } else {
      this.f.yearStudyMom.setValue(null);
      this.f.yearStudyMom.clearValidators();
      this.mostrarAnioEstudio = false;
    }
    this.f.yearStudyMom.updateValueAndValidity();
  }

}
