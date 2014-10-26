var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');
var utils = require("../utils");
var User = require("./UserRest");

function SearchForUsername(searcher,keyword) {
  this.searcher = searcher;
  this.keyword = keyword;
}

SearchForUsername.prototype.send = function(callback) {
  var options = {
      url : rest_api.searchForUsername + this.keyword,
      body : {
        'keyword' : this.keyword
      },
      json : true
    };
  console.log(this);  
  
    console.info("send searchForUsername options: " + JSON.stringify(options));

    request.post(options, function(error, response, body) {
      if (error) {
        callback(error);
      } else if (response.statusCode !== 201) {
        callback(JSON.stringify(response.body));
      }
        callback(null);
    });
  };
  
SearchForUsername.getSearchedUsername = function(callback) {
    request(rest_api.searchForUsername, {json:true}, function(err, res, body) {
      if (err){
        console.warn("There is an error: " + err);
      }else if (res.statusCode !== 200) {
        callback(JSON.stringify(body), null);
      } else if(res.statusCode === 200) {

        var searchedUsernames = [];
        for (var i = 0; i < body.length; ++i) {
          var item = body[i];
          searchedUsernames.push(new searchedUsernames(item.keyword));
          console.log(searchedUsernames);
        }
        
        callback(null, searchedUsernames);
      }
      
    });
  };

module.exports = SearchForUsername;
