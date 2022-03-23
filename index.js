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

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
    user: 'superswathim@gmail.com',
    pass: 'SuperSwathi'
  }
});


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
const QuestionAnswer = require('./models/qa.ts');
const Payment = require('./models/payment.ts');

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

app.get('/user/:userid', async (req, res, next) => {

  const grant = {
    grant_type: 'client_credentials',
    scope: config.scope
  }
  // Get token
  try {
    const token = await client.grant(grant)
    access_token = token.access_token
    // console.log(access_token);
  } catch (e) {
    res.send(e)
  }

  try {
    const response = await fetch(config.baseUrl + "/retail-banking/customers/v1/personal-customers/"+req.params.userid, {
      method: 'get',
      headers: new Headers({
        Authorization: 'Bearer ' + access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });

    if (!response.ok) {
      console.log(response);
    return res.send(response.statusText)
  }

  const results = await response.json();
  return res.json(results)
} catch (err) {
  res.send(err)
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
        // console.log(access_token);
      } catch (e) {
        res.send('Error', e)
      }

      let apicustomer = new Customer({
        branchCode: "00000001",
        title: req.body.title,
        dateOfBirth: req.body.dateOfBirth,
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
        console.log(response);
      return res.send(response.statusText)
    }

    const results = await response.json();
    console.log("Posted Customer to FFDC API with customerId: "+ results.customerId);
    return res.json(results.customerId)
  } catch (err) {
    res.send(err)
  }
});

//update ffdc customer
app.put('/updateuser/api/:userid', async (req, res) => {

  const grant = {
      grant_type: 'client_credentials',
      scope: config.scope
    }
  
    // Get token
    try {
      const token = await client.grant(grant)
      access_token = token.access_token
      // console.log(access_token);
    } catch (e) {
      res.send('Error', e)
    }

    let apiuser = {
      branchCode: "00000001",
      title: req.body.title,
      dateOfBirth: req.body.dateOfBirth,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      countryOfResidency: req.body.countryOfResidency,
      identification: req.body.identification,
      addresses: req.body.addresses,
      phoneNumbers: req.body.phoneNumbers,
      emailAddresses: req.body.emailAddresses,
      fatcaDetails: req.body.fatcaDetails,
      customerId: req.params.userid
  };

  console.log(apiuser);

try {
  const response = await fetch("https://api.preprod.fusionfabric.cloud/retail-banking/customers/v1/personal-customers", {
    method: 'PUT',
    body: JSON.stringify(apiuser),
    headers: new Headers({
      Authorization: 'Bearer ' + access_token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    })
  });

  if (!response.ok) {
      console.log(response);
    return res.send(response.statusText)
  }

  const results = await response.json();
  console.log("Updated Customer in FFDC API with customerId: "+ results.customerId);
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
        // console.log(access_token);
      } catch (e) {
        res.send('Error', e)
      }

      let apibuyer = new Buyer({
        branchCode: "00000001",
        title: req.body.title,
        dateOfBirth: req.body.dateOfBirth,
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
        console.log(response);
      return res.send(response.statusText)
    }

    const results = await response.json();
    console.log("Posted Buyer to FFDC API with customerId: "+ results.customerId);
    return res.json(results.customerId)
  } catch (err) {
    res.send(err)
  }
});

//make payment
app.post('/estateaide/payments', async (req, res) => {

  const grant = {
      grant_type: 'client_credentials',
      scope: config.scope
    }
  
    // Get token
    try {
      const token = await client.grant(grant)
      access_token = token.access_token
      // console.log(access_token);
    } catch (e) {
      res.send('Error', e)
    }

    let payment = {
      fromAccountId: req.body.fromAccountId,
      toAccountId: "0001000004001",
      payee: "Estate Aide",
      amount: {
        amount: req.body.amount,
        currency: "USD"
      },
      narrative: req.body.narrative
      };

try {
  const response = await fetch("https://api.preprod.fusionfabric.cloud/retail-banking/payments/v1/fund-transfers/external", {
    method: 'POST',
    body: JSON.stringify(payment),
    headers: new Headers({
      Authorization: 'Bearer ' + access_token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    })
  });

  if (!response.ok) {
      console.log(response);
    return res.send(response)
  }

  const results = await response.json();
  console.log("Payment made using FFDC API: "+ results.transactionId);
  console.log(results);
  res.send(results);
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
      legalSubscription: req.body.legalSubscription,
      active: req.body.active
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

//change legal subscription status
app.put('/customer/:customerId/getlegalsubscription', (req, res, next) => {
  DBCustomer.findOneAndUpdate({customerId: req.params.customerId}, {legalSubscription: true}, null , function(err, customer){
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
      legalSubscription: req.body.legalSubscription,
      active: req.body.active
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

//change legal subscription status
app.put('/buyer/:buyerId/getlegalsubscription', (req, res, next) => {
  DBBuyer.findOneAndUpdate({buyerId: req.params.buyerId}, {legalSubscription: true}, null , function(err, buyer){
      if(err){
          res.json(err);
      }
      else{
          res.json(buyer);
      }
  })
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
  Property.find({status: "AVAILABLE", verification: { $ne: "REJECTED" }, active: true}, function(err, properties){
      res.json(properties);
  })
});

app.get('/availableverifiedproperties', (req, res, next) => {
  Property.find({status: "AVAILABLE", verification: "VERIFIED", active: true}, function(err, properties){
      res.json(properties);
  })
});

app.get('/properties/requested', (req, res, next) => {
  Property.find({verification: "VERIFICATION REQUESTED"}, function(err, properties){
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
      postalCode: req.body.postalCode,
      marketValue: req.body.marketValue,
      status: req.body.status,
      greenBelt: req.body.greenBelt,
      verification: req.body.verification,
      comment: req.body.comment,
      propertyType: req.body.propertyType,
      area: req.body.area,
      areaUnit: req.body.areaUnit,
      ownership: req.body.ownership,
      notes: req.body.notes,
      active: req.body.active
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

app.get('/property/:propertyId', (req, res, next) => {
  Property.findOne({propertyId: req.params.propertyId}, function(err, property){
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
        console.log(property);
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

//request property verification
app.put('/property/:propertyId/verified', (req, res, next) => {
  Property.findOneAndUpdate({propertyId: req.params.propertyId}, {verification: req.body.verification, comment: req.body.comment}, null , function(err, property){
      if(err){
          res.json(err);
      }
      else{
          res.json(property);
      }
  })
});

//edit property details
app.put('/updateproperty/:propertyId', (req, res, next) => {
  Property.findOneAndUpdate(
    {
      propertyId: req.params.propertyId
    }, 
    { 
      propertyName: req.body.propertyName,
      propertyNumber: req.body.propertyNumber,
      addline1: req.body.addline1,
      addline2: req.body.addline2,
      addline3: req.body.addline3,
      postalCode: req.body.postalCode,
      marketValue: req.body.marketValue,
      verification: req.body.verification,
      area: req.body.area,
      areaUnit: req.body.areaUnit,
      ownership: req.body.ownership,
      notes: req.body.notes
    },
      null , function(err, property){
      if(err){
          res.json(err);
      }
      else{
          res.json(property);
      }
  })
});

// define a sendmail endpoint, which will send emails and response with the corresponding status
app.post("/sendmail", (req, res) => {
  var mailOptions = {
    from: 'superswathim@gmail.com',
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
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

//get property from bidID
app.get('/propertybybid/:bidId', (req, res, next) => {
  Property.find({bidId: req.params.bidId}, function(err, property){
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
      buyerEmail: req.body.buyerEmail,
      propertyName: req.body.propertyName,
      active: req.body.active
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

app.get('/bids/active/:buyerId', (req, res, next) => {
  Bid.find({buyerId: req.params.buyerId, active: true}, function(err, bid){
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
app.get('/bids/allproperty/:propertyId', (req, res, next) => {
  Bid.find({propertyId: req.params.propertyId}, function(err, bid){
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
  Bid.find({propertyId: req.params.propertyId, status: "Under process", active: true}, function(err, bid){
      if(err){
          res.json(err);
      }
      else{
          res.json(bid);
      }
  })
});

//accepted bids on each property
app.get('/bids/accepted/:propertyId', (req, res, next) => {
  Bid.find({propertyId: req.params.propertyId, status: "ACCEPTED", active: true}, function(err, bid){
      if(err){
          res.json(err);
      }
      else{
          res.json(bid);
      }
  })
});

//declined bids on each property
app.get('/bids/declined/:propertyId', (req, res, next) => {
  Bid.find({propertyId: req.params.propertyId, status: "DECLINED", active: true}, function(err, bid){
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

//post a new question
app.post('/question', (req, res, next) => {
  let newQuestion = new QuestionAnswer({
      userId: req.body.userId,
      QAId: req.body.QAId,
      question: req.body.question,
      answer: req.body.answer,
      QAstatus : req.body.QAstatus
  });

  newQuestion.save((err, result) => {
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  });
});

//get all Q&A
app.get('/questions', (req, res, next) => {
  QuestionAnswer.find(function(err, questions){
      res.json(questions);
  })
});

//get all questions by user
app.get('/questions/:userId', (req, res, next) => {
  QuestionAnswer.find({userId: req.params.userId}, function(err, questions){
      if(err){
          res.json(err);
      }
      else{
          res.json(questions);
      }
  })
});

//get all unanswered questions
app.get('/questions/status/unanswered', (req, res, next) => {
  QuestionAnswer.find({QAstatus: "UNANSWERED"}, function(err, questions){
      res.json(questions);
  })
});

//add answer to the posted question
app.put('/abc/answered', (req, res, next) => {
  QuestionAnswer.findOneAndUpdate({QAId: req.body.QAId}, {answer: req.body.answer, QAstatus: "ANSWERED"}, null , function(err, question){
      if(err){
          res.json(err);
      }
      else{
          res.json(question);
      }
  })
});


//delete all questions
app.delete('/questions/', (req, res, next) => {
  QuestionAnswer.deleteMany( function(err, result){
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  })
});

//get OTP

app.post('/receive/otp/', async (req, res) => {

  const grant = {
      grant_type: 'client_credentials',
      scope: config.scope
    }
  
    // Get token
    try {
      const token = await client.grant(grant)
      access_token = token.access_token
      // console.log(access_token);
    } catch (e) {
      res.send('Error', e)
    }

    let otpBody = {
      serviceId : "VA656532b480ff52f8e4cc15b68466a164",
      to: req.body.to,
      message: "Sending OTP",
      channel: "sms"
    
    };

try {
  const response = await fetch("https://api.preprod.fusionfabric.cloud/text-message/otp/v1/send", {
    method: 'POST',
    body: JSON.stringify(otpBody),
    headers: new Headers({
      Authorization: 'Bearer ' + access_token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    })
  });

  if (!response.ok) {
      console.log(response);
    return res.send(response.statusText)
  }

  const results = await response.json();
  console.log("OTP send successfully with otp id: "+ results.otpId);
  return res.json(results.otpId)
} catch (err) {
  res.send(err)
}
});

//verify OTP
app.post('/otp/verifyotp/', async (req, res) => {

  const grant = {
      grant_type: 'client_credentials',
      scope: config.scope
    }
  
    // Get token
    try {
      const token = await client.grant(grant)
      access_token = token.access_token
      // console.log(access_token);
    } catch (e) {
      res.send('Error', e)
    }

    let otpVerifyBody = {
      otpId: req.body.otpId,
      to: req.body.to,
      passcode: req.body.passcode
    };

try {
  const response = await fetch("https://api.preprod.fusionfabric.cloud/text-message/otp/v1/verify", {
    method: 'POST',
    body: JSON.stringify(otpVerifyBody),
    headers: new Headers({
      Authorization: 'Bearer ' + access_token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    })
  });

  if (!response.ok) {
      console.log(response);
    return res.send(response.statusText)
  }

  const results = await response.json();
  console.log("OTP verification status: "+ results.status);
  return res.json(results.status)
} catch (err) {
  res.send(err)
}
});


//post payment request
app.post('/payment/info', (req, res, next) => {
  let newPayment = new Payment({
    entityId: req.body.entityId,
    entityType: req.body.entityType,
    transactionAmount: req.body.transactionAmount,
    transactionId: req.body.transactionId,
    transactionTime: req.body.transactionTime,
    transactionDate: req.body.transactionDate,
    status: "PENDING"
  });

  console.log(newPayment);
  newPayment.save((err, result) => {
      if(err){
          res.json(err);
      }
      else{
          res.json(result);
      }
  });
});

//get all payments
app.get('/payments', (req, res, next) => {
  Payment.find(function(err, payments){
      res.json(payments);
  })
});

//delete all payments
app.delete('/payments', (req, res, next) => {
  Payment.deleteMany( function(err, result){
    if(err){
        res.json(err);
    }
    else{
        res.json(result);
    }
})
});

//get all PENDING payment requests
app.get('/payments/status/pending', (req, res, next) => {
  Payment.find({status: "PENDING"}, function(err, payments){
      res.json(payments);
  })
});

//VERIFY payment request
app.put('/payment/status/verify', (req, res, next) => {
  Payment.findOneAndUpdate({transactionId: req.body.transactionId}, {status: "VERIFIED"}, null , function(err, payment){
      if(err){
          res.json(err);
      }
      else{
          res.json(payment);
      }
  })
});

//deactivate models

app.put('/activate/customer', (req, res, next) => {
  DBCustomer.findOneAndUpdate({customerId: req.body.customerId}, {active: req.body.active}, null , function(err, customer){
      if(err){
          res.json(err);
      }
      else{
          res.json(customer);
      }
  })
});

app.put('/activate/buyer', (req, res, next) => {
  DBBuyer.findOneAndUpdate({buyerId: req.body.buyerId}, {active: req.body.active}, null , function(err, buyer){
      if(err){
          res.json(err);
      }
      else{
          res.json(buyer);
      }
  })
});

app.put('/activate/property', (req, res, next) => {
  Property.findOneAndUpdate({propertyId: req.body.propertyId}, {active: req.body.active}, null , function(err, property){
      if(err){
          res.json(err);
      }
      else{
          res.json(property);
      }
  })
});

app.put('/activate/bid', (req, res, next) => {
  Bid.findOneAndUpdate({bidId: req.body.bidId}, {active: req.body.active}, null , function(err, bid){
      if(err){
        console.log("error");
          res.json(err);
      }
      else{
        console.log("no error");
          res.json(bid);
      }
  })
});


