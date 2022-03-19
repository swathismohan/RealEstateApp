import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Property } from '../models/property';
import { Bid } from '../models/bid';
import { Router, ActivatedRoute } from '@angular/router';
import { BidServiceService } from '../services/bid-service.service';
import { PropertyServiceService } from '../services/property-service.service';
import { NotificationService } from '../services/notification.service';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { Buyer } from '../models/buyer';
import { Customer } from '../models/customer';
import { CustomerContact } from '../buyerprofile/buyerprofile.component';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
  providers: [
    BidServiceService,
    PropertyServiceService,
    BuyeronboardingServiceService,
    NotificationService,
  ],
})
export class PropertyComponent implements OnInit {
  propertyId!: string;
  bids: Bid[] = [];
  acceptedBids: Bid[] = [];
  declinedBids: Bid[] = [];
  bid!: Bid;
  property!: Property;
  bidResponded!: boolean;
  email!: string;
  propertyName!: string;
  buyer: Buyer;

  constructor(
    private bidService: BidServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private PropertyService: PropertyServiceService,
    private notificationService: NotificationService,
    private buyeronboardingService: BuyeronboardingServiceService,
    public dialog: MatDialog
  ) {}

  updateBid(bid: Bid, status: string) {
    this.bidService.updateBid(bid.bidId, status).subscribe((response: Bid) => {
      this.bid = response;
    });
    this.bidResponded = true;
    this.buyeronboardingService
      .getBuyerById(bid.buyerId)
      .subscribe((buyer: Buyer) => {
        this.email = buyer.emailAddresses[0].address;
        this.notificationService
          .bidAcceptanceEmail(bid.propertyName, this.email, status)
          .subscribe((res: any) => {});
      });
  }

  updateProperty(propertyId: string, status: string) {
    this.PropertyService.updateProperty(propertyId, status).subscribe(
      (response: Property) => {
        this.property = response;
      }
    );
  }

  ngOnInit() {
    this.propertyId = this.activatedRoute.snapshot.params['propertyId'];
    this.getPropertyName();
    this.getAllBids();

    this.bidResponded = false;
  }

  getPropertyName() {
    this.PropertyService.getPropertyById(this.propertyId).subscribe(
      (resp: Property) => {
        this.propertyName = resp.propertyName;
      }
    );
  }

  getAllBids() {
    this.bidService
      .getBidsByPropertyId(this.propertyId)
      .subscribe((response: Bid[]) => {
        this.bids = response;
      });
  }

  getBids(e = null) {
    if (e && e.index === 1) {
      this.bidService
        .getAcceptedBids(this.propertyId)
        .subscribe((response: Bid[]) => {
          this.acceptedBids = response;
        });
    }
    if (e && e.index === 2) {
      this.bidService
        .getDeclinedBids(this.propertyId)
        .subscribe((response: Bid[]) => {
          this.declinedBids = response;
        });
    }
    this.bidResponded = false;
  }

  getBuyerDetails(buyerId){
    this.buyeronboardingService.getBuyerByUserIdFromFFDC(buyerId)
    .subscribe((response) => {
      this.buyer = response;
      this.dialog.open(DialogBuyerDetails, {
        width: '500px',
        data: {
          name: this.buyer.firstName,
          phone: this.buyer.phoneNumbers[0].number,
          email: this.buyer.emailAddresses[0].address
        },
      });
    });
  }

}

@Component({
  selector: 'dialog-buyer-details',
  templateUrl: './dialog-buyer-details.html',
  providers: []
})

export class DialogBuyerDetails {

  constructor(
    public dialogRef: MatDialogRef<DialogBuyerDetails>,
    @Inject(MAT_DIALOG_DATA) public data: CustomerContact,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
