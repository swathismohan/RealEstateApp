import { Component, OnInit, Inject } from '@angular/core';
import { Property } from '../models/property';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { QaService } from '../services/qa.service';
import { PropertyServiceService } from '../services/property-service.service';
import { DBCustomer, Customer } from '../models/customer';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { v4 as uuid } from 'uuid';
import { DialogData } from '../buyerprofile/buyerprofile.component';
import { AppRoutingModule } from '../app-routing.module';
import { QuestionAnswer } from '../models/qa';

@Component({
  selector: 'app-customerprofile',
  templateUrl: './customerprofile.component.html',
  styleUrls: ['./customerprofile.component.scss'],
  providers: [CustomeronboardingServiceService, PropertyServiceService, QaService],
})
export class CustomerprofileComponent implements OnInit {

  subscription!: boolean;

  questions: QuestionAnswer[] = [];

  properties: Property[] = [];
  property!: Property;
  customerId!: string;
  propertyId!: string;
  propertyName!: string;
  propertyNumber!: string;
  addline1!: string;
  addline2!: string;
  addline3!: string;
  addline4!: string;
  postalCode!: string;
  marketValue!: number;
  contactDetails!: string;
  status!: string;
  greenBelt!: string;
  id!: string;
  propertyAdded!: boolean;
  type: string[] = [];
  propertyType!: string;
  qaId!: string;
  question!: string;
  apicustomer!: Customer;

  public customer!: DBCustomer;
  constructor(private customeronboardingService : CustomeronboardingServiceService, private router: Router, private activatedroute: ActivatedRoute,
     private propertyService: PropertyServiceService, public dialog: MatDialog, private qaService: QaService) { }

     openDialog(): void {
      const dialogRef = this.dialog.open(DialogLegalCustomer, {
        width: '500px',
        data: { subscription: this.customer.legalSubscription},
      });

      dialogRef.afterClosed().subscribe(result => {
        this.customer.legalSubscription = result;
        if(this.customer.legalSubscription){
          this.customeronboardingService.getLegalSubscription(this.customerId)
          .subscribe((response: DBCustomer) =>{
          });
        }
      });
    }

  addProperty(){
    this.id = uuid();
    const newProperty = {
      propertyId: this.id,
      customerId: this.customerId,
      propertyName: this.propertyName,
      propertyNumber: this.propertyNumber,
      addline1: this.addline1,
      addline2: this.addline2,
      addline3: this.addline3,
      addline4: this.addline4,
      postalCode: this.postalCode,
      marketValue: this.marketValue,
      contactDetails: this.contactDetails,
      status: "AVAILABLE",
      greenBelt: this.greenBelt,
      verification: "PENDING VERIFICATION",
      comment: "",
      propertyType: this.propertyType
    }
    this.propertyService.addProperty(newProperty)
      .subscribe((property: any) =>{
        this.properties.push(property);
      });
    this.propertyAdded = true;
  }

  getPropertyByCustomerId(e=null) {
    if (e && e.index === 2) {
      this.propertyService.getPropertyByCustomerId(this.customerId)
      .subscribe((response: Property[]) =>{
        this.properties = response;
      });
    }
  }

  gotoPropertyBids(propertyId: string){
    this.router.navigateByUrl('/property/' + propertyId +'/bids');
  }

  requestVerification(propertyId: string, verification: string){
      this.propertyService.propertyVerify(propertyId, verification)
      .subscribe((response: Property) =>{
        this.property = response;
      });
  }

  postQuestion(){
    this.qaId = uuid();
    const newQuestion = {
      QAId: this.qaId,
      userId: this.customerId,
      question: this.question,
      answer: "Not answered",
      QAstatus: "UNANSWERED"
    }
    this.qaService.postQuestion(newQuestion)
    .subscribe((question: any) =>{
    });
    window.location.reload();
  }

  onCompletion() {
    setTimeout(() =>
    {
      const url = "/";
      this.router.navigateByUrl(url);
    },2000);
  }


  ngOnInit() {
    this.customerId = this.activatedroute.snapshot.params['customerId'];
    this.customeronboardingService.getCustomerByUserIdFromFFDC(this.customerId)
      .subscribe((response: Customer) =>{
        this.apicustomer = response;
      });
      this.customeronboardingService.getCustomerById(this.customerId)
      .subscribe((response: DBCustomer) =>{
        this.customer = response;
      });
    this.getPropertyByCustomerId();
    this.propertyAdded = false;

    this.type = ["Coastal areas", "Inland areas", "Valley regions", "Hilly regions", "Plains"];

    this.qaService.getQuestionsByUserId(this.customerId)
    .subscribe((resp: QuestionAnswer[]) =>{
      this.questions = resp;
    });
  }
}

@Component({
  selector: 'dialog-legal-customer',
  templateUrl: './dialog-legal-customer.html',
})
export class DialogLegalCustomer {
  constructor(
    public dialogRef: MatDialogRef<DialogLegalCustomer>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
