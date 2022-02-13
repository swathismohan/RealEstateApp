const openIdClient = require("openid-client")
 
module.exports = function () {
    return openIdClient.Issuer.discover(process.env.AUTHORIZATION_WELLKNOWN || 'https://api.preprod.fusionfabric.cloud/login/v1/sandbox/.well-known/openid-configuration')
}
