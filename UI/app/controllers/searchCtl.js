var User = require('../models/UserRest');
var PrivateMessage = require('../models/PrivateMessageRest');
var PublicMessage = require('../models/MessageRest');
var SearchForUsername = require('../models/SearchRest');

module.exports = function(_, io, participants, passport) {
    return {
      getSearch: function(req, res) {
        res.render("search", {message: req.flash('searchMessage')});
      console.log("I'm searching username!");
    },
    
    
    getSearchedUsernames: function(req, res){
      var me = req.user.local.name;
      SearchForUsername.getSearchedUsername(me, function(error, searchedUsernames){
        var errorMessages = req.flash('errorMessage');
        if (error) {
          errorMessages.push(error);
        }
        var searchedUsernamesBuffer = [];

        for (var i = 0; i < searchedUsernames.length; ++i) {
          var searchedUser = searchedUsernames[i];
          var author = searchedUser.author;
          if (author === me) {
            searchedUsernamesBuffer.push(me + ": " + searchedUser.content);
          }else {
            console.warn("searchedUser is wrong");
          }
        }
        
        res.render("searchedUser", {
          error_messages: errorMessages,
          username: me,
          searchedUsernames: searchedUsernamesBuffer,
        });
      });
    },
    
    postSearchForUsername: function(req, res, next) {
      var user_name = req.session.passport.user.user_name;
      SearchForUsername.send(user_name, req.body.keyword, function(error, groups) {
      if (error){
          next(error);
      } else {
          res.render('search', {groups : groups});
      }
      });
  },

    };
};