import { Component, OnInit } from '@angular/core';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { DBCustomer ,Customer, Address, PhoneNumber, EmailAddress } from '../models/customer';
import { ApiServiceService } from '../services/api-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-customeronboarding',
  templateUrl: './customeronboarding.component.html',
  styleUrls: ['./customeronboarding.component.scss'],
  providers: [CustomeronboardingServiceService, ApiServiceService, NotificationService],
})
export class CustomeronboardingComponent implements OnInit {

  dbuser!: any;
  customers: Customer[] = [];
  customer!: Customer;
  userName!: string;
  password!: string;
  customerId!: string;
  title!: string;
  dateOfBirth!: string;
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
  updateDetails!: boolean;
  otpId!: string;
  passcode!: string;
  otpStatus!: string;
  idType: string;

  constructor(private customeronboardingService : CustomeronboardingServiceService, private apiService : ApiServiceService,
    private router: Router, private activatedroute: ActivatedRoute, private notificationService: NotificationService) { }

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
      country: this.countryOfResidency,
      line1: this.addline1,
      line2: this.addline2,
      line3: this.addline3,
      line4: this.addline4,
      line5: this.addline5,
      postalCode: this.postalCode,
      buildingNumber: this.buildingNumber
    });

     const momentDate = new Date(this.dateOfBirth);
     const formattedDate = moment(momentDate).format("YYYY-MM-DD");

    const newapiCustomer = {
      title: this.title,
      dateOfBirth: formattedDate,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      countryOfResidency : this.countryOfResidency,
      identification: {
        type: this.idType,
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

    if(this.otpStatus == "approved"){
      this.apiService.postCustomer(newapiCustomer).subscribe((customerid: any) =>{
        this.customerId=customerid;
        const newCustomer = {
          customerId: this.customerId,
          firstName: this.firstName,
          lastName: this.lastName,
          gender: this.gender,
          countryOfResidency : this.countryOfResidency,
          identification: {
            type: this.idType,
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
      this.notificationService.welcomeEmail(this.firstName, this.emailAddresses[0].address)
      .subscribe( (resp: any) =>{
    });
    }
  }

  updateCustomer() {
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
      country: this.countryOfResidency,
      line1: this.addline1,
      line2: this.addline2,
      line3: this.addline3,
      line4: this.addline4,
      line5: this.addline5,
      postalCode: this.postalCode,
      buildingNumber: this.buildingNumber
    });

     const momentDate = new Date(this.dateOfBirth);
     const formattedDate = moment(momentDate).format("YYYY-MM-DD");

    const updatedCustomer = {
      title: this.title,
      dateOfBirth: formattedDate,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      countryOfResidency : this.countryOfResidency,
      identification: {
        type: this.idType,
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
      this.apiService.editCustomer(this.customerId, updatedCustomer)
      .subscribe( (resp: any) =>{
      });
  }


  onCompletion() {
    if(this.otpStatus == "approved"){
      setTimeout(() =>
      {
        const url = "/";
        this.router.navigateByUrl(url);
      },2000);
    }
  }

  sendOtp(){
    this.apiService.sendOtp(this.phoneNumber)
    .subscribe( (resp: any) =>{
      this.otpId = resp;
    });
  }

  verifyOtp(){
    this.apiService.verifyOtp(this.phoneNumber, this.otpId, this.passcode)
    .subscribe( (resp: any) =>{
      this.otpStatus = resp;
    });
  }

  getCustomer(){
    this.customeronboardingService.getCustomer()
      .subscribe( (customers: Customer[]) =>{
        this.customers = customers;
    });
  }

  ngOnInit() {
    this.customerAdded = false;
    this.updateDetails = false;

    if (this.activatedroute.snapshot.params && this.activatedroute.snapshot.params['customerId']) {
      this.customerId = this.activatedroute.snapshot.params['customerId'];

      this.customeronboardingService.getCustomerByUserIdFromFFDC(this.customerId)
      .subscribe((response: any) =>{
        this.title = response.title;
        this.dateOfBirth = response.dateOfBirth;
        this.firstName = response.firstName;
        this.lastName = response.lastName;
        this.addline1 = response.addresses[0].line1;
        this.addline2 = response.addresses[0].line2;
        this.addline3 = response.addresses[0].line3;
        this.addline4 = response.addresses[0].line4;
        this.addline5 = response.addresses[0].line5;
        this.buildingNumber = response.addresses[0].buildingNumber;
        this.postalCode = response.addresses[0].postalCode;
        this.gender = response.gender;
        this.countryOfResidency = response.countryOfResidency;
        this.userName = response.userName;
        this.emailAddress = response.emailAddresses[0].address;
        this.password = response.password;
        this.phoneNumber = response.phoneNumbers[0].number;
        this.idType = response.identification.type;
        this.idNumber = response.identification.id;
        this.updateDetails = true;
      });
    }
  }

}
