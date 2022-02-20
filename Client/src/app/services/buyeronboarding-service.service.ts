import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DBBuyer, Buyer } from '../models/buyer';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BuyeronboardingServiceService {

  constructor(private httpClient: HttpClient ) { }

  getBuyer(){
    return this.httpClient.get<any>('https://localhost:3000/buyers');
  }

  getBuyerById(buyerId: string){
    return this.httpClient.get<any>("http://localhost:3000/buyer/"+ buyerId);
  }

  getBuyerByUserName(userName: string, password: string){
    const url = "http://localhost:3000/buyer/user/"+ userName+ "/password/" + password;
    return this.httpClient.get<any>(url);
  }

  getLegalSubscription(buyerId: string){
    const url = "http://localhost:3000/buyer/" + buyerId + "/getlegalsubscription";
    return this.httpClient.put(
      url,
      null
   ).pipe(map((res:any) => res.json()));
  }


  addBuyer(newBuyer: DBBuyer){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.httpClient.post(
       "http://localhost:3000/buyer",
       newBuyer,
       httpOptions
    ).pipe(map((res:any) => res.json()));
  }

}
