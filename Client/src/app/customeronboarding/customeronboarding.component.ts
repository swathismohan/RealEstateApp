import { Component, OnInit } from '@angular/core';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { Customer } from '../models/customer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customeronboarding',
  templateUrl: './customeronboarding.component.html',
  styleUrls: ['./customeronboarding.component.scss'],
  providers: [CustomeronboardingServiceService],
})
export class CustomeronboardingComponent implements OnInit {

  customers: Customer[] = [];
  customer!: Customer;
  firstName!: string;
  lastName!: string;
  countryOfResidency!: string;
  addline1!: string;
  addline2!: string;
  addline3!: string;
  addline4!: string;
  postalCode!: string;
  buildingNumber!: string;
  phoneNumber!: string;
  emailAddress!: string;

  constructor(private customeronboardingService : CustomeronboardingServiceService, private router: Router) { }

  addCustomer(){
    const newCustomer = {
      firstName: this.firstName,
      lastName: this.lastName,
      countryOfResidency: this.countryOfResidency,
      addline1: this.addline1,
      addline2: this.addline2,
      addline3: this.addline3,
      addline4: this.addline4,
      postalCode: this.postalCode,
      buildingNumber: this.buildingNumber,
      phoneNumber: this.phoneNumber,
      emailAddress: this.emailAddress
    }
    this.customeronboardingService.addCustomer(newCustomer)
      .subscribe((customer: any) =>{
        this.customers.push(customer);
      });
  }

  onSubmit() {
    this.router.navigateByUrl('/customerprofile');
  }

  ngOnInit() {
    this.customeronboardingService.getCustomer()
      .subscribe( customers =>
        this.customers = customers);
  }

}
