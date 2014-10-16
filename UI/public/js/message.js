function init() {
  var serverBaseUrl = document.domain;

  var socket = io.connect(serverBaseUrl);
  
  function updateMessages(participants) {


    $('#participants_online').html("");

    for (var i = 0; i < participants.wall.length; i++) {
      $('#participants_online').append(participants.wall[i].author + " said: " + participants.wall[i].content + '</br>');
    }

  }

  socket.on('connect', function () {
    sessionId = socket.socket.sessionid;
    socket.emit('newMessage', {});
  });

  socket.on('newWallPost', function (data) {
    updateMessages(data.participants);
  });

  socket.on('error', function (reason) {
    console.log('Unable to connect to server', reason);
  });


}

$(document).on('ready', init);