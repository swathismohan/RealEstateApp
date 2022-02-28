import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DBCustomer ,Customer } from '../models/customer';
import { map } from 'rxjs/operators';

@Injectable()

export class CustomeronboardingServiceService {

  constructor(private httpClient: HttpClient) { }

  getCustomer(){
    return this.httpClient.get<any>("http://localhost:3000/customers");
  }

  getCustomerById(customerId: string){
    return this.httpClient.get<any>("http://localhost:3000/customer/"+ customerId);
  }

  getCustomerByUserName(userName: string, password: string){
    const url = "http://localhost:3000/customer/user/"+ userName+ "/password/" + password;
    return this.httpClient.get<any>(url);
  }

  getCustomerByUserIdFromFFDC(userid: string){
    const url = "http://localhost:3000/user/"+ userid;
    return this.httpClient.get<any>(url);
  }

  getLegalSubscription(customerId: string){
    const url = "http://localhost:3000/customer/" + customerId + "/getlegalsubscription";
    return this.httpClient.put(
      url,
      null
   ).pipe(map((res:any) => res.json()));
  }

  addCustomer(newCustomer: DBCustomer){
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
