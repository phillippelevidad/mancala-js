function Mancala(eventHub) {
    this.eventHub = eventHub;    
}

Mancala.prototype.arrange = function () {
    this.player1 = new Player('player1', 'Player 1');
    this.player2 = new Player('player2', 'Player 2');

    this.hole1a = new Hole('h1a', '1A', 'player1', 6, false);
    this.hole1b = new Hole('h1b', '1B', 'player1', 6, false);
    this.hole1c = new Hole('h1c', '1C', 'player1', 6, false);
    this.hole1d = new Hole('h1d', '1D', 'player1', 6, false);
    this.hole1e = new Hole('h1e', '1E', 'player1', 6, false);
    this.hole1f = new Hole('h1f', '1F', 'player1', 6, false);
    this.hole1g = new Hole('h1g', '1G', 'player1', 0, true);

    this.hole2a = new Hole('h2a', '2A', 'player2', 6, false);
    this.hole2b = new Hole('h2b', '2B', 'player2', 6, false);
    this.hole2c = new Hole('h2c', '2C', 'player2', 6, false);
    this.hole2d = new Hole('h2d', '2D', 'player2', 6, false);
    this.hole2e = new Hole('h2e', '2E', 'player2', 6, false);
    this.hole2f = new Hole('h2f', '2F', 'player2', 6, false);
    this.hole2g = new Hole('h2g', '2G', 'player2', 0, true);

    this.hole1a.setRelatedHoles(this.hole1b, this.hole2f);
    this.hole1b.setRelatedHoles(this.hole1c, this.hole2e);
    this.hole1c.setRelatedHoles(this.hole1d, this.hole2d);
    this.hole1d.setRelatedHoles(this.hole1e, this.hole2c);
    this.hole1e.setRelatedHoles(this.hole1f, this.hole2b);
    this.hole1f.setRelatedHoles(this.hole1g, this.hole2a);
    this.hole1g.setRelatedHoles(this.hole2a, null);

    this.hole2a.setRelatedHoles(this.hole2b, this.hole1f);
    this.hole2b.setRelatedHoles(this.hole2c, this.hole1e);
    this.hole2c.setRelatedHoles(this.hole2d, this.hole1d);
    this.hole2d.setRelatedHoles(this.hole2e, this.hole1c);
    this.hole2e.setRelatedHoles(this.hole2f, this.hole1b);
    this.hole2f.setRelatedHoles(this.hole2g, this.hole1a);
    this.hole2g.setRelatedHoles(this.hole1a, null);

    this.eventHub.publish(new HoleInfosUpdatedEvent(this.getAllHoles()));
};

Mancala.prototype.distributeSeedsFromHole = function (playerId, holeId) {
    var hole = this.getHole(holeId);
    var seedCount = hole.getSeedCount();
    hole.setSeedCount(0);

    var lastVisitedHole = hole;

    while (seedCount > 0) {
        lastVisitedHole = lastVisitedHole.getNextHole();
        
        if (lastVisitedHole.getPlayerId() === playerId || !lastVisitedHole.isKalah) {
            lastVisitedHole.addSeed();
            seedCount--;
            this.eventHub.publish(new HoleVisitedEvent(lastVisitedHole.getId()));
        }
    }

    this.eventHub.publish(new HoleInfosUpdatedEvent(this.getAllHoles()));
    this.eventHub.publish(new SeedDistributionCompletedEvent(lastVisitedHole));
}

Mancala.prototype.getAllHoles = function () {
    return [
        this.hole1a, this.hole1b, this.hole1c,
        this.hole1d, this.hole1e, this.hole1f,
        this.hole1g,
        this.hole2a, this.hole2b, this.hole2c,
        this.hole2d, this.hole2e, this.hole2f,
        this.hole2g
    ];
};

Mancala.prototype.getHole = function (holeId) {
    var allHoles = this.getAllHoles();
    
    for (var i in allHoles)
        if (allHoles[i].getId() === holeId)
            return allHoles[i];
}

Mancala.prototype.getPlayer1 = function () {
    return this.player1;
};

Mancala.prototype.getPlayer2 = function () {
    return this.player2;
};

Mancala.prototype.playerCanPickHole = function (playerId, holeId) {
    var allHoles = this.getAllHoles();
    
    for (var i in allHoles) {
        var h = allHoles[i];
        if (h.getId() !== holeId) continue;
        if (h.isKalah) return false;
        if (h.getPlayerId() !== playerId) return false;
        if (h.getSeedCount() === 0) return false;
    }
    
    return true;
};

Mancala.prototype.robSeedsFromOppositeHole = function (holeId) {
    var hole = this.getHole(holeId);
    var opposite = hole.getOppositeHole();
    var playerId = hole.getPlayerId();
    var playerKalah = this.getHole(playerId == 'player1' ? 'h1g' : 'h2g');

    if (opposite.getSeedCount() == 0)
        return;

    playerKalah.addSeeds(hole.getSeedCount() + opposite.getSeedCount());
    hole.setSeedCount(0);
    opposite.setSeedCount(0);
};

Mancala.prototype.arePlayerHolesEmpty = function (playerId) {
    var holes = this.getAllHoles();

    for (var i in holes) {
        if (holes[i].getPlayerId() !== playerId) continue;
        if (!holes[i].isKalah && holes[i].getSeedCount() > 0) return false;
    }

    return true;
}