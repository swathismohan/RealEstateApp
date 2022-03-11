import { Component, OnInit } from '@angular/core';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { ApiServiceService } from '../services/api-service.service';
import { DBBuyer ,Buyer, Address, PhoneNumber, EmailAddress } from '../models/buyer';
import { Router, ActivatedRoute } from '@angular/router';
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

  constructor(private buyeronboardingService: BuyeronboardingServiceService, private apiService : ApiServiceService,
    private router: Router, private activatedroute: ActivatedRoute, private notificationService: NotificationService) {  }

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

    this.apiService.postBuyer(newapiBuyer).subscribe((buyerid: any) =>{
      this.buyerId=buyerid;
      const newBuyer = {
        buyerId: this.buyerId,
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
    console.log('Update Buyer');
  }

  onCompletion() {
    setTimeout(() =>
    {
      const url = "/";
      this.router.navigateByUrl(url);
    },2000);
  }

  ngOnInit() {
    this.buyeronboardingService.getBuyer()
      .subscribe( buyers =>
        this.buyers = buyers);

    this.buyerAdded = false;
    this.updateDetails = false;
    if (this.activatedroute.snapshot.params && this.activatedroute.snapshot.params['buyerId']) {
      const buyerId = this.activatedroute.snapshot.params['buyerId'];
    this.buyeronboardingService.getBuyerByUserIdFromFFDC(buyerId)
    .subscribe((response: Buyer) =>{
      this.title = response.title;
        this.dateOfBirth = response.dateOfBirth;
  });

    this.buyeronboardingService.getBuyerById(buyerId)
      .subscribe((response: DBBuyer) =>{
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
          this.idNumber = response.identification.id;
          this.updateDetails = true;
    });
    }
  }

}
