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

const BuyerSchema = mongoose.Schema({
  branchCode: "string",
  title: "string",
  dateOfBirth: "string",
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
  fatcaDetails: {
    isUSResident: "boolean",
    isUSTaxResident: "boolean",
    tin: "string"
}
});
  
  var Buyer = module.exports = mongoose.model('Buyer', BuyerSchema);