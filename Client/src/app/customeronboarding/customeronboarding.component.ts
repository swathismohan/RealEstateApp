import { Component, OnInit } from '@angular/core';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { DBCustomer ,Customer, Address, PhoneNumber, EmailAddress } from '../models/customer';
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
  gender!: string;
  countryOfResidency!: string;
  addline1!: string;
  addline2!: string;
  addline3!: string;
  addline4!: string;
  addline5!: string;
  postalCode!: string;
  buildingNumber!: string;
  idNumber!: string;
  addresses: Address[] = [];
  phoneNumbers: PhoneNumber[] = [];
  phoneNumber!: string;
  emailAddress!: string;
  emailAddresses: EmailAddress[] = [];
  legalSubscription!: boolean;
  id!: string;

  constructor(private customeronboardingService : CustomeronboardingServiceService, private router: Router) { }

  addCustomer(){
    this.id = uuid();

    this.phoneNumbers.push({
      type: "MOBILE",
      number: this.phoneNumber
    });

    this.emailAddresses.push({
      type: "OTHER",
      address: this.emailAddress
    });

    this.addresses.push({
      addressType: "RESIDENTIAL",
      country: "US",
      line1: this.addline1,
      line2: this.addline2,
      line3: this.addline3,
      line4: this.addline4,
      line5: this.addline5,
      postalCode: this.postalCode,
      buildingNumber: this.buildingNumber
    });

    const newCustomer = {
      customerId: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      countryOfResidency : this.countryOfResidency,
      identification: {
        type: "SOSE",
        id: this.idNumber
      },
      addresses: this.addresses,
      phoneNumbers: this.phoneNumbers,
      emailAddresses: this.emailAddresses
    }
    userName: this.userName;
    password: this.password;
    legalSubscription: false;
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
