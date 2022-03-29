import { Component, OnInit } from '@angular/core';
import { Property } from '../models/property';
import { PropertyServiceService } from '../services/property-service.service';
import { NotificationService } from '../services/notification.service';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { BuyeronboardingServiceService } from '../services/buyeronboarding-service.service';
import { PaymentService } from '../services/payment.service';
import { Customer } from '../models/customer';
import { Buyer } from '../models/buyer';
import { QaService } from '../services/qa.service';
import { QuestionAnswer } from '../models/qa';
import { Payment } from '../models/payment';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
  providers: [ PropertyServiceService, NotificationService, CustomeronboardingServiceService, BuyeronboardingServiceService, QaService, PaymentService ],
})
export class AdminPageComponent implements OnInit {

  property!: Property;
  properties: Property[] = [];
  comment!: string;
  email!: string;
  questions: QuestionAnswer[] = [];
  payments: Payment[] = [];
  answer!: string;

  constructor( private propertyService:PropertyServiceService, private notificationService: NotificationService,
    private customeronboardingService: CustomeronboardingServiceService, private qaService: QaService,
    private paymentService: PaymentService, private buyeronboardingService: BuyeronboardingServiceService) { }

  propertyVerified(property: Property, verification: string){
    this.propertyService.propertyVerified(property.propertyId, verification,this.comment)
    .subscribe((response: Property) =>{
      this.property = response;
    });
    this.customeronboardingService.getCustomerById(property.customerId)
    .subscribe((response: Customer) =>{
      this.email = response.emailAddresses[0].address;
      this.notificationService.propertyVerifiedEmail(property.propertyName, this.email)
        .subscribe((response: any) =>{
      });
    });
  }

  paymentVerified(transId:string, entityId: string, entityType: string)
  {
    this.paymentService.verifyPaymentInfo(transId)
    .subscribe((response: Payment) =>{
    });
    if(entityType == "CUSTOMER"){
      this.customeronboardingService.getLegalSubscription(entityId)
      .subscribe((response: Customer) =>{
      });
      this.customeronboardingService.getCustomerById(entityId)
      .subscribe((response: Customer) =>{
        this.notificationService.legalSubEmail(response.firstName,response.emailAddresses[0].address)
        .subscribe((respo: any) =>{
        });
      });
    }
    else if(entityType == "BUYER"){
      this.buyeronboardingService.getLegalSubscription(entityId)
      .subscribe((response: Buyer) =>{
      });
      this.buyeronboardingService.getBuyerById(entityId)
      .subscribe((response: Buyer) =>{
        this.notificationService.legalSubEmail(response.firstName,response.emailAddresses[0].address)
        .subscribe((respo: any) =>{
        });
      });
    }
    else{
      // for verifying payments for property verification request
    }
  }

  questionAnswered(qaid : string){
    this.qaService.addAnswer(qaid,this.answer)
    .subscribe((response: QuestionAnswer) =>{
    });
  }

  ngOnInit(): void {
    this.propertyService.getVerifyRequestedProperty()
      .subscribe((response:Property[]) => {
        this.properties = response;
    });
    this.qaService.getUnansweredQuestions()
    .subscribe((response:QuestionAnswer[]) => {
      this.questions = response;
  });
  this.paymentService.getPendingPayments()
    .subscribe((response:Payment[]) => {
      this.payments = response;
  });

  }

}
