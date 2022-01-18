import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Customer } from '../models/customer';
import { map } from 'rxjs/operators';

@Injectable()

export class CustomeronboardingServiceService {

  constructor(private httpClient: HttpClient) { }

  getCustomer(){
    return this.httpClient.get<any>('https://localhost:3000/customers')
    .pipe(map((res:any) => res.json()));
  }

  addCustomer(newCustomer: Customer){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.httpClient.post(
       "http://localhost:3000/customer",
       newCustomer,
       httpOptions
    ).pipe(map((res:any) => res.json()));
  }
}
