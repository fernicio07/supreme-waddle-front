
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepositoService {

  constructor(
		private http: HttpClient
  ) { }

	saveDeposito(deposito: any): Observable<any> {
		let params = JSON.stringify(deposito);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'save-deposito', params, { headers: headers });
  }
  
  getDepositos(): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + 'getDepositos');
  }

  deleteDeposito(id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.delete(environment.apiBaseUrl + 'deposito/'+id, {headers: headers});
  }
  
  getDeposito(id): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.get(environment.apiBaseUrl + 'deposito/' + id, {headers: headers});
  }

  eliminarPagoFromDeposito(deposito: any): Observable<any> {
    let params = JSON.stringify(deposito);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'eliminarPagoFromDeposito', params, { headers: headers });
  }

  updateDeposito(deposito: any): Observable<any> {
		let params = JSON.stringify(deposito);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.put(environment.apiBaseUrl + 'updateDeposito/' + deposito._id, params, {headers: headers});
  }
}
