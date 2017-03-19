var lobby = io(),
    allPlayers = [],

    joinGame = function () {
        if (allPlayers.length < 2) {
            console.log('Not enough players...');
            return;
        }
        console.log('Joining game!');
        console.log({
            white: allPlayers[0].name,
            black: allPlayers[1].name
        });

        lobby.emit('join', {
            white: allPlayers[0].name,
            black: allPlayers[1].name
        });
    };

lobby.on('connect', function () {
    console.log("Connected to lobby");
    lobby.emit('players');
});

lobby.on('players', function (players) {
    console.log(players);
    allPlayers = players;

    var tbody = document.getElementById('players');
    tbody.innerHTML = '';

    players.forEach(function (player) {
        var tr = document.createElement('tr'),
            name = document.createElement('td'),
            playingAs = document.createElement('td'),
            game = document.createElement('td');
        
        name.textContent = player.name;
        playingAs.textContent = player.playingAs;
        game.textContent = player.game;
        
        tr.appendChild(name);
        tr.appendChild(playingAs);
        tr.appendChild(game);
        tbody.appendChild(tr);
    });
});