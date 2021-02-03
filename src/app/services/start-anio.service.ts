import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StartAnioService {

  constructor(
		private http: HttpClient
  ) { }

	saveStartAnio(startAnio: any): Observable<any> {
		let params = JSON.stringify(startAnio);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'saveStartAnio', params, { headers: headers });
  }
  
  getStartAnios(): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + 'getStartAnios');
  }

  startAnio(): Observable<any> {
		return this.http.get<any>(environment.apiBaseUrl + 'startAnio');
	}
}
