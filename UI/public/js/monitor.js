
function init() {
  var serverBaseUrl = document.domain;

  var socket = io.connect(serverBaseUrl);

  var sessionId = '';
  
  var username = '';
  
  $("button#stopMeasurePerformanceButton").click(function() {
    $.ajax({
      url: '/stopMeasurePerformance',
      type: 'POST',
      dataType: 'json',
      data: {serial : $("div#serial").html()}
    }).done(function(data){
      if (data.error) {
        document.alert(data.error);
      }
    });
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
  
  socket.on('newPerformanceMeasurementResult', function (data) {
    if (username !== data.username || data.serial != $("div#serial").html()) {
      return;
    }
    if (data.error) {
      window.alert("performance measurement error: " + data.error);
    }
    $("#post_result").html("POSTs/sec=" + data.post);
    $("#get_result").html("GETs/sec=" + data.get);
  });

}

$(document).on('ready', init);