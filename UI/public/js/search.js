function init() {
  
  var serverBaseUrl = document.domain;

  var socket = io.connect(serverBaseUrl);

  var sessionId = '';
  
  var username = '';
  
  $('#searchBtn').click(function() {
    window.location.replace("/search");
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
  });

  socket.on('error', function (reason) {
    console.log('Unable to connect to server', reason);
  });
}

$(document).on('ready', init);