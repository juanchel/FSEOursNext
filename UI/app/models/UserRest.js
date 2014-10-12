var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');
var utils = require('../utils');

/*
function User(user_name, password){
  this.local = {
    name : user_name,
    password : password
  };
}
*/

function User(user_name, password, st){
  this.local = {
    name : user_name,
    password : password,
    status : st
  };
}

User.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.prototype.isValidPassword = function(password, callback) {
  request.post(rest_api.is_password_valid + this.local.name + '/authenticate', {json:true, body:{password:password}}, function(err, res, body) {
    if (err || res.statusCode !== 200){
      callback(false);
      return;
    }

    callback(true);
  });
};

User.getUser = function(user_name, callback) {
  request(rest_api.get_user + user_name, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode === 200) {
      var user = new User(body.userName, body.password, body.emergency_status);
      callback(null, user);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};

User.getAllUsers = function(callback) {
  request(rest_api.get_all_users, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode === 200) {
      var users = body.map(function(item, idx, arr){
        return new User(item.userName, item.password, item.emergency_status);
      });

      users.sort(function(a,b) {
        return a.userName > b.userName;
      });

      console.log("@@@@@ in User.getAllUser succeed users :" + JSON.stringify(users));
      callback(null, users);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};

User.saveNewUser = function(user_name, password, callback) {
  var options = {
    url : rest_api.post_new_user,
    body : {userName: user_name, password: password},
    json: true
  };

  request.post(options, function(err, res, body) {
    if (err){
      callback(err,null, false);
      return;
    }
    if (res.statusCode !== 200 && res.statusCode !== 201) {
      callback(res.body, null, false);
      return;
    }
    var new_user = new User(body.userName, password, undefined);
    if (res.statusCode === 200) {
    	callback(null, new_user, false);
    } else if (res.statusCode === 201) {
    	callback(null, new_user, true);
    }
    return;
  });
};

User.prototype.setStatus = function(status, callback) {
  var options = {
    url : rest_api.save_status + this.local.name,
    body : {status: status},
    json : true
  };

  request.post(options, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode !== 200 && res.statusCode !== 201) {
      callback(res.body, null);
      return;
    }
    callback(null, status);
    return;
  });
};

User.getStatus = function(user_name, status, callback) {
  request(rest_api.get_Status, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode === 200) {
      var users = body.map(function(item, idx, arr){
        return new User(item.userName, item.password, item.emergency_status);
      });

      users.sort(function(a,b) {
        return a.userName > b.userName;
      });

      console.log("@@@@@ in User.getStatus succeed users :" + JSON.stringify(users));
      callback(null, users);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};

/**
 * @param sender user name of the sender
 * @param receiver user name of the receiver 
 * @param message content of the message
 * @param timestamp a Date object, sent time of the message
 * @param callback function with signature callback(error_message, message_id)
 */
User.sendMessage = function(sender, receiver, message, timestamp, callback) {
  var options = {
      url : rest_api.send_private_message.replace("{sender}", sender).replace("{receiver}", receiver),
      body : { 'content' : message, 'postedAt' : utils.formatTimestamp(timestamp) },
      json : true
  };
  
  request.post(options, function(err, res, body) {
    if (err) {
      callback(err, null);
    } else if (res.statusCode !== 201) {
      callback(res.body, null);
    } else {
      var components = res.headers.location.split('/');
      var messageId = components[components.length - 1];
      callback(null, messageId);
    }
  });
};

module.exports = User;
