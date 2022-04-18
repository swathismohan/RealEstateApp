var mongoose = require('mongoose');

const BidSchema = mongoose.Schema({
    bidId: "string",
    propertyId: "string",
    customerId: "string",
    buyerId: "string",
    proposedAmount: "string",
    status: "string",
    buyerName: "string",
    buyerEmail: "string",
    propertyName: "string",
    active: "boolean"
  });
  
  var Bid = module.exports = mongoose.model('Bid', BidSchema);