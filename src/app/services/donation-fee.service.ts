import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonationFeeService {

  constructor(
		private http: HttpClient
  ) { }

  updateDonationFee(donationFee: any): Observable<any> {
		let params = JSON.stringify(donationFee);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this.http.put(environment.apiBaseUrl + 'updateDonationFee/' + donationFee._id, params, {headers: headers});
	}

  getDonationFees(): Observable<any> {
		return this.http.get<any>(environment.apiBaseUrl + 'donationFees');
	}

	saveDonationFee(donationFee: any): Observable<any> {
		let params = JSON.stringify(donationFee);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this.http.post(environment.apiBaseUrl + 'save-donationFee', params, { headers: headers });
	}
}
