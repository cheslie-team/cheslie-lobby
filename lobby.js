var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	port = 3030,
	
	players = [{name: 'RndJesus_1'}, {name: 'RndJesus_2'}];

io.on('connect', function (socket) {
    console.log('Player or lobby connected');
    
    io.emit('players', players);
});

io.on('join', function (opponents) {
	console.log('Opponents joining game');
});

app.use('/', express.static('client'));

http.listen(port, function () {
    console.log('Running our app at http://localhost:' + port)
});