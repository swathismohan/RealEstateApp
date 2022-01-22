import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Bid } from '../models/bid';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BidServiceService {

  constructor(private httpClient: HttpClient) { }

  getBidByBuyer(buyerId: string){
    return this.httpClient.get<any>("http://localhost:3000/bids/"+ buyerId);
  }

  addBid(newBid: Bid){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.httpClient.post(
       "http://localhost:3000/bid",
       newBid,
       httpOptions
    ).pipe(map((res:any) => res.json()));
  }

}
