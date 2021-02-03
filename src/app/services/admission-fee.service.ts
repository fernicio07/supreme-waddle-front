import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdmissionFeeService {

  constructor(
		private http: HttpClient
  ) { }

  updateAdmissionFee(admissionFee: any): Observable<any> {
		let params = JSON.stringify(admissionFee);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.put(environment.apiBaseUrl + 'updateAdmissionFee/' + admissionFee._id, params, {headers: headers});
	}

  getAdmissionFees(): Observable<any> {
		return this.http.get<any>(environment.apiBaseUrl + 'admissionFees');
	}

	saveAdmissionFee(admissionFee: any): Observable<any> {
		let params = JSON.stringify(admissionFee);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'save-admissionFee', params, { headers: headers });
  }
  
  agregarCantidadEstudiantes(): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + 'agregarCantidadEstudiantes');
  }

  agregarCantidadFamilias(): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + 'agregarCantidadFamilias');
  }
}
