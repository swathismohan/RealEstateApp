import { Component, OnInit } from '@angular/core';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { Customer } from '../models/customer';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-customeronboarding',
  templateUrl: './customeronboarding.component.html',
  styleUrls: ['./customeronboarding.component.scss'],
  providers: [CustomeronboardingServiceService],
})
export class CustomeronboardingComponent implements OnInit {

  dbuser!: any;
  customers: Customer[] = [];
  customer!: Customer;
  userName!: string;
  password!: string;
  customerId!: string;
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
  id!: string;

  constructor(private customeronboardingService : CustomeronboardingServiceService, private router: Router) { }

  addCustomer(){
    this.id = uuid();
    const newCustomer = {
      userName: this.userName,
      password: this.password,
      customerId: this.id,
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
    const url = "/customer/" + this.id;
    this.router.navigateByUrl(url);
  }

  getCustomer(){
    this.customeronboardingService.getCustomer()
      .subscribe( (customers: Customer[]) =>{
        this.customers = customers;
    });
  }

  ngOnInit() {

  }

}
