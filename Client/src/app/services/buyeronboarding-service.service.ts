import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Buyer } from '../models/buyer';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuyeronboardingServiceService {

  constructor(private httpClient: HttpClient ) { }

  getBuyer(){
    return this.httpClient.get<any>('https://localhost:3000/buyers')
    .pipe(map((res:any) => res.json()));
  }

  addBuyer(newBuyer: Buyer): Observable<any>{
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
