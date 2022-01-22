import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Buyer } from '../models/buyer';
import { Customer } from '../models/customer';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  providers: [BuyeronboardingServiceService, CustomeronboardingServiceService],
})
export class StartComponent implements OnInit {

  customer!: Customer;
  buyer!: Buyer;
  userName!: string;
  password!: string;

  constructor(private router: Router, private buyerOnboardingService: BuyeronboardingServiceService, private customerOnboardingService: CustomeronboardingServiceService) { }

  getCustomerByUserName(){
    this.customerOnboardingService.getCustomerByUserName(this.userName, this.password)
      .subscribe((response: Customer) =>{
        this.customer = response;
      });
  }

  getBuyerByUserName(){
    this.buyerOnboardingService.getBuyerByUserName(this.userName, this.password)
      .subscribe((response: Buyer) =>{
        this.buyer = response;
      });
  }

  ngOnInit() {
  }

  gotoCustomerProfile() {
    const url = "/customer/" + this.customer.customerId;
    this.router.navigateByUrl(url);
  }

  gotoBuyerProfile() {
    const url = "/buyer/" + this.buyer.buyerId;
    this.router.navigateByUrl(url);;
  }

}
