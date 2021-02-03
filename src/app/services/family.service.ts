import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {

  constructor(
    private http: HttpClient
  ) { }

  getFamilyFromCuenta(code): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.get(environment.apiBaseUrl + 'getFamilyFromCuenta/' + code, {headers: headers});
  }

  getFamily(code): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.get(environment.apiBaseUrl + 'family/' + code, {headers: headers});
  }

  validateFamily(code): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.get(environment.apiBaseUrl + 'validateFamily/' + code, {headers: headers});
  }

  getNameParents(code): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.get(environment.apiBaseUrl + 'getNameParents/' + code, {headers: headers});
  }
  
  updateFamily(family: any): Observable<any> {
    let params = JSON.stringify(family);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.put(environment.apiBaseUrl + 'updateFamily/' + family._id, params, {headers: headers});
  }

  deleteFamily(id: any): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.delete(environment.apiBaseUrl + 'deleteFamily/' + id, {headers: headers});
	}

  getFamilies(): Observable<any> {
		return this.http.get<any>(environment.apiBaseUrl + 'getFamilies');
  }
  
  getFamiliesForTable(): Observable<any> {
		return this.http.get<any>(environment.apiBaseUrl + 'getFamiliesForTable');
	}

  saveFamily(familyForm: any): Observable<any> {
		let params = JSON.stringify(familyForm);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'saveFamily', params, { headers: headers });
  }

  getCodesFamily(): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + 'getCodesFamily');
  }

  getFamiliasPayDonationFee(): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + 'getFamiliasPayDonationFee');
  }

  crearRecargoFamily(): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + 'crearRecargoFamily');
  }

  familiasActivasSinEstudiantesDeBaja(): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + 'familiasActivasSinEstudiantesDeBaja');
  }

  getTotalFamilias(): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + 'getTotalFamilias');
  }
}
