var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var rest_api = require('../../config/rest_api');
var utils = require('../utils');

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
	
	var inputTime = measurePerformanceTime;
	
	//var d = new Date();
	//var currentSeconds = d.getSeconds();
	//var temp = currentSeconds;
	
	var startTime = parseInt((new Date()).getTime() / 1000);
	console.log('start time ' + startTime);
	var endTime = (startTime + parseInt(measurePerformanceTime));
	console.log('end time ' + endTime);

	while (startTime < endTime){
		//posts
		User.postForMeasurePerformance(user_name, function(error, postMessage) { });
		//gets
		User.getfromMeasurePerformance(user_name, function(err, message) {  });

      startTime = parseInt((new Date()).getTime() / 1000);
      console.log('current time ' + startTime)
	}

    console.log('done with while loop');
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
	console.log('stopMeasurePerformance');
  request(rest_api.end_measure_performance, {json:true}, function(err, res, body) {
    if (err){
      callback(err,null);
      return;
    }

    console.log('body ' + JSON.stringify(body));

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

User.MeasureMemoryStart = function(user_name, callback) {
	console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Inside User Rest");
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

/*function listProperties(obj) {
   var propList = "";
   for(var propName in obj) {
      if(typeof(obj[propName]) != "undefined") {
         propList = propList + propName + ", ";
      }
   }
   return propList;
}*/

User.MeasureMemoryStop = function(callback) {
//  request.post({
//	url: rest_api.save_measure_memory,
//	// body: {'userName': user_name},
//	// json: true,
//  }, function(err, res, body) { console.log('Got res.status code from save: ' + res.statusCode); });

  request.get(rest_api.end_measure_memory, {json:true}, function(err, res, body) {
    //console.log("err from backend" + err);
    //console.log("res.status code from backend " + res.statusCode);
    //console.log("body :" + listProperties(body));

    if (err){
      callback(err,null);
      return;
    }
	
    //var memory = body[0];
	//var i = 0; 
    if (res.statusCode === 200) {
		//for (var i in body) {
			//var mem = {timestamp: memory.timestamp, usedVolatile: memory.usedVolatile, leftVolatile: memory.leftVolatile, usedNonVolatile: memory.usedNonVolatile, leftNonVolatile: memory.leftNonVolatile};
	      	//console.log ("Testing in OK From Backend: " + body[i].timestamp + body[i].usedVolatile);
			//callback(null, body[i].timestamp, body[i].usedVolatile, body[i].leftVolatile, body[i].usedNonVolatile, body[i].leftNonVolatile);
			//i++;
		//}
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
