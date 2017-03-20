var lobby = io();

lobby.on('connect', function () {
    console.log("Connected to lobby");
    lobby.emit('update');
});

lobby.on('players', function (players) {
    var collection = document.getElementById('players');
    collection.innerHTML = '';

    players.forEach(function (player) {
        var contestants = Url.parseQuery(),
            item = document.createElement('a');
        item.setAttribute('class', 'collection-item');

        if (contestants.white === player.name) {
            item.setAttribute('class', 'collection-item active');
            delete contestants.white
        }
        else if (contestants.black === player.name) {
            item.setAttribute('class', 'collection-item active');
            delete contestants.black
        }
        else if (!contestants.white) {
            console.log(player.name);
            contestants.white = player.name;
        }
        else {
            console.log(player.name);
            contestants.black = player.name;
        }

        item.setAttribute('href', '?' + Url.stringify(contestants));
        item.textContent = player.name;
        collection.appendChild(item);
    });
});

lobby.on('games', function (games) {
    var collection = document.getElementById('games');
    collection.innerHTML = '';
    
    games.forEach(function (game) {
        var item = document.createElement('a');
    
        item.setAttribute('class', 'collection-item');
        item.setAttribute('href', 'http://localhost:8080/#' + game.name);
        item.setAttribute('target', '_blank');
        item.textContent = game.white + ' vs ' + game.black;
        collection.appendChild(item);    
    });
});

var joinGame = function () {
    var contestants = Url.parseQuery();
    if (!contestants.white || !contestants.black) {
        alert('Not enough players...');
        return;
    }
    lobby.emit('join', {
        white: contestants.white,
        black: contestants.black
    });
};