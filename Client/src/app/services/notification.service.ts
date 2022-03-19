import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private httpClient: HttpClient) { }

  welcomeEmail(username: string, email: string){
    const url = "http://localhost:3000/sendmail";
    let body = {"to": email,
                "subject": "Welcome to ESTATE AIDE",
                "text": "Hi "+username+", \n\nYour user registration has been successfully completed. Please login to ESTATE AIDE to use our services. \nENJOY:) \n\nRegards, \nTeam Estate Aide" };
    return this.httpClient.post(
      url,
      body
   ).pipe(map((res:any) => res.json()));
  }


  propertyVerifiedEmail(propertyName: string, email: string){
    const url = "http://localhost:3000/sendmail";
    let body = {"to": email,
                "subject": "Property Verification Done",
                "text": "Hi, \n\nVerification of your property "+ propertyName+ " has been completed by ESTATE AIDE. Please login to see the details. \n\nRegards, \nTeam Estate Aide" };
    return this.httpClient.post(
      url,
      body
   ).pipe(map((res:any) => res.json()));
  }

  bidAcceptanceEmail(propertyName: string, email: string, status: string){
    const url = "http://localhost:3000/sendmail";
    let body = {"to": email,
                "subject": "Bid Status Changed",
                "text": "Hi, \n\nYour bid for property "+ propertyName+ " has been "+ status +" by the seller. Please login to see the details. \n\nRegards, \nTeam Estate Aide" };
    return this.httpClient.post(
      url,
      body
   ).pipe(map((res:any) => res.json()));
  }

}
