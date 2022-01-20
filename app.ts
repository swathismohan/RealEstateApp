//import modules
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

var app = express();

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/contactlist');

//on connection
mongoose.connection.on('connected', () =>{
    console.log("Connected to DB //localhost:27017");
});

mongoose.connection.on('error', (err:any) =>{
    if(err){
        console.log('Error in DB connection: '+err);
    }
});

var Customer = require('./models/customer');
var Buyer = require('./models/buyer');
var Property = require('./models/property');


//port no
const port = 3000;

//adding middleware
app.use(cors());

//bpdy parser
app.use(bodyparser.json());

//static files
//app.use(express.static(path.join(__dirname, 'public')));

//testing server
app.get('/', (req:any, res:any) => {
    res.send('Start Page');
});

//DB routes

app.get('/customers', (req:any, res:any, next:any) => {
    Customer.find(function(err:any, customers:any){
        res.json(customers);
    })
});

app.post('/customer', (req:any, res:any, next:any) => {
    let newCustomer = new Customer({
        customerId: req.body.customerId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        countryOfResidency: req.body.countryOfResidency,
        addline1: req.body.addline1,
        addline2: req.body.addline2,
        addline3: req.body.addline3,
        addline4: req.body.addline4,
        postalCode: req.body.postalCode,
        buildingNumber: req.body.buildingNumber,
        phoneNumber: req.body.phoneNumber,
        emailAddress: req.body.emailAddress
    });

    newCustomer.save((err:any, result:any) => {
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    });
});

app.get('/customer/:customerId', (req:any, res:any, next:any) => {
    Customer.findOne({customerId: req.params.customerId}, function(err:any, customer:any){
        if(err){
            res.json(err);
        }
        else{
            res.json(customer);
        }
    })
});

app.delete('/customer/:customerId', (req:any, res:any, next:any) => {
    Customer.deleteOne({customerId: req.params.customerId}, function(err:any, result:any){
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    })
});

app.delete('/customers/', (req:any, res:any, next:any) => {
    Customer.deleteMany( function(err:any, result:any){
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    })
});

app.get('/buyers', (req:any, res:any, next:any) => {
    Buyer.find(function(err:any, buyers: any){
        res.json(buyers);
    })
});

app.post('/buyer', (req:any, res:any, next:any) => {
    let newBuyer = new Buyer({
        buyerId: req.body.buyerId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        countryOfResidency: req.body.countryOfResidency,
        addline1: req.body.addline1,
        addline2: req.body.addline2,
        addline3: req.body.addline3,
        addline4: req.body.addline4,
        postalCode: req.body.postalCode,
        buildingNumber: req.body.buildingNumber,
        phoneNumber: req.body.phoneNumber,
        emailAddress: req.body.emailAddress
    });

    newBuyer.save((err:any, result:any) => {
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    });
});

app.get('/buyer/:buyerId', (req:any, res:any, next:any) => {
    Buyer.findOne({buyerId: req.params.buyerId}, function(err:any, buyer:any){
        if(err){
            res.json(err);
        }
        else{
            res.json(buyer);
        }
    })
});

app.delete('/buyer/:buyerId', (req:any, res:any, next:any) => {
    Buyer.deleteOne({buyerId: req.params.buyerId}, function(err:any, result:any){
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    })
});

app.get('/properties', (req:any, res:any, next:any) => {
    Property.find(function(err:any, properties: any){
        res.json(properties);
    })
});

app.get('/properties/available', (req:any, res:any, next:any) => {
    Property.find({status: "AVAILABLE"}, function(err:any, properties: any){
        res.json(properties);
    })
});

app.post('/property', (req:any, res:any, next:any) => {
    let newProperty = new Property({
        customerId: req.body.customerId,
        propertyId: req.body.propertyId,
        propertyNumber: req.body.propertyNumber,
        addline1: req.body.addline1,
        addline2: req.body.addline2,
        addline3: req.body.addline3,
        addline4: req.body.addline4,
        postalCode: req.body.postalCode,
        marketValue: req.body.marketValue,
        contactDetails: req.body.contactDetails,
        status: req.body.status,
        greenBelt: req.body.greenBelt
    });

    newProperty.save((err:any) => {
        if(err){
            res.json({msg: 'Failed to add property'});
        }
        else{
            res.json({msg: 'Property added succesfully'});
        }
    });
});

app.get('/property/:id', (req:any, res:any, next:any) => {
    Property.findOne({_id: req.params.id}, function(err:any, property:any){
        if(err){
            res.json(err);
        }
        else{
            res.json(property);
        }
    })
});

app.get('/properties/:customerId', (req:any, res:any, next:any) => {
    Property.find({customerId: req.params.customerId}, function(err:any, property:any){
        if(err){
            res.json(err);
        }
        else{
            res.json(property);
        }
    })
});

app.delete('/property/:id', (req:any, res:any, next:any) => {
    Property.deleteOne({_id: req.params.id}, function(err:any, result:any){
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    })
});

app.listen(port, () => {
    console.log("Server started at port: "+ port);
});