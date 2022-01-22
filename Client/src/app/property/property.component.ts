import { Component, OnInit } from '@angular/core';
import { Property } from '../models/property';
import { Bid } from '../models/bid';
import { Router, ActivatedRoute } from '@angular/router';
import { BidServiceService } from '../services/bid-service.service';


@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
  providers: [BidServiceService]
})
export class PropertyComponent implements OnInit {
  propertyId!: string;
  bids: Bid[] = [];

  constructor(private bidService: BidServiceService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.propertyId = this.activatedRoute.snapshot.params['propertyId'];
    this.bidService.getBidsByPropertyId(this.propertyId)
      .subscribe((response: Bid[]) =>{
        this.bids = response;
      });
  }

}
