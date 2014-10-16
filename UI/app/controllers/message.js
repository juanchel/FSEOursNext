var PrivateMessage = require('../models/PrivateMessageRest');
var User = require('../models/MessageRest');

module.exports = function(_, io, participants, passport) {
  return {
    getAllPrivateMessages : function(req, res) {
      var me = req.user.local.name;
      var buddy = req.param('chatbuddy');
      PrivateMessage.getMessages(me, buddy, function(error, messages) {
        var errorMessages = req.flash('errorMessage');
        if (error) {
          errorMessages.push(error);
        }
        var messageBuffer = [];
module.exports = function(_, io, participants, passport, refreshAllUsers) {
  return{
    getWall : function(req, res) {
      res.render('wall', {message: ""});
    },

        for (var i = 0; i < messages.length; ++i) {
          var message = messages[i];
          var author = message.author;
          var target = message.target;
          if (author === me && target === buddy) {
            messageBuffer.push("-> " + message.content + " (sent at " + message.postedAt + ")");
          } else if (author === buddy && target === me) {
            messageBuffer.push("<- " + message.content + " (sent at " + message.postedAt + ")");
          } else {
            console.warn("message coming from wrong conversation");
          }
        }
        
        res.render("message", {
          error_messages: errorMessages,
          username: buddy,
          messages: messageBuffer,
        });
      });
    getPM : function(req, res) {
      res.render('private', {message: ""});
    },
    
    sendMessage: function(req, res) {
      var message = new PrivateMessage(req.user.local.name, 
          req.param('target'), req.param('content'));
      message.send(function(error_message) {
        if (error_message) {
          req.flash('errorMessage', "failed to send message: " + error_message);
        }
        console.log("Here is the auther:" + req.user.local.name + "Message content is:" + req.param('content'));
        io.emit('newPrivateMessage', {
          author: req.user.local.name, 
          target: req.param('target'),
          message: req.param('content'),
        });
        res.redirect('/messages?chatbuddy=' + req.param('target'));
      });
    }
  };
};
  }
};