'use strict';

var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

var fetch = require('node-fetch')
// import fetch from 'node-fetch';

const express = require('express')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const config = require('./config.js')
const uuidv1 = require('uuid/v1')

const app = express()
global.Headers = fetch.Headers

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/contactlist');

//on connection
mongoose.connection.on('connected', () =>{
    console.log("Connected to DB //localhost:27017");
});

mongoose.connection.on('error', (err) =>{
    if(err){
        console.log('Error in DB connection: '+err);
    }
});

const Customer = require('./models/customer.ts');
const Buyer = require('./models/buyer.ts');
const DBCustomer = require('./models/dbcustomer.ts');
const DBBuyer = require('./models/dbbuyer.ts');
var Property = require('./models/property.ts');
var Bid = require('./models/bid.ts');

//port no
const port = 3000;

//adding middleware
app.use(cors());

//bpdy parser
app.use(bodyparser.json());

// any non undefined value in param will force manual client configuration
const issuer = require('./openIdIssuer')()
issuer.defaultHttpOptions = { timeout: 3500 }



let client
let access_token
global.strong = config.strong

issuer.then(issuer => {
  client = new issuer.Client({
    client_id: config.client_id, 
    client_secret: config.client_secret
  })
  app.listen(config.port, () => console.log(`Sample app listening on port ${config.port}!`))
})

// Login and get token
app.get('/', async (req, res, next) => {

  const grant = {
    grant_type: 'client_credentials',
    scope: config.scope
  }

  // Get token
  try {
    const token = await client.grant(grant)
    access_token = token.access_token
    console.log(access_token);
  } catch (e) {
    res.send('Error', e)
  }
})

