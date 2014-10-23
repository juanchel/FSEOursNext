var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');
var utils = require('../utils');

var alive = true;

var asyncLoop = function(endTime, performanceMeasurements, functionToLoop, finalCallback) {
  var loop = function(i, performanceMeasurement) {
    var currentTime = new Date();
    if (currentTime < endTime && 
        !performanceMeasurement.cancelRequested) {
      functionToLoop(i+1, performanceMeasurement, loop);
    } else {
      finalCallback(i);
    }
  };
  
  loop(0, performanceMeasurements);
};

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

User.sendHoursForAnalyzing = function(user_name,analyzeTime,callback){
  console.log("Yo Analyze Time is here:" + analyzeTime);
  var options = {
      url : rest_api.analyzing_network + analyzeTime,
      body : {'userName' : user_name},
      json : true
  };

  request.get(options, function(err, res, body) {
      //console.log("callback of post sending hours for analyzing " + err + res.statusCode + body);
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

User.sendMeasurePerformanceStart = function(user_name, timePeriodSeconds, performanceMeasurements, 
    startedCallback, stoppedCallback) {
  var options = {
		url : rest_api.set_measure_performance_time + timePeriodSeconds,
		json : true
	};
  
  console.info("start measurement: " + options.url);

	request.post(options, function(err, res, body) {
	  if (err) {
	    startedCallback(err, false);
	    return;
	  } else if (res.statusCode !== 200 && res.statusCode !== 201) {
	    startedCallback(JSON.stringify(res.body), false);
	    return;
	  }

	  ++performanceMeasurements.serial;
	  performanceMeasurements.onGoing = true;
	  performanceMeasurements.cancelRequested = false;
	  performanceMeasurements.username = user_name;
	  performanceMeasurements.numPosts = -1;
	  performanceMeasurements.numGets = -1;
	  startedCallback(null, true);
	  
	  var startTimeMillis = new Date().getTime();
	  var endTime = new Date(startTimeMillis + timePeriodSeconds * 1000);

	  asyncLoop(endTime, performanceMeasurements,
	      function(i, performanceMeasurement, loop) {
	        User.postForMeasurePerformance(user_name, function(error, isSuccessful) {
	          if (!isSuccessful) {
	            console.warn("POST mesure performance request got error: " + error);
	          }
	          loop(i, performanceMeasurement);
	        });
	      },
	      function(i) {
	        console.log('we have executed ' + i + ' POST requests');
	        performanceMeasurements.numPosts = i;
	        console.log("num POSTs " + performanceMeasurements.numPosts + ", num GETs " +
	            performanceMeasurements.numGets);
	        if (performanceMeasurements.numGets >= 0) {
	          stoppedCallback();
	        }
	      }
	  );

	  asyncLoop(endTime, performanceMeasurements,
	      function(i, performanceMeasurement, loop) {
	        User.getfromMeasurePerformance(user_name, function(error, isSuccessful) {
	          if (!isSuccessful) {
	            console.warn("GET mesure performance request got error: " + error);
	          }
	          loop(i, performanceMeasurement);
	        });
	      },
	      function(i) {
	        console.log('we have executed ' + i + ' GET requests');
	        performanceMeasurements.numGets = i;
	        console.log("num POSTs " + performanceMeasurements.numPosts + ", num GETs " +
	              performanceMeasurements.numGets);
	        if (performanceMeasurements.numPosts >= 0) {
	          stoppedCallback();
	        }
	      }
	  );
	});
};

User.postForMeasurePerformance = function(user_name, callback) {
	var options = {
		url : rest_api.measure_performance_post + user_name,
		body : {'content' : "abcdefghijklmnopqrst"},
		json : true,
		timeout : 1000
	};
	request.post(options, function(err, res, body) {
	    if (err) {
	      callback(err, false);
	    } else if (res.statusCode !== 200 && res.statusCode !== 201) {
	      callback(JSON.stringify(res.body), false);
	    } else {
	      callback(null, true);
	    }
	  });
};

User.getfromMeasurePerformance = function(user_name, callback) {
  request(rest_api.measure_performance_get, {json:true, timeout : 1000}, function(err, res, body) {
    if (err) {
      callback(err, false);
    } else if (res.statusCode === 200) {
      callback(null, true);
    } else {
      callback(JSON.stringify(res.body), false);
    }
  });
};

User.stopMeasurePerformance = function (callback) {
	console.log('stopMeasurePerformance');
  request(rest_api.end_measure_performance, {json:true}, function(err, res, body) {
    if (err) {
      callback(err,null);
    } else if (res.statusCode === 200) {
      var testResults = {post:body.post, get:body.get};
      callback(null, testResults);
    } else {
      callback(JSON.stringify(body), null);
    }
  });
};

User.MeasureMemoryStart = function(user_name, callback) {
	var options = {
		url : rest_api.start_measure_memory,
		body : {'userName' : user_name},
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

User.MeasureMemoryStop = function(callback) {

  request.get(rest_api.end_measure_memory, {json:true}, function(err, res, body) {

    if (err){
      callback(err,null);
      return;
    }
	
    if (res.statusCode === 200) {
	    callback(null, body);
        return;
    }
    if (res.statusCode !== 200) {
      callback(null, null);
      return;
    }
  });
};


module.exports = User;
