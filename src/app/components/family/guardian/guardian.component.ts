import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-guardian',
  templateUrl: './guardian.component.html'
})
export class GuardianComponent implements OnInit {

  @Input() submitted: boolean;
  public familyGuardianForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.familyGuardianForm = this.formBuilder.group({
      nameGuardian: [null],
			// middleNameGuardian: [null],
			lastNameGuardian: [null],
			//maidenNameGuardian: [null],
			occupationGuardian: [null],
			companyGuardian: [null],
			// physicalAddressGuardian: [null],
			// mailingAddressGuardian: [null],
			homePhoneGuardian: [null],
			workPhoneGuardian: [null],
			mobilePhoneGuardian: [null],
			emailGuardian: [null],
			hobbyGuardian: [null]
    })
  }

  get f() {
		return this.familyGuardianForm.controls;
  }
}
