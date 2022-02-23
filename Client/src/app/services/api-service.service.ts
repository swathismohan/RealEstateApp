import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Customer } from '../models/customer';
import { Buyer } from '../models/buyer';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private httpClient: HttpClient) { }

  getToken(): Observable<any>{
      return this.httpClient.post(
        "http://localhost:3000/",
        null
     ).pipe(map((res:any) => res['access_token']));
  }

  postCustomer(customer:Customer): Observable<any> {
      const url="http://localhost:3000/customer/api";
    return this.httpClient.post<any>(url, customer, {
        headers: {
          'Content-Type': 'application/json' }
      })
      .pipe(map((response) => response));
}

postBuyer(buyer:Buyer): Observable<any> {
  const url="http://localhost:3000/buyer/api";
return this.httpClient.post<any>(url, buyer, {
    headers: {
      'Content-Type': 'application/json' }
  })
  .pipe(map((response) => response));
}

}