
module.exports = {
  baseUrl : process.env.BASE_URL || "https://api.preprod.fusionfabric.cloud",
  scope : process.env.SCOPE,
  client_id : process.env.CLIENT_ID || "faca5008-1952-4a92-a5d3-8c89c81249ab",
  client_secret : process.env.CLIENT_SECRET || "9b79d958-b47b-436d-b61e-281d4cdb84b1",
  key : process.env.KEYID,
  port : process.env.PORT || 3000,
  strong : (process.env.STRONG === 'True')
}