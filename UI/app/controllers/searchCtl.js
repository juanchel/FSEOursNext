var User = require('../models/UserRest');
var PrivateMessage = require('../models/PrivateMessageRest');
var PublicMessage = require('../models/MessageRest');
var SearchQuery = require('../models/SearchRest');

module.exports = function(_, io, participants, passport) {
  return {
    getSearch: function(req, res) {
      res.render("search");
    },
    
    search: function(req, res) {
      var SearchTypeMap = {
        0: SearchQuery.Type.USERS_BY_NAME,
        1: SearchQuery.Type.USERS_BY_STATUS,
        2: SearchQuery.Type.ANNOUNCEMENTS,
        3: SearchQuery.Type.PUBLIC_MESSAGES,
        4: SearchQuery.Type.PRIVATE_MESSAGES
      };
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
          res.json(200, {error: null, result: result});
        }
      });
    },
  };
};