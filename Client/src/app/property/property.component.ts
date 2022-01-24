import { Component, OnInit } from '@angular/core';
import { Property } from '../models/property';
import { Bid } from '../models/bid';
import { Router, ActivatedRoute } from '@angular/router';
import { BidServiceService } from '../services/bid-service.service';
import { PropertyServiceService } from '../services/property-service.service';


@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
  providers: [BidServiceService, PropertyServiceService]
})
export class PropertyComponent implements OnInit {
  propertyId!: string;
  bids: Bid[] = [];
  bid!: Bid;
  property!: Property;

  constructor(private bidService: BidServiceService, private router: Router, private activatedRoute: ActivatedRoute, private PropertyService: PropertyServiceService) { }

  updateBid(bidId: string, status: string){
    this.bidService.updateBid(bidId, status)
    .subscribe((response: Bid) =>{
      this.bid = response;
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
  }

}
