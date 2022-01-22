var mongoose = require('mongoose');

const BidSchema = mongoose.Schema({
    bidId: "string",
    propertyId: "string",
    customerId: "string",
    buyerId: "string",
    proposedAmount: "number",
    status: "string"
  });
  
  var Bid = module.exports = mongoose.model('Bid', BidSchema);