var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');
var utils = require("../utils");
var User = require("./UserRest");

function PublicMessage(author, content, timestamp, messageID) {
  this.author = author;
  this.content = content;
  this.timestamp = timestamp || new Date();
  this.messageID = messageID;
}

PublicMessage.prototype.send = function(callback) {
  var options = {
      url : rest_api.save_public_message.replace("{sender}", this.author),
      body : {
        'content' : this.content,
        'timestamp' : utils.formatTimestamp(this.timestamp)
      },
      json : true
    };
  console.log(this);  
  
    console.info("send message options: " + JSON.stringify(options));

    request.post(options, function(error, response, body) {
      if (error) {
        callback(error);
      } else if (response.statusCode !== 201) {
        callback(JSON.stringify(response.body));
      } else {
        if (response.headers.location !== undefined) {
          var components = response.headers.location.split('/');
          this.messageID = components[components.length - 1];
        } else {
          console.warn("no Location header in sendPublicMessage response, sender: " + 
              this.author + ", message content: \"" + 
              this.content + "\"");
        }
        callback(null);
      }
    });
  };

PublicMessage.getAllWallPosts = function(callback) {
  request(rest_api.get_wall, {json:true}, function(err, res, body) {
    if (err){
      console.warning("There is an error: " + err);
    }else if (res.statusCode !== 200) {
      callback(JSON.stringify(body), null);
    } else if(res.statusCode === 200) {

      var publicmessages = [];
      for (var i = 0; i < body.length; ++i) {
        var item = body[i];
        var timestampPattern = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}).*/;
        var match = timestampPattern.exec(item.timestamp);
        var timestamp = new Date(Number(match[1]), Number(match[2])-1, Number(match[3]),
            Number(match[4]), Number(match[5]), 0, 0);
        publicmessages.push(new PublicMessage(item.author, item.content, timestamp));
      //  console.log(publicmessages);
      }
      
      callback(null, publicmessages);
    }
    
  });
};

module.exports = PublicMessage;
