import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private httpClient: HttpClient) { }

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

}
