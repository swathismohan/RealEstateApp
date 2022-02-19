import { Component, OnInit } from '@angular/core';
import { Property } from '../models/property';
import { Bid } from '../models/bid';
import { Router, ActivatedRoute } from '@angular/router';
import { BidServiceService } from '../services/bid-service.service';
import { PropertyServiceService } from '../services/property-service.service';
import { NotificationService } from '../services/notification.service';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { Buyer } from '../models/buyer';


@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
  providers: [BidServiceService, PropertyServiceService, BuyeronboardingServiceService, NotificationService]
})
export class PropertyComponent implements OnInit {
  propertyId!: string;
  bids: Bid[] = [];
  bid!: Bid;
  property!: Property;
  bidResponded!: boolean;
  email!: string;

  constructor(private bidService: BidServiceService, private router: Router, private activatedRoute: ActivatedRoute, private PropertyService: PropertyServiceService,
    private notificationService: NotificationService, private buyeronboardingService: BuyeronboardingServiceService) { }

  updateBid(bid : Bid, status: string){
    this.bidService.updateBid(bid.bidId, status)
    .subscribe((response: Bid) =>{
      this.bid = response;
    });
    this.bidResponded = true;
    this.buyeronboardingService.getBuyerById(bid.buyerId)
    .subscribe((buyer: Buyer) =>{
      this.email = buyer.emailAddresses[0].address;
        this.notificationService.bidAcceptanceEmail(bid.propertyName, this.email)
        .subscribe((res: any) =>{
      });
    });
  }

  updateProperty(propertyId: string, status: string){
    this.PropertyService.updateProperty(propertyId, status)
    .subscribe((response: Property) =>{
      this.property = response;
    });
  }

  ngOnInit() {
    this.propertyId = this.activatedRoute.snapshot.params['propertyId'];
    this.bidService.getBidsByPropertyId(this.propertyId)
      .subscribe((response: Bid[]) =>{
        this.bids = response;
      });

    this.bidResponded = false;
  }

}
