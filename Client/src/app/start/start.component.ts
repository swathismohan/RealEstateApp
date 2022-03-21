import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DBBuyer } from '../models/buyer';
import { DBCustomer } from '../models/customer';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  providers: [BuyeronboardingServiceService, CustomeronboardingServiceService],
})
export class StartComponent implements OnInit {

  customer!: DBCustomer;
  buyer!: DBBuyer;
  userName!: string;
  password!: string;

  constructor(private router: Router, private buyerOnboardingService: BuyeronboardingServiceService, private customerOnboardingService: CustomeronboardingServiceService) { }

  getCustomerByUserName(){
    this.customerOnboardingService.getCustomerByUserName(this.userName, this.password)
      .subscribe((response: DBCustomer) =>{
        this.customer = response;
        const url = "/customer/" + response.customerId;
        if(this.customer.active){
          this.router.navigateByUrl(url);
        }
        else{
          this.router.navigateByUrl(url);
        }

      });
  }

  getBuyerByUserName(){
    this.buyerOnboardingService.getBuyerByUserName(this.userName, this.password)
      .subscribe((response: DBBuyer) =>{
        this.buyer = response;
        const url = "/buyer/" + response.buyerId;
        if(this.buyer.active){
          this.router.navigateByUrl(url);
        }
        else{
          this.router.navigateByUrl(url);
        }

      });
  }

  ngOnInit() {
  }

}
