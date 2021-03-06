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

module.exports = function(app, _, io, participants, performanceMeasurements, passport) {
  var user_controller = require('./controllers/user')(_, io, participants, performanceMeasurements, passport, refreshAllUsers);
  var people_controller = require('./controllers/people')(_, io, participants, passport);
  var message_controller = require('./controllers/message')(_, io, participants, passport);
  var monitor_controller = require('./controllers/monitor')(_, io, participants, passport);
  var searchCtl_controller = require('./controllers/searchCtl')(_, io, participants, passport);
  var administer_controller = require('./controllers/administer')(_, io, participants, passport);

  app.get("/", user_controller.getLogin);
  
  app.get("/messages", isLoggedIn, message_controller.getAllPrivateMessages);
  app.post("/send_message", isLoggedIn, message_controller.sendMessage);

  app.post("/signup", user_controller.postSignup);
  app.post("/status", user_controller.postStatus);
  
  app.post("/publicmessage", message_controller.postPublicMessage);
  app.get("/publicmessage", message_controller.getWall);
  
  app.post("/startMeasurePerformance", isLoggedIn, user_controller.startMeasurePerformanceFn);
  app.post("/stopMeasurePerformance", isLoggedIn, user_controller.stopMeasurePerformanceFn);
  
  app.post("/analyzeSocialNetwork", isLoggedIn, user_controller.hoursForAnalyzing);
  app.get("/analyze", isLoggedIn, user_controller.analyzeNetwork);
  
  app.post("/search", isLoggedIn, searchCtl_controller.search);

  app.get("/welcome", isLoggedIn, user_controller.getWelcome);
  
  app.get("/user", isLoggedIn, user_controller.getUser);
  app.get('/signup', user_controller.getSignup);
  app.get("/logout", isLoggedIn, user_controller.getLogout);
  app.post("/login", passport.authenticate('local-login', {
    successRedirect : '/welcome',
    failureRedirect : '/',
    failureFlash: true
  }));


  app.post("/publicannouncement", message_controller.postAnnouncement);
  app.get("/Announcement", isLoggedIn, message_controller.getAnnouncementPage);
  
  app.get("/people", isLoggedIn, people_controller.getPeople);
  
  app.post("/startMeasureMemory", user_controller.startMeasureMemoryFn);
  app.get("/stopMeasureMemory", user_controller.stopMeasureMemoryFn);

  app.get("/wall", isLoggedIn, message_controller.getWall);
  app.get("/monitor", isLoggedIn, monitor_controller.getResult);

  app.get("/administer", isLoggedIn, administer_controller.getAdministerResult);
  app.post("/administerUserProfile", administer_controller.getUserProfileFn);
  app.post("/changeUserName", administer_controller.changeUserNameFn);
  app.post("/changePrivilegeLevel", administer_controller.changePrivilegeLevelFn);
  app.post("/changeAccountStatus", administer_controller.changeAccountStatusFn);
  app.post("/changePassword", administer_controller.changePasswordFn);
  
  app.get("/search", isLoggedIn, searchCtl_controller.getSearch);
};
