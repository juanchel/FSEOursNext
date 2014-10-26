var User = require('../models/UserRest');
var PrivateMessage = require('../models/PrivateMessageRest');
var PublicMessage = require('../models/MessageRest');
var SearchQuery = require('../models/SearchRest');

module.exports = function(_, io, participants, passport) {
    return {
      getSearch: function(req, res) {
        res.render("search", {message: req.flash('searchMessage')});
        console.log("I'm searching username!");
      },
    
    postSearchForUsername: function(req, res, next) {
      var user_name = req.session.passport.user.user_name;
      var searchQuery = new SearchQuery(user_name, req.body.searchForUsername);
      searchQuery.send(function(error, groups) {
        console.log(JSON.stringify(groups));
        if (error){
          next(error);
        } else {
          res.render('search', {groups : groups});
        }
      });
    },

  };
};