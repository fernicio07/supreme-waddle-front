import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class PriceGradeService {

	constructor(
		private http: HttpClient
	) { }

	updateGrado(grado: any): Observable<any> {
		let params = JSON.stringify(grado);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.put(environment.apiBaseUrl + 'updatePriceGrade/' + grado._id, params, {headers: headers});
	}

	getPriceGrades(): Observable<any> {
		return this.http.get<any>(environment.apiBaseUrl + 'priceGrades');
	}

	savePriceGrade(project: any): Observable<any> {
		let params = JSON.stringify(project);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'save-priceGrade', params, { headers: headers });
	}

	getTotalesAnio(): Observable<any> {
		return this.http.get<any>(environment.apiBaseUrl + 'getTotalesAnio');
	}

	getTotalesPeriodo(dates: any): Observable<any> {
		let params = JSON.stringify(dates);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'getTotalesPeriodo', params, { headers: headers });
	}

	getDonativosAnualFuturo(): Observable<any> {
		return this.http.get<any>(environment.apiBaseUrl + 'getDonativoAnualFuturo');
	}
}
