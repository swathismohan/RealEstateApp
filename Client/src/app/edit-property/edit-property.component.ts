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
  postalCode!: string;
  marketValue!: number;
  status!: string;
  greenBelt!: string;
  propertyType!: string;
  area: string;
  areaUnit: string;
  ownership: string;
  notes: string;

  areaunits: string[] = ["sq ft","Cents","Acre", "Hectare"];
  type: string[] = ["Land", "Apartment", "Villa", "House", "Housing Plot"];
  ownershiptype: string[] = ["Sole/ Individual", "Family owned", "Joint"];

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
    postalCode: this.postalCode,
    marketValue: this.marketValue,
    propertyType: this.propertyType,
    greenBelt: this.greenBelt,
    area: this.area,
    areaUnit: this.areaUnit,
    ownership: this.ownership,
    notes: this.notes,

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
        this.postalCode = response.postalCode;
        this.marketValue = response.marketValue;
        this.propertyType = response.propertyType;
        this.greenBelt = response.greenBelt;
        this.area = response.area;
        this.areaUnit = response.areaUnit;
        this.ownership = response.ownership;
        this.notes = response.notes;

      });
  }
}
