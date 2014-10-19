function init() {
  
  var serverBaseUrl = document.domain;

  var socket = io.connect(serverBaseUrl);

  var sessionId = '';
  
  var username = '';
  function updateMessages(participants) {

  console.log("chat buddy: \"" + $("#chatbuddy").html() + "\"");
  
  $('#sendMessageBtn').click(function() {
    return true;
  });
  
    $('#participants_online').html("");

    for (var i = 0; i < participants.wall.length; i++) {
      $('#participants_online').append(participants.wall[i].author + " said: " + participants.wall[i].content + '</br>');
    }

  }

  socket.on('connect', function () {
    sessionId = socket.socket.sessionid;
    $.ajax({
      url:  '/user',
      type: 'GET',
      dataType: 'json'
    }).done(function(data) {
      var name = data.name;
      username = data.name;
      socket.emit('newUser', {id: sessionId, name: name});
    });
    socket.emit('newMessage', {});
  });

  socket.on('newWallPost', function (data) {
    updateMessages(data.participants);
  });

  socket.on('error', function (reason) {
    console.log('Unable to connect to server', reason);
  });
  
  socket.on('newPrivateMessage', function (data) {
    var author = data.author;
    var target = data.target;
    var chatbuddy = $("#chatbuddy").html();
    if (author === chatbuddy && target === username) {
      location.reload(true);
    }
  });


}

$(document).on('ready', init);