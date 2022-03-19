var mongoose = require('mongoose');

const PropertySchema = mongoose.Schema({
    customerId: "string",
    propertyName: "string",
    propertyId: "string",
    propertyNumber: "string",
    addline1: "string",
    addline2: "string",
    addline3: "string",
    postalCode: "string",
    marketValue: "number",
    status: "string",
    greenBelt: "string",
    verification: "string",
    comment: "string",
    propertyType: "string",
    area: "string",
    areaUnit: "string",
    ownership: "string",
    notes: "string"
});

var Property = module.exports = mongoose.model('Property', PropertySchema);