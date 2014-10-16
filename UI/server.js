var express = require("express"),
  app = express(),
  http = require("http").createServer(app),
  io = require("socket.io").listen(http),
  _ = require("underscore"),
  passport = require('passport'),
  flash = require('connect-flash'),
  User = require('./app/models/UserRest');
  Message = require('./app/models/MessageRest')

var participants = {
  online : {},
  all : [],
  wall : [],
  priv : {}
};

process.chdir(__dirname);

require('./config/passport')(passport);

app.set("ipaddr", process.env.SSNOC_NODEJS_IP || "0.0.0.0");

app.set("port", process.env.SSNOC_NODEJS_PORT || 80);

app.set("views", __dirname + "/app/views");

app.set("view engine", "jade");

app.use(express.logger('dev'));

app.use(express.static("public", __dirname + "/public"));

app.use(express.bodyParser());

app.use(express.cookieParser());

app.use(express.session({secret : 'ssnocwebapplication', cookie : {maxAge : 3600000*24*10 }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

User.getAllUsers(function(err, users) {
  if (!err) {
    users.forEach(function(user) {
      participants.all.push({userName : user.local.name, emergency: user.local.status});
    });
  }

  require('./app/routes')(app, _, io, participants, passport);
  require('./app/socket')(_, io, participants);
});

Message.getAllWallPosts(function(err, messages) {
  if (!err) {
    messages.forEach(function(message) {
      participants.wall.push({author: message.local.author, content: message.local.content})
    });
  }

  require('./app/routes')(app, _, io, participants, passport);
  require('./app/socket')(_, io, participants);
});

http.listen(app.get("port"), app.get("ipaddr"), function() {
  console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});

