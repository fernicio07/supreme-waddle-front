import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  public infoUsername: any;

  constructor(
    public _authService: AuthService,
    private _router: Router
    ) { }

  ngOnInit(): void {
    this._authService.getUserProfile().subscribe(
      response => {
        this.infoUsername = response['user'];
      },
      error => {

      }
    )
    // this.infoUsername = localStorage.getItem('user');
  }

  onLogout() {
    this._authService.deleteToken();
    this._router.navigate(['/login'])
  }
}
