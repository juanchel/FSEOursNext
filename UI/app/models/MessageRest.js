var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');

function Message(from, msg) {
  this.local = {
    author : from,
    content : msg
  }
}

function Message(from, msg, to) {
  this.local = {
    author : from,
    target : to,
    content : msg
  }
}

Message.getAllWallPosts = function(callback) {
  request(rest_api.get_wall, {json:true}, function(err, res, body) {
    if (res.statusCode === 200) {
      var messages = body.map(function(item, idx, arr){
        return new Message(item.author, item.content);
      });

      console.log("@@@@@ in Message.getAllWallPosts succeed messages :" + JSON.stringify(messages));
      callback(null, messages);
      return;
    }

    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};

module.exports = Message;
