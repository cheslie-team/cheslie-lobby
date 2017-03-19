var lobby = io(),
    selectedPlayers = [],

    joinGame = function () {
        lobby.emit('join', selectedPlayers);
    };

lobby.on('connect', function () {
    console.log("Connected to lobby");
});

lobby.on('players', function (players) {
    console.log(players);

    if (players.length > 1) {
        selectedPlayers = [players[0], players[1]];
    }

    var tbody = document.getElementById('players');

    console.log(tbody);

    tbody.innerHTML = '';

    players.forEach(function (player) {
        var tr = document.createElement('tr'),
            name = document.createElement('td');
        
        name.textContent = player.name;
        
        tr.appendChild(name);
        tbody.appendChild(tr);
    });
});