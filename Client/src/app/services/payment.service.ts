import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Payment } from '../models/payment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private httpClient: HttpClient) { }

  postPaymentInfo(newPayment: Payment){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.httpClient.post(
       "http://localhost:3000/payment/info",
       newPayment,
       httpOptions
    ).pipe(map((res:any) => res.json()));
  }

  verifyPaymentInfo(transactionId: string){
    const url = "http://localhost:3000/payment/status/verify";
    let body = {"transactionId" : transactionId};
    return this.httpClient.put(
      url,
      body
   ).pipe(map((res:any) => res.json()));
  }

  getPendingPayments(){
    return this.httpClient.get<any>("http://localhost:3000/payments/status/pending");
  }
  
}
