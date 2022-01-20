import { Component, OnInit } from '@angular/core';
import { Property } from '../models/property';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { Customer } from '../models/customer';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-customerprofile',
  templateUrl: './customerprofile.component.html',
  styleUrls: ['./customerprofile.component.scss'],
  providers: [CustomeronboardingServiceService],
})
export class CustomerprofileComponent implements OnInit {

  properties: Property[] = [];
  property!: Property;
  customerId!: string;
  propertyId!: string;
  propertyNumber!: string;
  addline1!: string;
  addline2!: string;
  addline3!: string;
  addline4!: string;
  postalCode!: string;
  marketValue!: number;
  contactDetails!: string;
  status!: boolean;
  greenBelt!: boolean;

  public customer!: Customer;
  constructor(private customeronboardingService : CustomeronboardingServiceService, private router: Router, private activatedroute: ActivatedRoute) { }


  ngOnInit() {
    this.customerId = this.activatedroute.snapshot.params['customerId'];
    this.customeronboardingService.getCustomerById(this.customerId)
      .subscribe((response: Customer) =>{
        this.customer = response;
      });
  }
}
