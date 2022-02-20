import { Component, OnInit, Inject } from '@angular/core';
import { Property } from '../models/property';
import { PropertyServiceService } from '../services/property-service.service';
import { DBBuyer } from '../models/buyer';
import { Bid } from '../models/bid';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { BidServiceService } from '../services/bid-service.service';

export interface DialogData {
  subscription: boolean;
}

@Component({
  selector: 'app-buyerprofile',
  templateUrl: './buyerprofile.component.html',
  styleUrls: ['./buyerprofile.component.scss'],
  providers: [BuyeronboardingServiceService, PropertyServiceService ],
})
export class BuyerprofileComponent implements OnInit {

  subscription!: boolean;

  buyerId!: string;
  public buyer!: DBBuyer;
  properties: Property[] = [];
  proposedAmount!: number;
  bid!: Bid;
  propertyId!: string;
  customerId!: string;
  bidId!: string;
  status!: string;
  bids: Bid[] = [];

  constructor(private buyerOnboardingService:BuyeronboardingServiceService, private router: Router, private activatedroute: ActivatedRoute, private propertyService: PropertyServiceService,
    private bidService: BidServiceService, public dialog: MatDialog ) { }

    openDialog(): void {
      const dialogRef = this.dialog.open(DialogLegalBuyer, {
        width: '500px',
        data: { subscription: this.buyer.legalSubscription},
      });

      dialogRef.afterClosed().subscribe(result => {
        this.buyer.legalSubscription = result;
        if(this.buyer.legalSubscription){
          this.buyerOnboardingService.getLegalSubscription(this.buyerId)
          .subscribe((response: DBBuyer) =>{
          });
        }
      });
    }

  createBid(propertyId: any, customerId: any, propertyName: string){
    this.bidId = uuid();
    const newBid = {
      propertyId: propertyId,
      customerId: customerId,
      bidId: this.bidId,
      buyerId: this.buyerId,
      proposedAmount: this.proposedAmount,
      status: this.status,
      buyerName: this.buyer.firstName,
      buyerEmail: this.buyer.emailAddresses[0].address,
      propertyName: propertyName
    }
    this.bidService.addBid(newBid)
      .subscribe((bid: any) =>{
        this.bids.push(bid);
      });
      window.location.reload();
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
      .subscribe((response: DBBuyer) =>{
        this.buyer = response;
    });

    this.propertyService.getAvailableProperty()
      .subscribe((response:Property[]) => {
        this.properties = response;
    });

    this.getAllBidsByBuyer();

  }

}

@Component({
  selector: 'dialog-legal-buyer',
  templateUrl: './dialog-legal-buyer.html',
})

export class DialogLegalBuyer {
  constructor(
    public dialogRef: MatDialogRef<DialogLegalBuyer>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
