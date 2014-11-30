var serverBaseUrl = document.domain;
var username = '';
var peerIdMap = {};

function getLocalStream() {
  // Get audio/video stream
  navigator.getUserMedia({audio: true, video: true}, function(stream){
    // Set your video displays
    $('#my-video').prop('src', URL.createObjectURL(stream));
    window.localStream = stream;
    showCallButton();
  }, 
  function(){ 
    $('#get-local-stream-error').show(); 
  });
}

function showCallButton() {
  $('#get-local-stream').hide();
  $('#call-in-progress').hide();
  $('#ready-for-call').show();
}

function connectCall(call) {
  // Hang up on an existing call if present
  if (window.existingCall) {
    window.existingCall.close();
  }

  // Wait for stream on the call, then set peer video display
  call.on('stream', function(stream){
    $('#their-video').prop('src', URL.createObjectURL(stream));
    $('#their-video').show();
  });

  // UI stuff
  window.existingCall = call;
  if (peerIdMap.hasOwnProperty(call.peer)) {
    $('#their-id').text(peerIdMap[call.peer]);
  }
  call.on('close', function() {
    $('#their-video').hide();
    showCallButton();
  });
  $('#get-local-stream').hide();
  $('#ready-for-call').hide();
  $('#call-in-progress').show();
}

function updateParticipants(participants) {
  var onlineUsers = participants.online;
  var userOptions = '';
  for (var socketId in onlineUsers) {
    if (onlineUsers.hasOwnProperty(socketId)) {
      var user = onlineUsers[socketId];
      if (user.hasOwnProperty('userName') && user.hasOwnProperty('peerId')) {
        var name = user.userName;
        if (name !== username) {
          userOptions += '<option value=\'' + user.peerId + '\'>' + name + '</option>';
          peerIdMap[user.peerId] = name;
        }
      }
    }
  }
  $('#users-ready-for-call').html(userOptions);
}

function initPeerCall(socket) {
  //Compatibility shim
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
  $('#ready-for-call').hide();
  
  var peer = new Peer({
    key: 'okppgxiurak5u3di',
    debug: 3,
    config: {
      'iceServers': [{ url: 'stun:stun.l.google.com:19302' }]
    }
  });

  peer.on('open', function(){
    socket.emit('newVideoChatBuddy', {
      peerId: peer.id
    });
  });

  //Receiving a call
  peer.on('call', function(call){
    // Answer the call automatically (instead of prompting user) for demo purposes
    call.answer(window.localStream);
    connectCall(call);
  });

  peer.on('error', function(err){
    alert(err.message);
    // Return to step 2 if error occurs
    showCallButton();
  });

  //Click handlers setup
  $('#make-call').click(function(){
    // Initiate a call!
    var calleePeerId = $('#users-ready-for-call option:selected').val();
    if (calleePeerId !== undefined) {
      var call = peer.call(calleePeerId, window.localStream);
      connectCall(call);
    }
  });

  $('#end-call').click(function(){
    window.existingCall.close();
    showCallButton();
  });

  // Retry if getUserMedia fails
  $('#get-local-stream-retry').click(function(){
    $('#get-local-stream-error').hide();
    getLocalStream();
  });

  // Get things started
  getLocalStream();
}

function init() {
  var socket = io.connect(serverBaseUrl);

  socket.on('connect', function () {
    var sessionId = socket.socket.sessionid;
    $.ajax({
      url:  '/user',
      type: 'GET',
      dataType: 'json'
    }).done(function(data) {
      username = data.name;
      socket.emit('newUser', {id: sessionId, name: username});
      initPeerCall(socket);
    });
  });

  socket.on('error', function (reason) {
    console.log('Unable to connect to server', reason);
  });
  
  socket.on('newConnection', function(data) {
    updateParticipants(data.participants);
  });
  socket.on('userDisconnected', function(data) {
    updateParticipants(data.participants);
  });
  
  $('#get-local-stream-error').hide();
  $('#ready-for-call').hide();
  $('#call-in-progress').hide();
}

$(document).on('ready', init);
