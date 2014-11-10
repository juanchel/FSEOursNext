function init() {
  
  var serverBaseUrl = document.domain;

  var socket = io.connect(serverBaseUrl);

  var sessionId = '';
  
  var username = '';
  
  Array.prototype.sortOn = function(key){
    this.sort(function(a, b){
        if(a[key] < b[key]){
            return -1;
        }else if(a[key] > b[key]){
            return 1;
        }
        return 0;
    });
}
  
  var formatResults = function(div, type, results) {
    div.html("");
    if (results.length == 0) {
      div.html("<p>(no results)</p>");
      return;
    }
    for (var i = 0; i < results.length; ++i) {
      var result = results[i];
      switch (type) {
      case '0':
        div.append("<p>" + result.userName + "</p>");
        break;
      case '1':
        div.append("<p>" + result.userName + "</p>");
        break;
      case '2':
        div.append("<p>" + result.content + " (posted by " + result.author + 
            " on " + result.timestamp + ")</p>");
        break;
      case '3':
        div.append("<p>" + result.content + " (posted by " + result.author + 
            " on " + result.timestamp + ")</p>");        
        break;
      case '4':
        div.append("<p>" + result.content + " (sent by " + result.author + 
            " to " + result.target + " on " + result.timestamp + ")</p>");
        break;
      default:
        break;
      }
    }
  }
  
  $('select#search_type').change(function() {
    var type = $('select#search_type option:selected').val();
    if (type == '1') {
      $('p#keywords_input').addClass('display_none');
      $('p#status_input').removeClass('display_none');
    } else {
      $('p#keywords_input').removeClass('display_none');
      $('p#status_input').addClass('display_none');      
    }
  });
  
  $('button#search').click(function() {
    var type = $('select#search_type option:selected').val();
    var keywords = type == '1' ? 
        $('select#status_to_search option:selected').val() : $('input#keywords').val();
    $("div#online_results").html("<p>search in progress...</p>");
    $("div#offline_results").html("<p>search in progress...</p>")
    $.ajax({
      url: '/search',
      type: 'POST',
      dataType: 'json',
      data : {
        type: type,
        keywords: keywords
      }
    }).done(function(data) {
      if (data.error) {
        alert("search returned error: " + data.error);
        return;
      }
      data.result.online.sortOn('userName');
      data.result.offline.sortOn('userName');
      formatResults($("div#online_results"), type, data.result.online);
      formatResults($("div#offline_results"), type, data.result.offline);
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
  });

  socket.on('error', function (reason) {
    console.log('Unable to connect to server', reason);
  });
}

$(document).on('ready', init);