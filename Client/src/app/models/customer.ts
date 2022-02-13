export interface Address {
  addressType: 'RESIDENTIAL';
  country: 'US';
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  line5: string;
  postalCode: string;
  buildingNumber: string;

}
export interface PhoneNumber {
  type: 'MOBILE';
  number: string;

}
export interface EmailAddress {
  type: 'OTHER';
  address: string;

}

export interface Customer {
  firstName: string;
  lastName: string;
  gender: string;
  countryOfResidency : string;
  identification: {
    type: string;
    id: string;
  },
  addresses: Address[];
  phoneNumbers: PhoneNumber[];
  emailAddresses: EmailAddress[];
  customerId: string;
}

export interface DBCustomer {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  countryOfResidency : string;
  identification: {
    type: string;
    id: string;
  },
  addresses: Address[];
  phoneNumbers: PhoneNumber[];
  emailAddresses: EmailAddress[];
  userName: string;
  password: string;
  customerId: string;
  legalSubscription: boolean;
}
