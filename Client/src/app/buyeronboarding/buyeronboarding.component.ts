import { Component, OnInit } from '@angular/core';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { DBBuyer ,Buyer, Address, PhoneNumber, EmailAddress } from '../models/buyer';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-buyeronboarding',
  templateUrl: './buyeronboarding.component.html',
  styleUrls: ['./buyeronboarding.component.scss'],
  providers: [BuyeronboardingServiceService]
})
export class BuyeronboardingComponent implements OnInit {

  buyers: Buyer[] = [];
  buyer!: Buyer;
  userName!: string;
  password!: string;
  buyerId!: string;
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

  constructor(private buyeronboardingService: BuyeronboardingServiceService, private router: Router) {  }

  addBuyer(){
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
    const newBuyer = {
      buyerId: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      countryOfResidency : this.countryOfResidency,
      identification: {
        type: 'SOSE',
        id: this.idNumber
      },
      addresses: this.addresses,
      phoneNumbers: this.phoneNumbers,
      emailAddresses: this.emailAddresses
    }
    userName: this.userName;
    password: this.password;
    legalSubscription: false;

    this.buyeronboardingService.addBuyer(newBuyer)
      .subscribe((buyer: any) =>{
        this.buyers.push(buyer);
      });
  }

  onSubmit() {
    const url = "/buyer/" + this.id;
    this.router.navigateByUrl(url);
  }

  ngOnInit() {
    this.buyeronboardingService.getBuyer()
      .subscribe( buyers =>
        this.buyers = buyers);
  }

}
