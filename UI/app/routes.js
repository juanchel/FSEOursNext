var User = require('./models/UserRest');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.redirect('/');
}

function refreshAllUsers(participants, callback) {
  participants.all = [];
  User.getAllUsers(function(err, users) {
    users.forEach(function(user) {
      participants.all.push({'userName' : user.local.name, 'emergency' : 'ok'});
    });
    callback();
  });
}

module.exports = function(app, _, io, participants, passport) {
  var user_controller = require('./controllers/user')(_, io, participants, passport, refreshAllUsers);
  var people_controller = require('./controllers/people')(_, io, participants, passport);
  var message_controller = require('./controllers/message')(_, io, participants, passport);
  var monitor_controller = require('./controllers/monitor')(_, io, participants, passport);
  var searchCtl_controller = require('./controllers/searchCtl')(_, io, participants, passport);

  app.get("/", user_controller.getLogin);
  
  app.get("/messages", isLoggedIn, message_controller.getAllPrivateMessages);
  app.post("/send_message", isLoggedIn, message_controller.sendMessage);

  app.post("/signup", user_controller.postSignup);
  app.post("/status", user_controller.postStatus);
  
  app.post("/publicmessage", message_controller.postPublicMessage);
  app.get("/publicmessage", message_controller.getWall);
  
  app.post("/startMeasurePerformance", user_controller.startMeasurePerformanceFn);
  app.post("/postMeasurePerformance", user_controller.postMeasurePerformanceFn);
  
  app.get("/search", searchCtl_controller.getSearchResults);
  app.post("/search", searchCtl_controller.postSearchInfo);

  app.get("/welcome", isLoggedIn, user_controller.getWelcome);
  
  app.get("/user", isLoggedIn, user_controller.getUser);
  app.get('/signup', user_controller.getSignup);
  app.get("/logout", isLoggedIn, user_controller.getLogout);
  app.post("/login", passport.authenticate('local-login', {
    successRedirect : '/welcome',
    failureRedirect : '/',
    failureFlash: true
  }));

  app.get("/people", isLoggedIn, people_controller.getPeople);
  app.get("/getMeasurePerformance", user_controller.getMeasurePerformanceFn);
  app.get("/stopMeasurePerformance", user_controller.stopMeasurePerformanceFn);

  app.get("/wall", isLoggedIn, message_controller.getWall);
  app.get("/monitor", isLoggedIn, monitor_controller.getResult);
};
