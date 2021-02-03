import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private http: HttpClient
  ) { }

  saveStudent(student: any): Observable<any> {
    let params = JSON.stringify(student);
    let headers = new HttpHeaders().set('Content-Type','application/json');

    return this.http.post(environment.apiBaseUrl + 'save-student', params, {headers: headers});
  }

  getStudentsByFilterGrade(): Observable<any> {
		return this.http.get<any>(environment.apiBaseUrl + 'getStudentsByFilterGrade');
  }
  
  getStudents(): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + 'getStudents');
  }

  getStudentsInactivos(): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + 'getStudentsInactivos');
  }

  getStudentsForGrade(id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.get(environment.apiBaseUrl + 'getStudentsForGrade/' + id, {headers: headers});
  }

  getTotalesAño(): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + 'getTotalesAnio');
  }

  updateStudent(student: any): Observable<any> {
		let params = JSON.stringify(student);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.put(environment.apiBaseUrl + 'updateStudent/' + student._id, params, {headers: headers});
  }
  
  deleteStudent(id: any): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.delete(environment.apiBaseUrl + 'deleteStudent/' + id, {headers: headers});
  }

  inactivarStudent(student: any): Observable<any> {
		let params = JSON.stringify(student);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.put(environment.apiBaseUrl + 'inactivarStudent/' + student._id, params, {headers: headers});
  }

  getLastNameStudents(): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + 'getLastNameStudents');
  }
}
