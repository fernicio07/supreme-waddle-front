import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(
    private http: HttpClient
  ) { }

  getReportStudentsForGrade(listStudents: any): Observable<any> {
		let params = JSON.stringify(listStudents);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'getReportStudentsForGrade', params, { headers: headers });
  }

  getReportTotalesAnio(listTotalesAnio: any): Observable<any> {
		let params = JSON.stringify(listTotalesAnio);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'getReportTotalesAnio', params, { headers: headers });
  }

  getReportTotalesPeriodo(listTotalesPeriodo: any): Observable<any> {
		let params = JSON.stringify(listTotalesPeriodo);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'getReportTotalesPeriodo', params, { headers: headers });
  }

  getReportDonativos(listDonativos: any): Observable<any> {
		let params = JSON.stringify(listDonativos);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'getReportDonativos', params, { headers: headers });
  }

  getReportDeposito(deposito: any): Observable<any> {
		let params = JSON.stringify(deposito);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'getReportDeposito', params, { headers: headers });
  }

}
