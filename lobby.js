var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	port = 3030,
	
	players = [];

io.on('connect', function (socket) {
    var id = socket.id;

    console.log('Player/viewer connected');
    
    socket.on('players', function () {
    	io.emit('players', players);
    });
	
	socket.on('enter', function (name) {
		console.log(name + ' entered the lobby');
		players.push({name: name, id: id});
		io.emit('players', players);
	});

	socket.on('join', function (opponents) {
		console.log('Opponents joining game: ' + opponents);

		console.log(players);
		
		var white = players.find(function (player) {
			return player.name === opponents.white;
		});
		console.log('White: ' + white);

		var black = players.find(function (player) {
			return player.name === opponents.black;
		});
		console.log('Black: ' + black);

		socket.broadcast.to(white.id).emit('join', 'test_game');
		socket.broadcast.to(black.id).emit('join', 'test_game');
	});

	socket.on('disconnect', function () {
		players = players.filter(function (player) {
			return player.id !== id;
		});
		io.emit('players', players);
	});
});

app.use('/', express.static('client'));

http.listen(port, function () {
    console.log('Running our app at http://localhost:' + port)
});