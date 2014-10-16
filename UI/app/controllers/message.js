var User = require('../models/MessageRest');

module.exports = function(_, io, participants, passport, refreshAllUsers) {
  return{
    getWall : function(req, res) {
      res.render('wall', {message: ""});
    },

    getPM : function(req, res) {
      res.render('private', {message: ""});
    },
  }
};