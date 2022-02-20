import { Component, OnInit, Inject } from '@angular/core';
import { Property } from '../models/property';
import { CustomeronboardingServiceService } from '../services/customeronboarding-service.service';
import { PropertyServiceService } from '../services/property-service.service';
import { DBCustomer } from '../models/customer';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { v4 as uuid } from 'uuid';
import { DialogData } from '../buyerprofile/buyerprofile.component';

@Component({
  selector: 'app-customerprofile',
  templateUrl: './customerprofile.component.html',
  styleUrls: ['./customerprofile.component.scss'],
  providers: [CustomeronboardingServiceService, PropertyServiceService],
})
export class CustomerprofileComponent implements OnInit {

  subscription!: boolean;

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

  public customer!: DBCustomer;
  constructor(private customeronboardingService : CustomeronboardingServiceService, private router: Router, private activatedroute: ActivatedRoute,
     private propertyService: PropertyServiceService, public dialog: MatDialog) { }

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
      verification: "NOT REQUESTED",
      comment: "",
      propertyType: this.propertyType
    }
    this.propertyService.addProperty(newProperty)
      .subscribe((property: any) =>{
        this.properties.push(property);
      });
    window.location.reload();
    this.propertyAdded = true;
  }

  getPropertyByCustomerId(){
    this.propertyService.getPropertyByCustomerId(this.customerId)
      .subscribe((response: Property[]) =>{
        this.properties = response;
      });
    console.log('property', this.properties);
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

  ngOnInit() {
    this.customerId = this.activatedroute.snapshot.params['customerId'];
    this.customeronboardingService.getCustomerById(this.customerId)
      .subscribe((response: DBCustomer) =>{
        this.customer = response;
      });
    this.getPropertyByCustomerId();
    this.propertyAdded = false;

    this.type = ["Coastal areas", "Inland areas", "Valley regions", "Hilly regions", "Plains"];
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
