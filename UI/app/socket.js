var User = require('./models/UserRest');
var Message = require('./models/MessageRest');

module.exports = function(_, io, participants) {
  io.on("connection", function(socket){
    socket.on("newUser", function(data) {
      User.getUser(data.name, function(error, user) {
    	 if (!error) {
    		 participants.online[data.id] = {'userName' : data.name, 'status': user.local.status};
    	     io.sockets.emit("newConnection", {'participants': participants});
    	 }
      });
    });

    socket.on("newMessage", function(data) {
      io.sockets.emit("newWallPost", {participants: participants});
    });

    socket.on("newAnnouncement",function(data){
       io.sockets.emit("newAnnouncementPost",{participants : participants});
    });

    socket.on("disconnect", function() {
      delete participants.online[socket.id];
      io.sockets.emit("userDisconnected", {id: socket.id, sender:"system", participants:participants});
    });

  });
};
