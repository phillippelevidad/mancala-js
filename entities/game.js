function Game(eventHub) {
    this.eventHub = eventHub;
    this.mancala = new Mancala(this.eventHub);
    this.activePlayer = null;
    this.gameEnded = false;
}

Game.prototype.start = function () {
    this.mancala.arrange();
    this.activePlayer = this.mancala.getPlayer1();
    this.eventHub.publish(new PlayerTurnSetEvent(this.activePlayer));
};

Game.prototype.changeActivePlayer = function () {
    this.activePlayer = this.activePlayer.getId() === this.mancala.getPlayer1().getId()
        ? this.mancala.getPlayer2()
        : this.mancala.getPlayer1();
    this.eventHub.publish(new PlayerTurnSetEvent(this.activePlayer));
};

Game.prototype.checkEndGame = function () {
    if (this.mancala.arePlayerHolesEmpty(this.activePlayer.getId())) {
        this.gameEnded = true;
    }
};

Game.prototype.actOnHolePicked = function (eventData) {
    var holeId = eventData.getHoleId();
    var playerId = this.activePlayer.getId();

    if (!this.mancala.playerCanPickHole(playerId, holeId))
        throw new Error(playerId + ' cannot pick ' + holeId + '.');
    
    this.mancala.distributeSeedsFromHole(playerId, holeId);
};

Game.prototype.actOnSeedDistributionCompleted = function(eventData) {
    var lastVisitedHole = eventData.getLastVisitedHole();
    this.checkEndGame();
    
    if (!this.gameEnded) {
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

    if (this.gameEnded) this.eventHub.publish(new GameEndedEvent());
    else this.changeActivePlayer();
};

Game.prototype.getHoleIdNamePairs = function (playerId) {
    var retList = [];
    var holes = this.mancala.getAllHoles();

    for (var i in holes)
        if (holes[i].getPlayerId() === playerId)
            retList.push({ id: holes[i].getId(), name: holes[i].getName() });

    return retList;
};