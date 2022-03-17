var mongoose = require('mongoose');

const PaymentSchema = mongoose.Schema({
    entityId: "string",
    entityType: "string",
    transactionAmount: "string",
    transactionId: "string",
    transactionTime: "string",
    transactionDate: "string",
    status: "string"
});

var Payment = module.exports = mongoose.model('Payment', PaymentSchema);