app.post('/customer/api', async (req, res) => {

    const grant = {
        grant_type: 'client_credentials',
        scope: config.scope
      }
    
      // Get token
      try {
        const token = await client.grant(grant)
        access_token = token.access_token
        console.log(access_token);
      } catch (e) {
        res.send('Error', e)
      }

      let apicustomer = new Customer({
        branchCode: "00000001",
        title: "Doctor",
        dateOfBirth: "1997-11-20",
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        countryOfResidency: req.body.countryOfResidency,
        identification: req.body.identification,
        addresses: req.body.addresses,
        phoneNumbers: req.body.phoneNumbers,
        emailAddresses: req.body.emailAddresses,
        fatcaDetails: req.body.fatcaDetails
    });

console.log(apicustomer);

try {
    const response = await fetch("https://api.preprod.fusionfabric.cloud/retail-banking/customers/v1/personal-customers", {
      method: 'POST',
      body: JSON.stringify(apicustomer),
      headers: new Headers({
        Authorization: 'Bearer ' + access_token,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
    });

    if (!response.ok) {
        console.log("Inside Response Not OK");
        console.log(response);
      return res.send(response.statusText)
    }

    console.log(access_token);


    const results = await response.json();
    console.log(results.customerId);
    return res.json(results.customerId)
  } catch (err) {
    res.send(err)
  }
});

app.post('/buyer/api', async (req, res) => {

    const grant = {
        grant_type: 'client_credentials',
        scope: config.scope
      }
    
      // Get token
      try {
        const token = await client.grant(grant)
        access_token = token.access_token
        console.log(access_token);
      } catch (e) {
        res.send('Error', e)
      }

      let apibuyer = new Buyer({
        branchCode: "00000001",
        title: "Doctor",
        dateOfBirth: "1997-11-20",
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        countryOfResidency: req.body.countryOfResidency,
        identification: req.body.identification,
        addresses: req.body.addresses,
        phoneNumbers: req.body.phoneNumbers,
        emailAddresses: req.body.emailAddresses,
        fatcaDetails: req.body.fatcaDetails
    });

console.log(apibuyer);

try {
    const response = await fetch("https://api.preprod.fusionfabric.cloud/retail-banking/customers/v1/personal-customers", {
      method: 'POST',
      body: JSON.stringify(apibuyer),
      headers: new Headers({
        Authorization: 'Bearer ' + access_token,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
    });

    if (!response.ok) {
        console.log("Inside Response Not OK");
        console.log(response);
      return res.send(response.statusText)
    }

    console.log(access_token);


    const results = await response.json();
    console.log(results.customerId);
    return res.json(results.customerId)
  } catch (err) {
    res.send(err)
  }
});

//DB Routes
//get all customers
app.get('/customers', (req, res, next) => {
  DBCustomer.find(function(err, customers){
      res.json(customers);
  })
});

//post a new customer
app.post('/customer', (req, res, next) => {
  let newCustomer = new DBCustomer({
      title: req.body.title,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      countryOfResidency : req.body.countryOfResidency,
      identification: req.body.identification,
      addresses: req.body.addresses,
      phoneNumbers: req.body.phoneNumbers,
      emailAddresses: req.body.emailAddresses,
      userName: req.body.userName,
      password: req.body.password,
      customerId: req.body.customerId,
      legalSubscription: req.body.legalSubscription
  });

  newCustomer.save((err, result) => {
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  });
});

//get a customer using customerId
app.get('/customer/:customerId', (req, res, next) => {
    DBCustomer.findOne({customerId: req.params.customerId}, function(err, customer){
      if(err){
          res.json(err);
      }
      else{
          res.json(customer);
      }
  })
});

//get a customer using customerId
app.get('/customer/user/:userName/password/:password', (req, res, next) => {
    DBCustomer.findOne({userName: req.params.userName, password: req.params.password}, function(err, customer){
      if(err){
          res.json(err);
      }
      else{
          res.json(customer);
      }
  })
});

//delete a customer using customerId
app.delete('/customer/:customerId', (req, res, next) => {
    DBCustomer.deleteOne({customerId: req.params.customerId}, function(err, result){
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  })
});

//delete all customers
app.delete('/customers/', (req, res, next) => {
    DBCustomer.deleteMany( function(err, result){
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  })
});

//get all buyers
app.get('/buyers', (req, res, next) => {
    DBBuyer.find(function(err, buyers){
      res.json(buyers);
  })
});

//post a new buyer
app.post('/buyer', (req, res, next) => {
  let newBuyer = new DBBuyer({
      title: req.body.title,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      countryOfResidency : req.body.countryOfResidency,
      identification: req.body.identification,
      addresses: req.body.addresses,
      phoneNumbers: req.body.phoneNumbers,
      emailAddresses: req.body.emailAddresses,
      userName: req.body.userName,
      password: req.body.password,
      buyerId: req.body.buyerId,
      legalSubscription: req.body.legalSubscription
  });

  newBuyer.save((err, result) => {
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  });
});

// get a buyer using buyerId
app.get('/buyer/:buyerId', (req, res, next) => {
    DBBuyer.findOne({buyerId: req.params.buyerId}, function(err, buyer){
      if(err){
          res.json(err);
      }
      else{
          res.json(buyer);
      }
  })
});

//get a buyer using username and password
app.get('/buyer/user/:userName/password/:password', (req, res, next) => {
    DBBuyer.findOne({userName: req.params.userName, password: req.params.password}, function(err, buyer){
      if(err){
          res.json(err);
      }
      else{
          res.json(buyer);
      }
  })
});

// delete a buyer using buyerId
app.delete('/buyer/:buyerId', (req, res, next) => {
    DBBuyer.deleteOne({buyerId: req.params.buyerId}, function(err, result){
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  })
});

//delete all buyers
app.delete('/buyers/', (req, res, next) => {
    DBBuyer.deleteMany( function(err, result){
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  })
});

app.get('/properties', (req, res, next) => {
  Property.find(function(err, properties){
      res.json(properties);
  })
});

app.get('/properties/available', (req, res, next) => {
  Property.find({status: "AVAILABLE"}, function(err, properties){
      res.json(properties);
  })
});

app.post('/property', (req, res, next) => {
  let newProperty = new Property({
      customerId: req.body.customerId,
      propertyName: req.body.propertyName,
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
      greenBelt: req.body.greenBelt,
      verification: req.body.verification
  });

  newProperty.save((err) => {
      if(err){
          res.json({msg: 'Failed to add property'});
      }
      else{
          res.json({msg: 'Property added succesfully'});
      }
  });
});

app.get('/property/:id', (req, res, next) => {
  Property.findOne({_id: req.params.id}, function(err, property){
      if(err){
          res.json(err);
      }
      else{
          res.json(property);
      }
  })
});

//update property
app.put('/property/:propertyId/status/:status', (req, res, next) => {
  Property.findOneAndUpdate({propertyId: req.params.propertyId}, {status: req.params.status}, null , function(err, property){
      if(err){
          res.json(err);
      }
      else{
          res.json(property);
      }
  })
});

//request property verification
app.put('/property/:propertyId/verification/:verification', (req, res, next) => {
  Property.findOneAndUpdate({propertyId: req.params.propertyId}, {verification: req.params.verification}, null , function(err, property){
      if(err){
          res.json(err);
      }
      else{
          res.json(property);
      }
  })
});

app.get('/properties/:customerId', (req, res, next) => {
  Property.find({customerId: req.params.customerId}, function(err, property){
      if(err){
          res.json(err);
      }
      else{
          res.json(property);
      }
  })
});

app.delete('/property/:id', (req, res, next) => {
  Property.deleteOne({_id: req.params.id}, function(err, result){
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  })
});

app.delete('/properties/', (req, res, next) => {
  Property.deleteMany( function(err, result){
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  })
});

//get all bids
app.get('/bids', (req, res, next) => {
  Bid.find(function(err, bids){
      res.json(bids);
  })
});

//create new bid
app.post('/bid', (req, res, next) => {
  let newBid = new Bid({
      customerId: req.body.customerId,
      propertyId: req.body.propertyId,
      bidId: req.body.bidId,
      buyerId: req.body.buyerId,
      proposedAmount: req.body.proposedAmount,
      status: "Under process",
      buyerName: req.body.buyerName,
      buyerEmail: req.body.buyerEmail
  });

  newBid.save((err, result) => {
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  });
});

//bids using buyerID
app.get('/bids/:buyerId', (req, res, next) => {
  Bid.find({buyerId: req.params.buyerId}, function(err, bid){
      if(err){
          res.json(err);
      }
      else{
          res.json(bid);
      }
  })
});

app.get('/bid/:bidId', (req, res, next) => {
  Bid.find({bidId: req.params.bidId}, function(err, bid){
      if(err){
          res.json(err);
      }
      else{
          res.json(bid);
      }
  })
});


//bids on each property
app.get('/bids/property/:propertyId', (req, res, next) => {
  Bid.find({propertyId: req.params.propertyId}, function(err, bid){
      if(err){
          res.json(err);
      }
      else{
          res.json(bid);
      }
  })
});

//update bid
app.put('/bid/:bidId/status/:status', (req, res, next) => {
  Bid.findOneAndUpdate({bidId: req.params.bidId}, {status: req.params.status}, null , function(err, bid){
      if(err){
          res.json(err);
      }
      else{
          res.json(bid);
      }
  })
});


//delete bid using bidID
app.delete('/bid/:bidId', (req, res, next) => {
  Bid.deleteOne({bidId: req.params.bidId}, function(err, result){
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  })
});

//delete all bids
app.delete('/bids/', (req, res, next) => {
  Bid.deleteMany( function(err, result){
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  })
});