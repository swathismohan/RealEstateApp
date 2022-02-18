import { Component, OnInit } from '@angular/core';
import { Property } from '../models/property';
import { PropertyServiceService } from '../services/property-service.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
  providers: [ PropertyServiceService ],
})
export class AdminPageComponent implements OnInit {

  property!: Property;
  properties: Property[] = [];

  constructor( private propertyService:PropertyServiceService ) { }

  requestVerification(propertyId: string, verification: string){
    this.propertyService.propertyVerify(propertyId, verification)
    .subscribe((response: Property) =>{
      this.property = response;
    });
  }

  ngOnInit(): void {
    this.propertyService.getVerifyRequestedProperty()
      .subscribe((response:Property[]) => {
        this.properties = response;
    });
  }

}
