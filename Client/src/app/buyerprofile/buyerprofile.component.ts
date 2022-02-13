import { Component, OnInit } from '@angular/core';
import { Property } from '../models/property';
import { PropertyServiceService } from '../services/property-service.service';
import { Buyer } from '../models/buyer';
import { Bid } from '../models/bid';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { BidServiceService } from '../services/bid-service.service';

@Component({
  selector: 'app-buyerprofile',
  templateUrl: './buyerprofile.component.html',
  styleUrls: ['./buyerprofile.component.scss'],
  providers: [BuyeronboardingServiceService, PropertyServiceService ],
})
export class BuyerprofileComponent implements OnInit {

  buyerId!: string;
  public buyer!: Buyer;
  properties: Property[] = [];
  proposedAmount!: number;
  bid!: Bid;
  propertyId!: string;
  customerId!: string;
  bidId!: string;
  status!: string;
  bids: Bid[] = [];

  constructor(private buyerOnboardingService:BuyeronboardingServiceService, private router: Router, private activatedroute: ActivatedRoute, private propertyService: PropertyServiceService, private bidService: BidServiceService ) { }

  createBid(propertyId: any, customerId: any){
    this.bidId = uuid();
    const newBid = {
      propertyId: propertyId,
      customerId: customerId,
      bidId: this.bidId,
      buyerId: this.buyerId,
      proposedAmount: this.proposedAmount,
      status: this.status,
      buyerName: this.buyer.firstName,
      buyerEmail: this.buyer.emailAddresses[0].address
    }
    this.bidService.addBid(newBid)
      .subscribe((bid: any) =>{
        this.bids.push(bid);
      });
  }

  getAllBidsByBuyer(){
    this.bidService.getBidByBuyer(this.buyerId)
      .subscribe((response:Bid[]) => {
        this.bids = response;
      });
  }

  ngOnInit(): void {
    this.buyerId = this.activatedroute.snapshot.params['buyerId'];
    this.buyerOnboardingService.getBuyerById(this.buyerId)
      .subscribe((response: Buyer) =>{
        this.buyer = response;
    });

    this.propertyService.getAvailableProperty()
      .subscribe((response:Property[]) => {
        this.properties = response;
    });

    this.getAllBidsByBuyer();

  }

}
