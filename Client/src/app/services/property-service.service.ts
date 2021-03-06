import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Property } from '../models/property';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyServiceService {

  constructor(private httpClient: HttpClient) { }

  getProperty(): Observable<any>{
    return this.httpClient.get<any>("http://localhost:3000/properties");
  }

  getPropertyByCustomerId(customerId: string){
    return this.httpClient.get<any>("http://localhost:3000/properties/"+ customerId);
  }

  getPropertyById(propertyId: string){
    return this.httpClient.get<any>("http://localhost:3000/property/"+ propertyId);
  }

  getAvailableProperty(){
    return this.httpClient.get<any>("http://localhost:3000/properties/available");
  }

  getAvailableVerifiedProperty(){
    return this.httpClient.get<any>("http://localhost:3000/availableverifiedproperties");
  }

  getVerifyRequestedProperty(){
    return this.httpClient.get<any>("http://localhost:3000/properties/requested");
  }

  addProperty(newProperty: Property){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.httpClient.post(
       "http://localhost:3000/property",
       newProperty,
       httpOptions
    ).pipe(map((res:any) => res.json()));
  }

  updateProperty(propertyId: string, status: string){
    const url = "http://localhost:3000/property/" + propertyId + "/status/" + status;
    return this.httpClient.put(
      url,
      null
   ).pipe(map((res:any) => res.json()));
  }

  editPropertyDetails(property: Property){
    const url = "http://localhost:3000/updateproperty/" + property.propertyId;
    return this.httpClient.put(
      url,
      property
   ).pipe(map((res:any) => res.json()));
  }

  propertyVerify(propertyId: string, verification: string){
    const url = "http://localhost:3000/property/" + propertyId + "/verification/" + verification;
    return this.httpClient.put(
      url,
      null
   ).pipe(map((res:any) => res.json()));

  }

  propertyVerified(propertyId: string, verification: string, comment: string){
    const url = "http://localhost:3000/property/" + propertyId + "/verified";
    let body = {"verification": verification,
                "comment": comment};
    return this.httpClient.put(
      url,
      body
   ).pipe(map((res:any) => res.json()));

  }

}
