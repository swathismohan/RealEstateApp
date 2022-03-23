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
          alert("Customer not active");
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
          alert("Buyer not active");
        }

      });
  }

  activateBuyer(){
    this.deactivationService.activateBuyer(this.buyer.buyerId, true)
    .subscribe((response:DBBuyer) => {
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

  activateCustomer(){
    this.deactivationService.activateCustomer(this.customer.customerId, true)
    .subscribe((response:DBCustomer) => {
    });
    this.propertyService.getPropertyByCustomerId(this.customer.customerId)
    .subscribe((respo:Property[]) => {
      this.properties=respo;
      for(var pr in this.properties){
        this.deactivationService.activateProperty(this.properties[pr].propertyId, true)
        .subscribe((resp:Property) => {
          });
          this.bidService.getAllBidsByPropertyId(this.properties[pr].propertyId)
          .subscribe((res:Bid[]) => {
            this.bids=res;
            for (var bi in this.bids){
              this.buyerOnboardingService.getBuyerById(this.bids[bi].buyerId)
              .subscribe((re:DBBuyer) => {
                if(re.active){
                  this.deactivationService.activateBid(this.bids[bi].bidId, true)
                  .subscribe((res:Bid) => {
                  });
                }
              });
            }
        });
      }
    });
  }

  ngOnInit() {
  }

}
