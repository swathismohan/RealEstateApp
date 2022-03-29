import { Component, OnInit, Inject } from '@angular/core';
import { Property } from '../models/property';
import { PropertyServiceService } from '../services/property-service.service';
import { QaService } from '../services/qa.service';
import { PaymentService } from '../services/payment.service';
import { DBBuyer, Buyer } from '../models/buyer';
import { Bid } from '../models/bid';
import { Payment } from '../models/payment';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { BidServiceService } from '../services/bid-service.service';
import { ApiServiceService } from '../services/api-service.service';
import { DeactivationService } from '../services/deactivation.service';
import { QuestionAnswer } from '../models/qa';
import { Customer } from '../models/customer';

export interface DialogData {
  userId: string;
  subscription: boolean;
  requestPayment: boolean;
}

export interface CustomerContact {
  name: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-buyerprofile',
  templateUrl: './buyerprofile.component.html',
  styleUrls: ['./buyerprofile.component.scss'],
  providers: [BuyeronboardingServiceService, PropertyServiceService, QaService, CustomeronboardingServiceService, DeactivationService ],
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
  requestPayment!: Boolean;
  customer: Customer;

  constructor(
    private buyerOnboardingService:BuyeronboardingServiceService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private propertyService: PropertyServiceService,
    private bidService: BidServiceService,
    public dialog: MatDialog,
    private qaService: QaService,
    private customeronboardingServiceService: CustomeronboardingServiceService,
    private deactivationService: DeactivationService ) { }

    openDialog(): void {
      const dialogRef = this.dialog.open(DialogLegalBuyer, {
        width: '500px',
        data: {
          userId: this.buyerId,
          subscription: this.buyer.legalSubscription,
          requestPayment: this.requestPayment
        },
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
      propertyName: propertyName,
      active: true
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

  getCustomerDetails(customerId){
    this.customeronboardingServiceService.getCustomerByUserIdFromFFDC(customerId)
    .subscribe((response) => {
      this.customer = response;
      this.dialog.open(DialogContactDetails, {
        width: '500px',
        data: {
          name: this.customer.firstName,
          phone: this.customer.phoneNumbers[0].number,
          email: this.customer.emailAddresses[0].address
        },
      });
    });
  }

  deactivateAccount(){
    this.deactivationService.activateBuyer(this.buyerId, false)
    .subscribe((response:Buyer) => {
      console.log("deactivating buyer");
    });
    this.bidService.getAllBidByBuyer(this.buyerId)
      .subscribe((resp:Bid[]) => {
        this.bids = resp;
        for (var bi in this.bids){
          this.deactivationService.activateBid(this.bids[bi].bidId, false)
          .subscribe((res:Bid) => {
          });
        }
      });
      this.onCompletion();
  }

  postQuestion(){
    this.qaId = uuid();
    const newQuestion = {
      QAId: this.qaId,
      userId: this.buyerId,
      question: this.question,
      answer: "Awaiting Response",
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
  providers: [BuyeronboardingServiceService, ApiServiceService, PaymentService]
})

export class DialogLegalBuyer {

  fromAccountId!: string;
  narrative!: string;
  entityId: string;
  entityType: string;
  transactionAmount: string;
  transactionId: string;
  transactionTime: string;
  transactionDate: string;
  status: string;
  newPaymenttest: Payment;

  constructor(
    private buyerOnboardingService: BuyeronboardingServiceService,
    private apiService: ApiServiceService,
    private paymentService: PaymentService,
    public dialogRef: MatDialogRef<DialogLegalBuyer>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  showPaymentDetails(){
    this.data.requestPayment = true;
  }

  makePayment(){
    this.apiService.makePayment(this.fromAccountId, this.narrative, "250")
    .subscribe((response: any) =>{
      this.newPaymenttest = {
        entityId: this.data.userId,
        entityType: "BUYER",
        transactionAmount: "250",
        transactionId: response.transactionId,
        transactionTime: response.transactionTime,
        transactionDate: response.transactionDate,
        status: "PENDING"
      }
      this.paymentService.postPaymentInfo(this.newPaymenttest)
      .subscribe((res: any) =>{
      });
      alert("Payment Successful");
      this.dialogRef.close();
    });
  }

}

@Component({
  selector: 'dialog-contact-details',
  templateUrl: './dialog-contact-details.html',
  providers: []
})

export class DialogContactDetails {

  constructor(
    public dialogRef: MatDialogRef<DialogContactDetails>,
    @Inject(MAT_DIALOG_DATA) public data: CustomerContact,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
