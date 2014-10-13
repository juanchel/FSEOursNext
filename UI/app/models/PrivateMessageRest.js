var request = require('request');
var rest_api = require("../../config/rest_api");
var utils = require("../utils");
var User = require("./UserRest");

/**
 * @constructor
 * @param {string} author - username of the sender
 * @param {string} target - username of the receiver
 * @param {string} content - content of the message
 * @param {Date} [postedAt] - when the message was sent, default: current time
 * @param {number} [messageID] - ID of the message
 */
function PrivateMessage(author, target, content, postedAt, messageID) {
  this.author = author;
  this.target = target;
  this.content = content;
  this.postedAt = postedAt || new Date();
  this.messageID = messageID;
}

/**
 * @param {function} callback - callback with signature `callback(error_message)`
 */
PrivateMessage.prototype.send = function(callback) {
  var options = {
    url : rest_api.send_private_message.replace("{sender}", this.author)
        .replace("{receiver}", this.target),
    body : {
      'content' : this.content,
      'postedAt' : utils.formatTimestamp(this.postedAt)
    },
    json : true
  };

  request.post(options, function(error, response, body) {
    if (error) {
      callback(error);
    } else if (response.statusCode !== 201) {
      callback(response.body);
    } else {
      if (response.headers.location !== undefined) {
        var components = response.headers.location.split('/');
        this.messageID = components[components.length - 1];
      } else {
        console.warn("no Location header in sendPrivateMessage response, sender: " + 
            this.author + ", receiver: " + this.receiver + ", message content: \"" + 
            this.content + "\"");
      }
      callback(null);
    }
  });
};

/**
 * Retrieves all private messages between two users, this includes messages that are
 * sent in both directions, both from user1 to user2 and from user2 to user1.
 * @param {string} user1 - username of user1
 * @param {string} user2 - username of user2
 * @param {function} callback - callback of signature `callback(error, messages)`,
 *                              here `error` is an optional error message, it is `null`
 *                              if there is no error, `messages` is the retrieved list
 *                              of messages in chronological order
 */
PrivateMessage.getMessages = function(user1, user2, callback) {
  var url = rest_api.get_private_messages.replace("{user1}", user1).replace(
      "{user2}", user2);
  request(url, {json : true}, function(error, response, body) {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      callback(JSON.stringify(body), null);
    } else {
      var messages = [];
      for (var i = 0; i < body.length; ++i) {
        var item = body[i];
        // TODO: correct field names after backend correction: public -> messageType
        if (item.public) {
          console.warn("Public message \"" + item.content + "\" from user " + item.author + 
              " to user " + item.target + " returned when retrieving private messages");
        } else if ((item.author === user1 && item.target === user2) ||
            (item.author === user2 && item.target === user1)) {
          // TODO: correct field names after backend correction: timestamp -> postedAt
          var timestampPattern = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}).*/;
          var match = timestampPattern.exec(item.timestamp);
          var postedAt = new Date(Number(match[1]), Number(match[2])-1, Number(match[3]),
              Number(match[4]), Number(match[5]), 0, 0);
          messages.push(new PrivateMessage(item.author, item.target, item.content, postedAt));
        } else {
          console.warn("Wrong author or target encountered when retrieving private messages. " +
              "Between user " + item.author + " and user " + item.target + " instead of between user " + 
              user1 + " and user " + user2);
        }
      }
      messages.sort(function(message1, message2) {
        var time1 = message1.postedAt.getTime();
        var time2 = message2.postedAt.getTime();
        return time1 - time2;
      });
      
      callback(null, messages);
    }
  });
};

module.exports = PrivateMessage;