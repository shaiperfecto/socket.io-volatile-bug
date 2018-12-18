var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);
var crypto = require('crypto');

function random (howMany, chars) {
      chars = chars
        || 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
    var rnd = crypto.randomBytes(howMany), value = new Array(howMany), len = Math.min(256, chars.length), d = 256 / len;

    for (var i = 0; i < howMany; i++) {
          value[i] = chars[Math.floor(rnd[i] / d)]
    };

    return value.join('');
}

var i = 1;

http.listen(8081, function(){
	console.log('Listening on port 8081');
});

var currentSocket;


function sendMessage() {
	var buf = Buffer.from(random(300000));
	io.volatile.binary(true).emit("image", {'data':buf,'count': i});
	i++;
  console.log(i);
  if (started) {
  	setTimeout(function() {
  		sendMessage();
  	}, 1000);
  }
}

app.get('/health',function(req,res) {
     res.send(":)");
});

app.get('/favicon.ico',function(req,res) {
	res.send(":)")
});

app.get('/js/socket.io.js', function(req,res) {
    res.sendFile(__dirname + '/js/socket.io.js');
});

app.get('/js/jquery-3.3.1.js', function(req,res) {
    res.sendFile(__dirname + '/js/jquery-3.3.1.js');
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/wstest.html');
});

var started = false;
io.on('connection', function(socket){
	if (!started) {
    started = true;
  	sendMessage();
	}

  socket.on('disconnect', function() {
    started = false;
  });
});

