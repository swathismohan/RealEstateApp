
module.exports = {
  baseUrl : process.env.BASE_URL || "https://api.preprod.fusionfabric.cloud",
  scope : process.env.SCOPE,
  client_id : process.env.CLIENT_ID || "604b90e3-99ac-40fb-a0dc-7d77065ae6ef",
  client_secret : process.env.CLIENT_SECRET || "b62346bd-0f15-4bc9-9869-558245192908",
  key : process.env.KEYID,
  port : process.env.PORT || 3000,
  strong : (process.env.STRONG === 'True')
}