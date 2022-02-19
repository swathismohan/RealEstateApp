import { Component, OnInit } from '@angular/core';
import { Property } from '../models/property';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { PropertyServiceService } from '../services/property-service.service';
import { Customer } from '../models/customer';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-customerprofile',
  templateUrl: './customerprofile.component.html',
  styleUrls: ['./customerprofile.component.scss'],
  providers: [CustomeronboardingServiceService, PropertyServiceService],
})
export class CustomerprofileComponent implements OnInit {

  properties: Property[] = [];
  property!: Property;
  customerId!: string;
  propertyId!: string;
  propertyName!: string;
  propertyNumber!: string;
  addline1!: string;
  addline2!: string;
  addline3!: string;
  addline4!: string;
  postalCode!: string;
  marketValue!: number;
  contactDetails!: string;
  status!: string;
  greenBelt!: string;
  id!: string;
  propertyAdded!: boolean;

  public customer!: Customer;
  constructor(private customeronboardingService : CustomeronboardingServiceService, private router: Router, private activatedroute: ActivatedRoute, private propertyService: PropertyServiceService) { }

  addProperty(){
    this.id = uuid();
    const newProperty = {
      propertyId: this.id,
      customerId: this.customerId,
      propertyName: this.propertyName,
      propertyNumber: this.propertyNumber,
      addline1: this.addline1,
      addline2: this.addline2,
      addline3: this.addline3,
      addline4: this.addline4,
      postalCode: this.postalCode,
      marketValue: this.marketValue,
      contactDetails: this.contactDetails,
      status: "AVAILABLE",
      greenBelt: this.greenBelt,
      verification: "NOT REQUESTED",
      comment: ""
    }
    this.propertyService.addProperty(newProperty)
      .subscribe((property: any) =>{
        this.properties.push(property);
      });
    this.propertyAdded = true;
  }

  getPropertyByCustomerId(){
    this.propertyService.getPropertyByCustomerId(this.customerId)
      .subscribe((response: Property[]) =>{
        this.properties = response;
      });
    console.log('property', this.properties);
  }

  gotoPropertyBids(propertyId: string){
    this.router.navigateByUrl('/property/' + propertyId +'/bids');
  }

  requestVerification(propertyId: string, verification: string){
      this.propertyService.propertyVerify(propertyId, verification)
      .subscribe((response: Property) =>{
        this.property = response;
      });
  }

  ngOnInit() {
    this.customerId = this.activatedroute.snapshot.params['customerId'];
    this.customeronboardingService.getCustomerById(this.customerId)
      .subscribe((response: Customer) =>{
        this.customer = response;
      });
    this.getPropertyByCustomerId();
    this.propertyAdded = false;
  }
}
