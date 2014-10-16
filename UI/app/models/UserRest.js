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

User.setPublicMessage = function(user_name, publicMessage, callback) {
	var options = {
		url : rest_api.save_public_message + user_name,
		body : {'content' : publicMessage},
		json : true
	};
	
	console.log("set public message: options: " + options);
	
	request.post(options, function(err, res, body) {
		console.log('post err' + err);
		console.log('post res ' + res);
		console.log('post body ' + body);
	    if (err){
	      callback(err,null);
	      return;
	    }
	    if (res.statusCode !== 200 && res.statusCode !== 201) {
	      callback(res.body, null);
	      return;
	    }
	    callback(null, publicMessage);
	    return;
	  });
};

User.sendMeasurePerformanceStart = function(user_name, measurePerformanceTime, callback) {
	console.log("In userrest.js" + measurePerformanceTime);
	var options = {
		url : rest_api.set_measure_performance_time + measurePerformanceTime,
		body : {'userName' : user_name},
		json : true
	};
	

	request.post(options, function(err, res, body) {
		console.log("callback of post send measure perf " + err + res.statusCode + body);
	    if (err){
	      callback(err,null);
	      return;
	    }
	    if (res.statusCode !== 200 && res.statusCode !== 201) {
	      callback(res.body, null);
	      return;
	    }
	    callback(null, measurePerformanceTime);
	    return;
	  });
};

User.postForMeasurePerformance = function(user_name, callback) {
	var options = {
		url : rest_api.measure_performance_post + user_name,
		body : {'content' : "abcdefghijklmnopqrst"},
		json : true
	};
	console.log("Posting");
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

User.getfromMeasurePerformance = function(user_name, callback) {
	console.log("Getting");
  request(rest_api.measure_performance_get, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
    if (res.statusCode === 200) {
      callback(null, res);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};

User.stopMeasurePerformance = function(callback) {
  request(rest_api.end_measure_performance, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }
	console.log("@@@@@@@@ Result Status Code: " + res.statusCode);
	console.log("@@@@@@@@@@ testresult obj" + body.post + body.get);
    if (res.statusCode === 200) {
      var tr = {post:body.post, get:body.get};
      callback(null, tr);
      return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};

module.exports = User;
