var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	generate = require('project-name-generator');
	game = require('socket.io-client')('http://localhost:3000')
	port = process.env.PORT || 8080,
	
	players = [];
	games = [];

var activeGames = function () {
	return games.filter(function (game) {
		return game.state = 'started';
	});
};

game.on('connect', function () {
	console.log('Conntected to game');
	game.emit('subscribe');
});

game.on('started', function (gameId) {
	var game = games.find(function (game) {
		return game.id = gameId;
	});
	game.state = 'started';

	io.emit('games', activeGames());
});

game.on('ended', function (ending) {
	games = games.filter(function (game) {
		return game.id !== ending.id;
	});

	io.emit('games', activeGames());
});

game.on('disconnect', function () {
	games = [];
	io.emit('games', activeGames());
});

io.on('connect', function (socket) {
    console.log('Player/viewer connected');
    
    socket.on('update', function () {
    	io.emit('players', players);
    	io.emit('games', activeGames());
    });
	
	socket.on('enter', function (name) {
		console.log(name + ' entered the lobby');
		players.push({name: name, id: socket.id});
		io.emit('players', players);
	});

	socket.on('join', function (opponents) {
		var gameId = generate().dashed,
			white = players.find(function (player) {
				return player.name === opponents.white;
			}),
			black = players.find(function (player) {
				return player.name === opponents.black;
			});

		games.push({
			id: gameId,
			white: white.name,
			black: black.name,
			state: 'starting'
		});

		socket.broadcast.to(black.id).emit('join', gameId);
		socket.broadcast.to(white.id).emit('join', gameId);
	});

	socket.on('disconnect', function () {
		console.log('Player left the lobby');
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
