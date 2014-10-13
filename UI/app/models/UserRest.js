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
 * @param {string} username - whose chat buddies to get
 * @param {function} callback - callback with signature `callback(error_message, users)`
 */
User.getChatBuddies = function(username, callback) {
  var url = rest_api.get_chat_buddies.replace("{user}", username);
  
  request(url, {json:true}, function(error, response, body) {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      callback(JSON.stringify(response.body), null);
    } else {
      var users = body.map(function(item, index, array) {
        return new User(item.userName, item.password, item.emergency_status);
      });
      // TODO: remove de-duplication after backend implements de-duplication
      var dedupedUsers = [];
      var seenUsers = {};
      for (var i = 0; i < users.length; ++i) {
        var user = users[i];
        if (seenUsers[user.local.name] === undefined) {
          dedupedUsers.push(user);
          seenUsers[user.local.name] = user;
        }
      }
      
      if (dedupedUsers.length < users.length) {
        console.warn("duplicated entries found in the chat buddy list of user " + username);
      }
      
      callback(null, dedupedUsers);
    }
  });
};

module.exports = User;
