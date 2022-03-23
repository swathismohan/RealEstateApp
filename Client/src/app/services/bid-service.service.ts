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
    return this.httpClient.get<any>("http://localhost:3000/bids/active/"+ buyerId);
  }

  getAllBidByBuyer(buyerId: string){
    return this.httpClient.get<any>("http://localhost:3000/bids/"+ buyerId);
  }

  getAllBidsByPropertyId(propertyId: string){
    return this.httpClient.get<any>("http://localhost:3000/bids/allproperty/"+ propertyId);
  }

  getBidsByPropertyId(propertyId: string){
    return this.httpClient.get<any>("http://localhost:3000/bids/property/"+ propertyId);
  }

  getAcceptedBids(propertyId: string){
    return this.httpClient.get<any>("http://localhost:3000/bids/accepted/"+ propertyId);
  }

  getDeclinedBids(propertyId: string){
    return this.httpClient.get<any>("http://localhost:3000/bids/declined/"+ propertyId);
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

  updateBid(bidId: string, status: string){
    const url = "http://localhost:3000/bid/" + bidId + "/status/" + status;
    return this.httpClient.put(
      url,
      null
   ).pipe(map((res:any) => res.json()));

  }

}
