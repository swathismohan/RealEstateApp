var mongoose = require('mongoose');

const BuyerSchema = mongoose.Schema({
    userName: "string",
    password: "string",
    buyerId: "string",
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
  
  var Buyer = module.exports = mongoose.model('Buyer', BuyerSchema);