import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DBCustomer } from '../models/customer';
import { DBBuyer } from '../models/buyer';
import { Property } from '../models/property';
import { Bid } from '../models/bid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeactivationService {

  constructor(private httpClient: HttpClient) { }

  activateCustomer(customerId: string, active: boolean){
    const url = "http://localhost:3000/activate/customer/";
    let body = {
      "customerId": customerId,
      "active": active
    };
    return this.httpClient.put(
      url,
      body
   ).pipe(map((res:any) => res.json()));
  }

  activateBuyer(buyerId: string, active: boolean){
    const url = "http://localhost:3000/activate/buyer/";
    let body = {
      "buyerId": buyerId,
      "active": active
    };
    return this.httpClient.put(
      url,
      body
   ).pipe(map((res:any) => res.json()));
  }

  activateProperty(propertyId: string, active: boolean){
    const url = "http://localhost:3000/activate/property/";
    let body = {
      "propertyId": propertyId,
      "active": active
    };
    return this.httpClient.put(
      url,
      body
   ).pipe(map((res:any) => res.json()));
  }

  activateBid(bidId: string, active: boolean){
    const url = "http://localhost:3000/activate/bid/";
    let body = {
      "bidId": bidId,
      "active": active
    };
    return this.httpClient.put(
      url,
      body
   ).pipe(map((res:any) => res.json()));
  }

}
