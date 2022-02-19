import { Component, OnInit } from '@angular/core';
import { Property } from '../models/property';
import { PropertyServiceService } from '../services/property-service.service';
import { NotificationService } from '../services/notification.service';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
  providers: [ PropertyServiceService, NotificationService, CustomeronboardingServiceService ],
})
export class AdminPageComponent implements OnInit {

  property!: Property;
  properties: Property[] = [];
  comment!: string;
  email!: string;

  constructor( private propertyService:PropertyServiceService, private notificationService: NotificationService, private customeronboardingService: CustomeronboardingServiceService) { }

  propertyVerified(property: Property, verification: string){
    this.propertyService.propertyVerified(property.propertyId, verification,this.comment)
    .subscribe((response: Property) =>{
      this.property = response;
    });
    this.customeronboardingService.getCustomerById(property.customerId)
    .subscribe((response: Customer) =>{
      this.email = response.emailAddresses[0].address;
      this.notificationService.propertyVerifiedEmail(property.propertyName, this.email)
        .subscribe((response: any) =>{
      });
    });
  }

  ngOnInit(): void {
    this.propertyService.getVerifyRequestedProperty()
      .subscribe((response:Property[]) => {
        this.properties = response;
    });
  }

}
