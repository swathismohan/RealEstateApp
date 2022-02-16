import { Component, OnInit } from '@angular/core';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { DBCustomer ,Customer, Address, PhoneNumber, EmailAddress } from '../models/customer';
import { ApiServiceService } from '../services/api-service.service';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-customeronboarding',
  templateUrl: './customeronboarding.component.html',
  styleUrls: ['./customeronboarding.component.scss'],
  providers: [CustomeronboardingServiceService, ApiServiceService],
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
  customerAdded!: boolean;
  tin!: string;

  constructor(private customeronboardingService : CustomeronboardingServiceService, private apiService : ApiServiceService, private router: Router) { }

  addCustomer(){

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

    const newapiCustomer = {
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
      emailAddresses: this.emailAddresses,
      fatcaDetails: {
        isUSResident: true,
        isUSTaxResident: false,
        tin: this.tin
    }
    }

    this.apiService.postCustomer(newapiCustomer).subscribe((customerid: any) =>{
      this.customerId=customerid;
      const newCustomer = {
        customerId: this.customerId,
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
        emailAddresses: this.emailAddresses,
        userName: this.userName,
        password: this.password,
        legalSubscription: false
      }
      this.customeronboardingService.addCustomer(newCustomer)
        .subscribe((customer: any) =>{
          this.customers.push(customer);
        });
    });
    this.customerAdded=true;
  }

  onCompletion() {
    const url = "/customer/" + this.customerId;
    this.router.navigateByUrl(url);
  }

  getCustomer(){
    this.customeronboardingService.getCustomer()
      .subscribe( (customers: Customer[]) =>{
        this.customers = customers;
    });
  }

  ngOnInit() {
    this.customerAdded=false;
  }

}
