const request = require('request'),
baseUrl = require('./../../env.json').baseUrl

module.exports.uest = request
module.exports.base = baseUrl
console.log(baseUrl, request, module.exports.uest)
