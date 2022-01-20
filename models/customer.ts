var mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
  customerId: "string",
  firstName: "string",
  lastName: "string",
  countryOfResidency: "string",
  addline1: "string",
  addline2: "string",
  addline3: "string",
  addline4: "string",
  postalCode: "string",
  buildingNumber: "string",
  phoneNumber: "string",
  emailAddress: "string"
});

var Customer = module.exports = mongoose.model('Customer', CustomerSchema);