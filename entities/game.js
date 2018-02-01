function Game(eventHub) {
    this.eventHub = eventHub;
    this.mancala = new Mancala(this.eventHub);
    this.activePlayer = null;
    this.gameEnded = false;
    this.player1 = null;
    this.player2 = null;
}

Game.prototype.changeActivePlayer = function () {
    this.activePlayer = this.activePlayer.getId() === this.player1.getId()
        ? this.player2
        : this.player1;
    this.eventHub.publish(new PlayerTurnSetEvent(this.activePlayer));
};

Game.prototype.checkEndGame = function () {
    var p1Empty = this.mancala.arePlayerHolesEmpty(this.player1.getId());
    var p2Empty = this.mancala.arePlayerHolesEmpty(this.player2.getId());

    if (p1Empty || p2Empty)
        this.gameEnded = true;
};

Game.prototype.fireGameEndedEvent = function () {
    var p1 = this.player1;
    var p2 = this.player2;

    var endGameStatus = {
        player1: {
            id: p1.getId(), name: p1.getName(),
            score: this.mancala.getPlayerScore(p1.getId())
        },
        player2: {
            id: p2.getId(), name: p2.getName(),
            score: this.mancala.getPlayerScore(p2.getId())
        }
    };

    var isDraw = endGameStatus.player1.score === endGameStatus.player2.score;
    var winner = isDraw ? null :
        endGameStatus.player1.score > endGameStatus.player2.score ?
            endGameStatus.player1 : endGameStatus.player2;

    endGameStatus['isDraw'] = isDraw;
    endGameStatus['winner'] = winner;
    this.eventHub.publish(new GameEndedEvent(endGameStatus));
};

Game.prototype.start = function () {
    this.player1 = new Player('player1', 'Player 1');
    this.player2 = new Player('player2', 'Player 2');
    this.mancala.arrange(this.player1.getId(), this.player2.getId());
    this.activePlayer = this.player1;
    this.eventHub.publish(new PlayerTurnSetEvent(this.activePlayer));
};

Game.prototype.handleHolePicked = function (eventData) {
    var holeId = eventData.getHoleId();
    var playerId = this.activePlayer.getId();

    if (!this.mancala.playerCanPickHole(playerId, holeId))
        throw new Error(playerId + ' cannot pick ' + holeId + '.');
    
    this.mancala.distributeSeedsFromHole(playerId, holeId);
};

Game.prototype.handleSeedDistributionCompleted = function(eventData) {
    this.checkEndGame();
    
    if (!this.gameEnded) {
        var lastVisitedHole = eventData.getLastVisitedHole();

        if (lastVisitedHole.isKalah) {
            this.eventHub.publish(new PlayerTurnSetEvent(this.activePlayer)); // play again
            return;
        }
        else if (lastVisitedHole.getSeedCount() === 1 && lastVisitedHole.getPlayerId() === this.activePlayer.getId()) {
            this.mancala.robSeedsFromOppositeHole(lastVisitedHole.getId());
            this.eventHub.publish(new HoleInfosUpdatedEvent(this.mancala.getAllHoles()));
            this.checkEndGame();
        }
    }

    if (this.gameEnded) this.fireGameEndedEvent();
    else this.changeActivePlayer();
};