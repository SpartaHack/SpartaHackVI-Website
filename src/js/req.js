const request = require('request'),
baseUrl = require('./../../env.json').baseurl

module.exports.uest = request
module.exports.base = baseUrl
// console.log(baseUrl, request, module.exports.uest)
