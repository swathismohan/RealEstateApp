import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Property } from '../models/property';
import { PropertyServiceService } from '../services/property-service.service';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.scss'],
  providers: [PropertyServiceService],
})
export class EditPropertyComponent implements OnInit {

  property!: Property;
  propertyId!: string;
  customerId!: string;
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
  propertyType!: string;
  type: string[] = ["Coastal areas", "Inland areas", "Valley regions", "Hilly regions", "Plains"];

  constructor(private router: Router,
    private activatedroute: ActivatedRoute,
    private propertyService: PropertyServiceService ) {
  }

  updateProperty(){

    const updatedProperty = {

    propertyName: this.propertyName,
    propertyNumber: this.propertyNumber,
    addline1: this.addline1,
    addline2: this.addline2,
    addline3: this.addline3,
    addline4: this.addline4,
    postalCode: this.postalCode,
    marketValue: this.marketValue,
    contactDetails: this.contactDetails,
    propertyType: this.propertyType,
    greenBelt: this.greenBelt,

    customerId: this.property.customerId,
    propertyId: this.property.propertyId,
    status: this.property.status,
    verification: this.property.verification,
    comment: this.property.comment

    }

    this.propertyService.editPropertyDetails(updatedProperty)
    .subscribe((resp: Property) =>{
      this.property = resp;


    });
    //redirect to customer profile
    const url = "/customer/"+ this.property.customerId;
    this.router.navigateByUrl(url);

  }

  ngOnInit(): void {
    this.propertyId = this.activatedroute.snapshot.params['propertyId'];
    this.propertyService.getPropertyById(this.propertyId)
      .subscribe((response: Property) =>{
        this.property = response;

        this.propertyName= response.propertyName;
        this.propertyNumber = response.propertyNumber;
        this.addline1 =  response.addline1;
        this.addline2 = response.addline2;
        this.addline3 = response.addline3;
        this.addline4 = response.addline4;
        this.postalCode = response.postalCode;
        this.marketValue = response.marketValue;
        this.contactDetails = response.contactDetails;
        this.propertyType = response.propertyType;
        this.greenBelt = response.greenBelt;
      });
  }
}
