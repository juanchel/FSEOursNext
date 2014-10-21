function init() {
  var serverBaseUrl = document.domain;

  var socket = io.connect(serverBaseUrl);

  var sessionId = '';
  
  var username = '';

  console.log("chat buddy: \"" + $("#chatbuddy").html() + "\"");
  
  $('#sendMessageBtn').click(function() {
    return true;
  });

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

  socket.on('error', function (reason) {
    console.log('Unable to connect to server', reason);
  });
  
  socket.on('newPrivateMessage', function (data) {
    var author = data.author;
    var target = data.target;
    var chatbuddy = $("#chatbuddy").html();
    if (author === chatbuddy && target === username) {
      location.reload(true);
    }else if(author !== chatbuddy && target === username){
      alert("Get a new message from: " + author);
    }
  });

}


$(document).on('ready', init);