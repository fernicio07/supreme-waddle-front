import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MDBModalRef } from "angular-bootstrap-md";
import { Subject } from "rxjs";

@Component({
  selector: 'app-start-anio',
  templateUrl: './start-anio.component.html'
})
export class StartAnioComponent implements OnInit {

  public password: any;
  public messageError: any;
  public infoUsername: any;
  public saveButtonClicked: Subject<any> = new Subject<any>();

  constructor(
    public modalRef: MDBModalRef,
    private _auth: AuthService,
  ) { }

  ngOnInit(): void {
    this._auth.getUserProfile().subscribe(
      response => {
        this.infoUsername = response['user'];
      },
      error => { }
    )
  }

  guardar() {
    this.infoUsername.password = this.password;
    this._auth.validatePassword(this.infoUsername).subscribe(
      response => {
        if(response.status) {
          this.saveButtonClicked.next(response.status);
          this.modalRef.hide();
        }
      },
      error => {
        this.messageError = error.error.message;
      }
    )
  }

}
