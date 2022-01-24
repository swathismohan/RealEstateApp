import { Component, OnInit } from '@angular/core';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { Buyer } from '../models/buyer';
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
  countryOfResidency!: string;
  addline1!: string;
  addline2!: string;
  addline3!: string;
  addline4!: string;
  postalCode!: string;
  buildingNumber!: string;
  phoneNumber!: string;
  emailAddress!: string;
  legalSubscription!: boolean;
  id!: string;

  constructor(private buyeronboardingService: BuyeronboardingServiceService, private router: Router) {  }

  addBuyer(){
    this.id = uuid();
    const newBuyer = {
      userName: this.userName,
      password: this.password,
      buyerId: this.id,
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
      emailAddress: this.emailAddress,
      legalSubscription: false
    }
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
