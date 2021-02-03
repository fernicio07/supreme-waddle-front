import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  constructor(
		private http: HttpClient
  ) { }

	savePago(pago: any): Observable<any> {
		let params = JSON.stringify(pago);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'save-pago', params, { headers: headers });
  }

  getPagos(): Observable<any> {
		return this.http.get<any>(environment.apiBaseUrl + 'getPagos');
  }
  
  getPagosByTipoPago(code): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.get(environment.apiBaseUrl + 'getPagosByTipoPago/' + code, {headers: headers});
  }
  
  updatePago(pago: any): Observable<any> {
		let params = JSON.stringify(pago);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.put(environment.apiBaseUrl + 'update-pago/' + pago._id, params, {headers: headers});
  }

  deletePago(id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.delete(environment.apiBaseUrl + 'pago/'+id, {headers: headers});
  }
}