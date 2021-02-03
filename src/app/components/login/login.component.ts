import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public loginUserData: any;
  public messageError: string;

  constructor(
    private _auth: AuthService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.loginUserData = {};
    if(this._auth.isLoggedIn()) {
      this._router.navigate(['/dashboard', { outlets: { 'procesoDashboard': ['dashboard'] } }]);
    }
  }

  loginUser() {
    console.log(this.loginUserData);
    this._auth.login(this.loginUserData).subscribe(
      res => {
        this._auth.setToken(res['token']);
        this._router.navigate(['/dashboard', { outlets: { 'procesoDashboard': ['dashboard'] } }]);
      },
      err => {
        this.messageError = err.error.message;
      }
    )
  }

}
