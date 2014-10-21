var User = require('../models/UserRest');
var PrivateMessage = require('../models/PrivateMessageRest');
var PublicMessage = require('../models/MessageRest');

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

        for (var i = 0; i < messages.length; ++i) {
          var message = messages[i];
          var author = message.author;
          var target = message.target;
          if (author === me && target === buddy) {
            messageBuffer.push(me + ": " + message.content + " (Sent at " + message.timestamp + ")");
          } else if (author === buddy && target === me) {
            messageBuffer.push(buddy + ": " + message.content + " (Sent at " + message.timestamp + ")");
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
    },

    sendMessage: function(req, res) {
      var message = new PrivateMessage(req.user.local.name, 
          req.param('target'), req.param('content'));
      message.send(function(error_message) {
        if (error_message) {
          req.flash('errorMessage', "failed to send message: " + error_message);
        }
       // console.log("Here is the auther:" + req.user.local.name + "Message content is:" + req.param('content'));
        io.sockets.emit('newPrivateMessage', {
          author: req.user.local.name, 
          target: req.param('target'),
          message: req.param('content'),
        });
      //  console.log("Here is the auther:" + req.user.local.name + "Message content is:" + req.param('content'));
        res.redirect('/messages?chatbuddy=' + req.param('target'));
      });
    },
     
    getWall : function(req, res) {
      PublicMessage.getAllWallPosts(function(error, publicmessages) {
        var errorMessages = req.flash('errorMessage');
        if (error) {
          errorMessages.push(error);
        }
        var messageBuffer = [];

        for (var i = 0; i < publicmessages.length; ++i) {
          var message = publicmessages[i];
          var author = message.author;
          messageBuffer.push(author + ": " + message.content + " (sent at " + message.timestamp + ")");
        }
        
        res.render("wall", {
          error_messages: errorMessages,
          username: author,
          publicmessages: messageBuffer,
        });
      //  console.log(publicmessages);
      });
    },

    postPublicMessage : function (req, res, next) {
      var user_name = req.session.passport.user.user_name;
      console.log("Testing request: public message" + req);
      User.setPublicMessage(user_name, req.body.publicMessage, function(error, publicMessage) {
        if (error){
          next(error);
        } else {
          for (var sId in participants.online) {
                  var userName = participants.online[sId].userName;
                  if (userName == user_name) {
                      participants.online[sId] = {'userName' : user_name, 'publicMessage': publicMessage};        
            }
          }
          io.sockets.emit("newConnection", {participants: participants});
          console.log("Testing response - public message:" + res);
            res.redirect('/wall');
        }
      });
    },
  };
};