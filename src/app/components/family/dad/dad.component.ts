import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dad',
  templateUrl: './dad.component.html'
})
export class DadComponent implements OnInit {

  @Input() submitted: boolean;

  public familyDadForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.familyDadForm = this.formBuilder.group({
      nameDad: [null],
			//middleNameDad: [null, Validators.required],
			lastNameDad: [null],
			//maidenNameDad: [null, Validators.required],
			occupationDad: [null],
			companyDad: [null],
			// physicalAddressDad: [null, Validators.required],
			// mailingAddressDad: [null, Validators.required],
			homePhoneDad: [null],
			workPhoneDad: [null],
			mobilePhoneDad: [null],
			emailDad: [null],
			hobbyDad: [null]
    })
  }

  get f() {
		return this.familyDadForm.controls;
  }
}
