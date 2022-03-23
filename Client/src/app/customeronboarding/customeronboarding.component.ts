import { Component, OnInit, Inject, Input } from '@angular/core';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import {
  DBCustomer,
  Customer,
  Address,
  PhoneNumber,
  EmailAddress,
} from '../models/customer';
import { ApiServiceService } from '../services/api-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-customeronboarding',
  templateUrl: './customeronboarding.component.html',
  styleUrls: ['./customeronboarding.component.scss'],
  providers: [
    CustomeronboardingServiceService,
    ApiServiceService,
    NotificationService,
  ],
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

  constructor(
    private customeronboardingService: CustomeronboardingServiceService,
    private apiService: ApiServiceService,
    private router: Router,
    public dialog: MatDialog,
    private activatedroute: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  addCustomer() {
    this.phoneNumbers.push({
      type: 'MOBILE',
      number: this.phoneNumber,
    });

    this.emailAddresses.push({
      type: 'OTHER',
      address: this.emailAddress,
    });

    this.addresses.push({
      addressType: 'RESIDENTIAL',
      country: this.countryOfResidency,
      line1: this.addline1,
      line2: this.addline2,
      line3: this.addline3,
      line4: this.addline4,
      line5: this.addline5,
      postalCode: this.postalCode,
      buildingNumber: this.buildingNumber,
    });

    const momentDate = new Date(this.dateOfBirth);
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');

    const newapiCustomer = {
      title: this.title,
      dateOfBirth: formattedDate,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      countryOfResidency: this.countryOfResidency,
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
        tin: this.tin,
      },
    };

    this.apiService
      .postCustomer(newapiCustomer)
      .subscribe((customerid: any) => {
        this.customerId = customerid;
        const newCustomer = {
          customerId: this.customerId,
          firstName: this.firstName,
          lastName: this.lastName,
          gender: this.gender,
          countryOfResidency: this.countryOfResidency,
          identification: {
            type: this.idType,
            id: this.idNumber
          },
          addresses: this.addresses,
          phoneNumbers: this.phoneNumbers,
          emailAddresses: this.emailAddresses,
          userName: this.userName,
          password: this.password,
          legalSubscription: false,
          active: true
        }
        this.customeronboardingService.addCustomer(newCustomer)
          .subscribe((customer: any) =>{
            this.customers.push(customer);
          });
      });
    this.customerAdded = true;
    this.notificationService
      .welcomeEmail(this.firstName, this.emailAddresses[0].address)
      .subscribe((resp: any) => {});
  }

  updateCustomer() {
    this.phoneNumbers.push({
      type: 'MOBILE',
      number: this.phoneNumber,
    });

    this.emailAddresses.push({
      type: 'OTHER',
      address: this.emailAddress,
    });

    this.addresses.push({
      addressType: 'RESIDENTIAL',
      country: this.countryOfResidency,
      line1: this.addline1,
      line2: this.addline2,
      line3: this.addline3,
      line4: this.addline4,
      line5: this.addline5,
      postalCode: this.postalCode,
      buildingNumber: this.buildingNumber,
    });

    const momentDate = new Date(this.dateOfBirth);
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');

    const updatedCustomer = {
      title: this.title,
      dateOfBirth: formattedDate,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      countryOfResidency: this.countryOfResidency,
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

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOtpVerification, {
      width: '500px',
      disableClose: true,
      data: {
        userId: this.customerId,
        phoneNumber: this.phoneNumber,
        updateDetails: this.updateDetails,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.addCustomer();
      alert('Customer Registered Successfully');
      this.onCompletion();
    });
  }

  onCompletion() {
      const url = '/';
      this.router.navigateByUrl(url);
  }

  getCustomer() {
    this.customeronboardingService
      .getCustomer()
      .subscribe((customers: Customer[]) => {
        this.customers = customers;
      });
  }

  ngOnInit() {
    this.customerAdded = false;
    this.updateDetails = false;

    if (
      this.activatedroute.snapshot.params &&
      this.activatedroute.snapshot.params['customerId']
    ) {
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

@Component({
  selector: 'dialog-otp-verification',
  templateUrl: './dialog-otp-verification.html',
  styleUrls: ['./customeronboarding.component.scss'],
  providers: [ApiServiceService],
})
export class DialogOtpVerification {
  otpId!: string;
  otpStatus!: string;
  passcode!: string;
  loading!: boolean;

  constructor(
    private apiService: ApiServiceService,
    public dialogRef: MatDialogRef<DialogOtpVerification>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    this.sendOtp();
  }
  sendOtp() {
    this.otpStatus = undefined;
    this.passcode = '';
    this.apiService.sendOtp(this.data.phoneNumber).subscribe((resp: any) => {
      this.otpId = resp;
    });
  }
  verifyOtp() {
    this.loading = true;

    this.apiService
      .verifyOtp(this.data.phoneNumber, this.otpId, this.passcode)
      .subscribe((resp: any) => {
        this.otpStatus = resp;
        this.loading = false;
        if (this.otpStatus === 'approved') {
          this.closeDialog();
        }
      });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
