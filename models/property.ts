var mongoose = require('mongoose');

const PropertySchema = mongoose.Schema({
    customerId: "string",
    propertyId: "string",
    propertyNumber: "string",
    addline1: "string",
    addline2: "string",
    addline3: "string",
    addline4: "string",
    postalCode: "string",
    marketValue: "number",
    contactDetails: "string",
    status: "boolean",
    greenBelt: "boolean"
});

var Property = module.exports = mongoose.model('Property', PropertySchema);