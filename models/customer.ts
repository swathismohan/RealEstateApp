var mongoose = require('mongoose');

var AddressSchema = mongoose.Schema({
  addressType: "string",
  country: "string",
  line1: "string",
  line2: "string",
  line3: "string",
  line4: "string",
  line5: "string",
  postalCode: "string",
  buildingNumber: "string"
});

var PhoneNumberSchema = mongoose.Schema({
  type: "string",
  number: "string"
});

var EmailAddressSchema = mongoose.Schema({
  type: "string",
  address: "string"
});

const CustomerSchema = mongoose.Schema({
  title: "string",
  firstName: "string",
  lastName: "string",
  gender: "string",
  countryOfResidency : "string",
  identification: {
    type: {type: "string"},
    id: "string"
  },
  addresses: [AddressSchema],
  phoneNumbers: [PhoneNumberSchema],
  emailAddresses: [EmailAddressSchema],
});

const DBCustomerSchema = mongoose.Schema({
  title: "string",
  firstName: "string",
  lastName: "string",
  gender: "string",
  countryOfResidency : "string",
  identification: {
    type: {type: "string"},
    id: "string"
  },
  addresses: [AddressSchema],
  phoneNumbers: [PhoneNumberSchema],
  emailAddresses: [EmailAddressSchema],
  userName: "string",
  password: "string",
  customerId: "string",
  legalSubscription: "boolean"
});

var Customer = module.exports = mongoose.model('Customer', DBCustomerSchema);