import { Component, OnInit } from '@angular/core';
import { Property } from '../models/property';
import { PropertyServiceService } from '../services/property-service.service';
import { NotificationService } from '../services/notification.service';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { Customer } from '../models/customer';
import { QaService } from '../services/qa.service';
import { QuestionAnswer } from '../models/qa';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
  providers: [ PropertyServiceService, NotificationService, CustomeronboardingServiceService, QaService ],
})
export class AdminPageComponent implements OnInit {

  property!: Property;
  properties: Property[] = [];
  comment!: string;
  email!: string;
  questions: QuestionAnswer[] = [];
  answer!: string;

  constructor( private propertyService:PropertyServiceService, private notificationService: NotificationService,
    private customeronboardingService: CustomeronboardingServiceService, private qaService: QaService) { }

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
  }

}
