import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuentaFamilyService {

  constructor(
    private http: HttpClient
  ) { }

  updateEstadoCuentaFamily(family: any): Observable<any> {
		let params = JSON.stringify(family);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.put(environment.apiBaseUrl + 'updateEstadoCuentaFamily/' + family.estadoCuenta[0]._id, params, {headers: headers});
  }

  // getEstadosCuentasForFamily(code): Observable<any> {
	// 	let headers = new HttpHeaders().set('Content-Type','application/json');

	// 	return this.http.get(environment.apiBaseUrl + 'getEstadosCuentasForFamily/' + code, {headers: headers});
  // }
  
  updateEstadoCuentaFromDeposito(estadoCuenta: any): Observable<any> {
		let params = JSON.stringify(estadoCuenta);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.put(environment.apiBaseUrl + 'updateEstadoCuentaFromDeposito/' + estadoCuenta._id, params, {headers: headers});
  }

  addGraduacionEstadoCuenta(): Observable<any> {
		return this.http.get<any>(environment.apiBaseUrl + 'addGraduacionEstadoCuenta');
  }
}
