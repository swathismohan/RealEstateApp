import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Property } from '../models/property';
import { PropertyServiceService } from '../services/property-service.service';
import {  FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.scss'],
  providers: [PropertyServiceService],
})
export class EditPropertyComponent implements OnInit {

  public propertyForm: FormGroup;
  propertyId!: string;
  property!: Property;

  constructor(private router: Router,
    private activatedroute: ActivatedRoute,
    private propertyService: PropertyServiceService ) {
      this.propertyForm = new FormGroup({
        propertyName: new FormControl(''),
        propertyNumber: new FormControl(''),
        addline1: new FormControl(''),
        addline2: new FormControl(''),
        addline3: new FormControl(''),
        addline4: new FormControl(''),
        postalCode: new FormControl(''),
        marketValue: new FormControl(''),
        contactDetails: new FormControl('')
    });
  }

  updateProperty(){
    // this.updatedProperty.propertyName = ;
    // this.updatedProperty.propertyNumber = ;
    // this.updatedProperty.addline1 = ;
    // this.updatedProperty.addline2 = this.propertyForm.value.addline2;
    // this.updatedProperty.addline3 = this.propertyForm.value.addline3;
    // this.updatedProperty.addline4 = this.propertyForm.value.addline4;
    // this.updatedProperty.postalCode = ;
    // this.updatedProperty.marketValue = ;
    // this.updatedProperty.contactDetails = ;


    // this.updatedProperty.greenBelt = ;
    // this.updatedProperty.propertyType = this.property.propertyType;
    // this.updatedProperty.status = this.property.status;
    // this.updatedProperty.verification = this.property.verification;
    // this.updatedProperty.comment = this.property.comment;
    // this.updatedProperty.customerId =  this.property.customerId;
    // this.updatedProperty.propertyId = this.propertyId;

    const updatedProperty = {

    propertyName: this.propertyForm.value.propertyName,
    propertyNumber: this.propertyForm.value.propertyNumber,
    addline1: this.propertyForm.value.addline1,
    addline2: this.propertyForm.value.addline2,
    addline3: this.propertyForm.value.addline3,
    addline4: this.propertyForm.value.addline4,
    postalCode: this.propertyForm.value.postalCode,
    marketValue: this.propertyForm.value.marketValue,
    contactDetails: this.propertyForm.value.contactDetails,

    customerId: this.property.customerId,
    propertyId: this.property.propertyId,
    status: this.property.status,
    greenBelt: this.property.greenBelt,
    verification: this.property.verification,
    comment: this.property.comment,
    propertyType: this.property.propertyType
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
        this.propertyForm.controls["propertyName"].setValue(this.property.propertyName);
        this.propertyForm.controls["propertyNumber"].setValue(this.property.propertyNumber);
        this.propertyForm.controls["addline1"].setValue(this.property.addline1);
        this.propertyForm.controls["addline2"].setValue(this.property.addline2);
        this.propertyForm.controls["addline3"].setValue(this.property.addline3);
        this.propertyForm.controls["addline4"].setValue(this.property.addline4);
        this.propertyForm.controls["postalCode"].setValue(this.property.postalCode);
        this.propertyForm.controls["marketValue"].setValue(this.property.marketValue);
        this.propertyForm.controls["contactDetails"].setValue(this.property.contactDetails);
      });
  }
}
