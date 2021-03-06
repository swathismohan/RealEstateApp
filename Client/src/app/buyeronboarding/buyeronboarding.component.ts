import { Component, OnInit, Inject } from '@angular/core';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { ApiServiceService } from '../services/api-service.service';
import { DBBuyer ,Buyer, Address, PhoneNumber, EmailAddress } from '../models/buyer';
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
  selector: 'app-buyeronboarding',
  templateUrl: './buyeronboarding.component.html',
  styleUrls: ['./buyeronboarding.component.scss'],
  providers: [BuyeronboardingServiceService, ApiServiceService, NotificationService]
})
export class BuyeronboardingComponent implements OnInit {

  buyers: Buyer[] = [];
  buyer!: Buyer;
  userName!: string;
  password!: string;
  buyerId!: string;
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
  buyerAdded!: boolean;
  tin!: string;
  updateDetails!: boolean;
  otpId!: string;
  passcode!: string;
  otpStatus!: string;
  idType: string;

  constructor(private buyeronboardingService: BuyeronboardingServiceService,
    private apiService : ApiServiceService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private notificationService: NotificationService,
    public dialog: MatDialog) {  }

    openDialog(): void {
      const dialogRef = this.dialog.open(DialogOtpVerificationBuyer, {
        width: '500px',
        disableClose: true,
        data: {
          userId: this.buyerId,
          phoneNumber: this.phoneNumber,
          updateDetails: this.updateDetails,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.addBuyer();
        alert('Buyer Registered Successfully');
        this.onCompletion();
      });
    }

  addBuyer(){
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

    const newapiBuyer = {
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
    this.apiService.postBuyer(newapiBuyer).subscribe((buyerid: any) =>{
      this.buyerId=buyerid;
      const newBuyer = {
        buyerId: this.buyerId,
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
        legalSubscription: false,
        active: true
      }
        this.buyeronboardingService.addBuyer(newBuyer)
        .subscribe((buyer: any) =>{
          this.buyers.push(buyer);
        });
      });
    this.buyerAdded = true;
    this.notificationService.welcomeEmail(this.firstName, this.emailAddresses[0].address)
    .subscribe( (resp: any) =>{
    });
}

  updateBuyer() {
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

    const updatedBuyer = {
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
      this.apiService.editBuyer(this.buyerId, updatedBuyer)
      .subscribe( (resp: any) =>{
      });
  }

  onCompletion() {
        const url = "/";
        this.router.navigateByUrl(url);
  }

  ngOnInit() {
    this.buyeronboardingService.getBuyer()
      .subscribe( buyers =>
        this.buyers = buyers);

    this.buyerAdded = false;
    this.updateDetails = false;
    if (this.activatedroute.snapshot.params && this.activatedroute.snapshot.params['buyerId']) {
      this.buyerId = this.activatedroute.snapshot.params['buyerId'];
      this.buyeronboardingService.getBuyerByUserIdFromFFDC(this.buyerId)
    .subscribe((response: Buyer) =>{
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
        this.emailAddress = response.emailAddresses[0].address;
        this.phoneNumber = response.phoneNumbers[0].number;
        this.idType = response.identification.type;
        this.idNumber = response.identification.id;
        this.updateDetails = true;
  });

  }
  }

}

@Component({
  selector: 'dialog-otp-verification-buyer',
  templateUrl: './dialog-otp-verification-buyer.html',
  styleUrls: ['./buyeronboarding.component.scss'],
  providers: [ApiServiceService],
})
export class DialogOtpVerificationBuyer {
  otpId!: string;
  otpStatus!: string;
  passcode!: string;
  loading!: boolean;

  constructor(
    private apiService: ApiServiceService,
    public dialogRef: MatDialogRef<DialogOtpVerificationBuyer>,
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
