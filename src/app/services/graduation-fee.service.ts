import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GraduationFeeService {

  constructor(
		private http: HttpClient
  ) { }

  updateGraduationFee(graduationFee: any): Observable<any> {
		let params = JSON.stringify(graduationFee);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.put(environment.apiBaseUrl + 'updateGraduationFee/' + graduationFee._id, params, {headers: headers});
	}

  getGraduationFees(): Observable<any> {
		return this.http.get<any>(environment.apiBaseUrl + 'graduationFees');
	}

	saveGraduationFee(graduationFee: any): Observable<any> {
		let params = JSON.stringify(graduationFee);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'save-graduationFee', params, { headers: headers });
	}
}
