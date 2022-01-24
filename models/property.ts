var mongoose = require('mongoose');

const PropertySchema = mongoose.Schema({
    customerId: "string",
    propertyName: "string",
    propertyId: "string",
    propertyNumber: "string",
    addline1: "string",
    addline2: "string",
    addline3: "string",
    addline4: "string",
    postalCode: "string",
    marketValue: "number",
    contactDetails: "string",
    status: "string",
    greenBelt: "string"
});

var Property = module.exports = mongoose.model('Property', PropertySchema);