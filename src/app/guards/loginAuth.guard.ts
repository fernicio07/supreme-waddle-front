import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(){
    if(localStorage.getItem('token') == null) {
      // Login TRUE;
      return true;
    } else {
      this.router.navigate(['/dashboard', { outlets: { 'procesoDashboard': ['dashboard'] } }]);
      return false;
    }
  }
  
}
