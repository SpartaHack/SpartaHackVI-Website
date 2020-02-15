const request = require('request'),
baseUrl = require('./../../env.json').baseUrl
console.log(baseUrl, request, module.exports.uest)

module.exports.uest = request
module.exports.base = baseUrl
