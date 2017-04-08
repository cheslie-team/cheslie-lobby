var lobby = io(),

    displayPlayers = function () {},

    joinGame = function () {
        var opponents = Url.parseQuery(Url.hash());
        if (!opponents.white || !opponents.black) {
            alert('Not enough players...');
            return;
        }
        lobby.emit('join', {
            white: opponents.white,
            black: opponents.black
        });
    };

window.onhashchange = function () {
    displayPlayers();
};

lobby.on('connect', function () {
    lobby.emit('update');
});

lobby.on('players', function (players) {
    displayPlayers = function () {
        var collection = document.getElementById('players');
        collection.innerHTML = '';

        players.forEach(function (player) {
            var opponents = Url.parseQuery(Url.hash()),
                item = document.createElement('a');
        
            item.setAttribute('class', 'collection-item');

            if (opponents.white === player.name) {
                item.setAttribute('class', 'collection-item active');
                delete opponents.white
            }
            else if (opponents.black === player.name) {
                item.setAttribute('class', 'collection-item active');
                delete opponents.black
            }
            else if (!opponents.white) {
                opponents.white = player.name;
            }
            else {
                opponents.black = player.name;
            }

            item.setAttribute('href', '#' + Url.stringify(opponents));
            item.textContent = player.name;
            collection.appendChild(item);
        });
    };

    displayPlayers();
});

lobby.on('games', function (games) {
    var collection = document.getElementById('games');
    collection.innerHTML = '';
    
    games.forEach(function (game) {
        var item = document.createElement('a');
    
        item.setAttribute('class', 'collection-item');
        item.setAttribute('href', '/redirect-to-game?game=' + game.id);
        item.setAttribute('target', '_blank');
        item.textContent = game.white + ' vs ' + game.black;
        collection.appendChild(item);    
    });
});

