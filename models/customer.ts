var mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
  userName: "string",
  password: "string",
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
  emailAddress: "string",
  legalSubscription: "boolean"
});

var Customer = module.exports = mongoose.model('Customer', CustomerSchema);