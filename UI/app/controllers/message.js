var PrivateMessage = require('../models/PrivateMessageRest');

module.exports = function(_, io, participants, passport) {
  return {
    getAllPrivateMessages : function(req, res) {
      PrivateMessage.getMessages(req.user.local.name, req.param('chatbuddy'), 
          function(error, messages) {
            
      });
    },
    
    sendMessage: function(req, res) {
      var message = new PrivateMessage(req.user.local.name, 
          req.param('target'), req.param('content'));
      message.send(function(error_message) {
        if (error_message) {
          req.flash('errorMessage', error_message);
        }
        res.redirect('/messages?chatbuddy=' + req.param('target'));
      });
    }
  };
};
