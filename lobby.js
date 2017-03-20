var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	generate = require('project-name-generator');
	port = 3030,
	
	players = [];
	games = [];

io.on('connect', function (socket) {
    console.log('Player/viewer connected');
    
    socket.on('update', function () {
    	io.emit('players', players);
    	io.emit('games', games);
    });
	
	socket.on('enter', function (name) {
		console.log(name + ' entered the lobby');
		players.push({name: name, id: socket.id});
		io.emit('players', players);
	});

	socket.on('join', function (opponents) {
		var gameName = generate().dashed,
			white = players.find(function (player) {
				return player.name === opponents.white;
			}),
			black = players.find(function (player) {
				return player.name === opponents.black;
			});

		console.log('Opponents joining game: ' + gameName);
		
		white.playingAs = 'white';
		white.game = gameName;

		black.playingAs = 'black';
		black.game = gameName;

		socket.broadcast.to(white.id).emit('join', gameName);
		socket.broadcast.to(black.id).emit('join', gameName);

		games.push({
			name: gameName,
			white: opponents.white,
			black: opponents.black
		});
		io.emit('games', games);
	});

	socket.on('disconnect', function () {
		players = players.filter(function (player) {
			return player.id !== socket.id;
		});
		io.emit('players', players);
	});
});

app.use('/', express.static('client'));

http.listen(port, function () {
    console.log('Running our app at http://localhost:' + port)
});