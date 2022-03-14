import { Component, OnInit, Inject } from '@angular/core';
import { Property } from '../models/property';
import { PropertyServiceService } from '../services/property-service.service';
import { QaService } from '../services/qa.service';
import { DBBuyer, Buyer } from '../models/buyer';
import { Bid } from '../models/bid';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { BidServiceService } from '../services/bid-service.service';
import { QuestionAnswer } from '../models/qa';

export interface DialogData {
  userId: string;
  subscription: boolean;
  requestPayment: boolean;
}

@Component({
  selector: 'app-buyerprofile',
  templateUrl: './buyerprofile.component.html',
  styleUrls: ['./buyerprofile.component.scss'],
  providers: [BuyeronboardingServiceService, PropertyServiceService, QaService ],
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
  qaId!: string;
  question!: string;
  questions: QuestionAnswer[] = [];
  apibuyer!: Buyer;
  allproperty!: boolean;


  constructor(private buyerOnboardingService:BuyeronboardingServiceService, private router: Router, private activatedroute: ActivatedRoute, private propertyService: PropertyServiceService,
    private bidService: BidServiceService, public dialog: MatDialog, private qaService: QaService ) { }

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
  }

  getAllBidsByBuyer(e=null) {
    if (e && e.index === 2) {
      this.bidService.getBidByBuyer(this.buyerId)
      .subscribe((response:Bid[]) => {
        this.bids = response;
      });
    }
  }

  postQuestion(){
    this.qaId = uuid();
    const newQuestion = {
      QAId: this.qaId,
      userId: this.buyerId,
      question: this.question,
      answer: null,
      QAstatus: "UNANSWERED"
    }
    this.qaService.postQuestion(newQuestion)
    .subscribe((question: any) =>{
    });
    window.location.reload();
  }

  editBuyerProfile() {
    const url = "/buyeronboarding/" + this.buyerId;
    this.router.navigateByUrl(url);
  }

  onCompletion() {
    setTimeout(() =>
    {
      const url = "/";
      this.router.navigateByUrl(url);
    },2000);
  }

  filterProperty(){
    if(this.allproperty){
      this.propertyService.getAvailableVerifiedProperty()
      .subscribe((response:Property[]) => {
        this.properties = response;
    });
    this.allproperty=false;
    }
    else{
      this.propertyService.getAvailableProperty()
      .subscribe((response:Property[]) => {
        this.properties = response;
    });
    this.allproperty=true;
    }
  }

  ngOnInit(): void {
    this.buyerId = this.activatedroute.snapshot.params['buyerId'];
    this.buyerOnboardingService.getBuyerByUserIdFromFFDC(this.buyerId)
    .subscribe((response: Buyer) =>{
      this.apibuyer = response;
  });

  this.allproperty=true;

    this.buyerOnboardingService.getBuyerById(this.buyerId)
      .subscribe((response: DBBuyer) =>{
        this.buyer = response;
    });

    this.propertyService.getAvailableProperty()
      .subscribe((response:Property[]) => {
        this.properties = response;
    });

    this.getAllBidsByBuyer();

    this.qaService.getQuestionsByUserId(this.buyerId)
    .subscribe((resp: QuestionAnswer[]) =>{
      this.questions = resp;
    });

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
