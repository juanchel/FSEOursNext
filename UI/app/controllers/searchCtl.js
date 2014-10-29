var User = require('../models/UserRest');
var PrivateMessage = require('../models/PrivateMessageRest');
var PublicMessage = require('../models/MessageRest');
var SearchQuery = require('../models/SearchRest');

var SearchTypeMap = {
    0: SearchQuery.Type.USERS_BY_NAME,
    1: SearchQuery.Type.USERS_BY_STATUS,
    2: SearchQuery.Type.ANNOUNCEMENTS,
    3: SearchQuery.Type.PUBLIC_MESSAGES,
    4: SearchQuery.Type.PRIVATE_MESSAGES
};

function isOnline(participants, user) {
  for (var id in participants.online) {
    if (participants.online.hasOwnProperty(id)) {
      var username = participants.online[id].userName;
      if (username === user) {
        return true;
      }
    }
  }
  
  return false;
}

function splitResultList(type, results, participants, me) {
  var onlineResults = [];
  var offlineResults = [];
  for (var i = 0; i < results.length; ++i) {
    var result = results[i];
    var username = null;
    switch (type) {
    case SearchQuery.Type.USERS_BY_NAME:
    case SearchQuery.Type.USERS_BY_STATUS:
      username = result.userName;
      break;
    case SearchQuery.Type.ANNOUNCEMENTS:
    case SearchQuery.Type.PUBLIC_MESSAGES:
      username = result.author;
      break;
    case SearchQuery.Type.PRIVATE_MESSAGES:
      if (result.author === me) {
        username = result.target;
      } else if (result.target === me) {
        username = result.authro;
      } else {
        console.warn("unrelated message returned in private message search: " + 
            JSON.stringify(result));
      }
      break;
    default:
      break;
    }
    if (username) {
      if (isOnline(participants, username)) {
        onlineResults.push(result);
      } else {
        offlineResults.push(result);
      }
    }
  }
  
  return {online: onlineResults, offline: offlineResults};
}

module.exports = function(_, io, participants, passport) {
  return {
    getSearch: function(req, res) {
      res.render("search");
    },
    
    search: function(req, res) {
      var searchType = SearchTypeMap[req.body.type];
      if (searchType === undefined) {
        res.json(400, {error: "unknown search type", result: null});
        return;
      }
      var user_name = req.session.passport.user.user_name;
      var searchQuery = new SearchQuery(searchType, user_name, req.body.keywords);
      searchQuery.send(function(error, result) {
        console.log("query error: " + error);
        console.log("query result: " + JSON.stringify(result));
        if (error){
          res.json(200, {error: error, result: null});
        } else {
          res.json(200, {
            error: null, 
            result: splitResultList(searchType, result, participants, user_name)
          });
        }
      });
    },
  };
};