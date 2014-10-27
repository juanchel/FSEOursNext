var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');
var utils = require("../utils");
var User = require("./UserRest");

function SearchQuery(type, searcher, keywords) {
  this.searcher = searcher;
  this.keywords = keywords;
  this.type = type;
}

SearchQuery.Type = {
  USERS_BY_NAME : 0,
  USERS_BY_STATUS : 1,
  ANNOUNCEMENTS : 2,
  PUBLIC_MESSAGES : 3,
  PRIVATE_MESSAGES : 4
};

SearchQuery.prototype.send = function(callback) {
  var url;
  switch (this.type) {
  case SearchQuery.Type.USERS_BY_NAME:
    url = rest_api.searchForUsername;
    break;
  case SearchQuery.Type.USERS_BY_STATUS:
    url = rest_api.searchForStatus;
    break;
  case SearchQuery.Type.ANNOUNCEMENTS:
    url = rest_api.searchForAnnouncement;
    break;
  case SearchQuery.Type.PUBLIC_MESSAGES:
    url = rest_api.searchForWall;
    break;
  case SearchQuery.Type.PRIVATE_MESSAGES:
    url = rest_api.searchForPrivateMessage.replace("{username}", this.searcher);
    break;
  default:
    console.warn("SearchQuery aborted, unknown type.");
    callback("unknown SearchQuery type");
  }
  
  var stopwords = ['a','able','about','across','after','all','almost','also','am','among','an','and','any','are','as','at','be','because','been','but','by','can','cannot','could','dear','did','do','does','either','else','ever','every','for','from','get','got','had','has','have','he','her','hers','him','his','how','however','i','if','in','into','is','it','its','just','least','let','like','likely','may','me','might','most','must','my','neither','no','nor','not','of','off','often','on','only','or','other','our','own','rather','said','say','says','she','should','since','so','some','than','that','the','their','them','then','there','these','they','this','tis','to','too','twas','us','wants','was','we','were','what','when','where','which','while','who','whom','why','will','with','would','yet','you','your'];
  var spllittedKeyword = this.keywords.split(" ");
  for(var i =0; i <= spllittedKeyword.length; i++){
    if(stopwords.indexOf(spllittedKeyword[i]) >= 0){
      spllittedKeyword.splice(stopwords.indexOf(spllittedKeyword[i]),1," ");
    }
  }
  var newKeyword = spllittedKeyword.join(" ");
  
  var options = {
    url : url,
    body : {
      'content' : newKeyword
    },
    json : true
  };  
  
  console.info("send search options: " + JSON.stringify(options));

  request.post(options, function(error, response, body) {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      callback(JSON.stringify(response.body), null);
    }
    callback(null, body);
  });
};

module.exports = SearchQuery;
