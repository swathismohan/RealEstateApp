import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DBBuyer } from '../models/buyer';
import { DBCustomer } from '../models/customer';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { DeactivationService } from '../services/deactivation.service';
import { PropertyServiceService } from '../services/property-service.service';
import { BidServiceService } from '../services/bid-service.service';
import { Bid } from '../models/bid';
import { Property } from '../models/property';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  providers: [BuyeronboardingServiceService, CustomeronboardingServiceService, DeactivationService, PropertyServiceService, BidServiceService],
})
export class StartComponent implements OnInit {

  customer!: DBCustomer;
  buyer!: DBBuyer;
  userName!: string;
  password!: string;
  properties: Property[] = [];
  bids: Bid[] = [];

  constructor(private router: Router,
     private buyerOnboardingService: BuyeronboardingServiceService,
     private customerOnboardingService: CustomeronboardingServiceService,
     private deactivationService: DeactivationService,
     private propertyService: PropertyServiceService,
     private bidService: BidServiceService) { }

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
          this.activateBuyer();
          this.router.navigateByUrl(url);
        }

      });
  }

  activateBuyer(){
    this.deactivationService.activateBuyer(this.buyer.buyerId, true)
    .subscribe((response:DBBuyer) => {
      console.log("activating buyer");
    });
    this.bidService.getAllBidByBuyer(this.buyer.buyerId)
      .subscribe((respon:Bid[]) => {
        this.bids = respon;
        for (var bi in this.bids){
          this.propertyService.getPropertyById(this.bids[bi].propertyId)
          .subscribe((resp:Property) => {
            if(resp.active){
              this.deactivationService.activateBid(this.bids[bi].bidId, true)
              .subscribe((res:Bid) => {
              });
            }
          });
        }
      });
  }

  ngOnInit() {
  }

}
