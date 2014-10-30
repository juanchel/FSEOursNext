var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');
var utils = require('../utils');
var User = require("./UserRest");

function AdminUser(user_name, password, st, role) {
  this.local = {
    name : user_name,
    password : password,
    status : st,
	role : role
  };
}

AdminUser.getUserProfile = function(user_name, callback) {
  request(rest_api.get_user + user_name, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode === 200) {
      var user = new AdminUser(body.userName, body.password, body.emergency_status, body.role);
      callback(null, user);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};

AdminUser.changeUser = function(changed_user_name, user_name, callback) {
  var options = {
    url : rest_api.change_user_name + user_name,
    body : {'userName' : changed_user_name},
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
      callback(null, res.body);
      return;
    });
};

AdminUser.changePrivilegeLevel = function(changed_privilege_level, user_name, callback) {
  var options = {
    url : rest_api.change_privilege_level + user_name,
    body : {'role' : changed_privilege_level},
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
      callback(null, res.body);
      return;
    });
};

AdminUser.changeAccountStatus = function(changed_account_status, user_name, callback) {
  var options = {
    url : rest_api.change_account_status + user_name + "/" + changed_account_status,
    body : {},
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
      callback(null, res.body);
      return;
    });
};

AdminUser.changePassword = function(changed_password, user_name, callback) {
  var options = {
    url : rest_api.change_password + user_name,
    body : {'password' : changed_password},
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
      callback(null, res.body);
      return;
    });
};

module.exports = AdminUser;