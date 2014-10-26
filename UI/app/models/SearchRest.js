var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');
var utils = require("../utils");
var User = require("./UserRest");

function SearchQuery(searcher,keyword) {
  this.searcher = searcher;
  this.keyword = keyword;
}

SearchQuery.prototype.send = function(callback) {
  var options = {
      url : rest_api.searchForUsername,
      body : {
        'content' : this.keyword
      },
      json : true
    };
  console.log(this);  
  
    console.info("send searchForUsername options: " + JSON.stringify(options));

    request.post(options, function(error, response, body) {
      if (error) {
        callback(error, null);
      } else if (response.statusCode !== 201) {
        callback(JSON.stringify(response.body), null);
      }
        callback(null, body);
    });
  };

module.exports = SearchQuery;
