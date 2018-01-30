function Hole(id, name, playerId, seedCount, isKalah) {
    this.id = id;
    this.name = name;
    this.playerId = playerId;
    this.seedCount = seedCount;
    this.isKalah = isKalah;
    this.nextHole = null;
    this.oppositeHole = null;
}

Hole.prototype.addSeed = function () {
    this.seedCount += 1;
}

Hole.prototype.addSeeds = function(count) {
    this.seedCount += count;
}

Hole.prototype.getId = function () {
    return this.id;
};

Hole.prototype.getName = function () {
    return this.name;
};

Hole.prototype.getNextHole = function () {
    return this.nextHole;
};

Hole.prototype.getOppositeHole = function () {
    return this.oppositeHole;
};

Hole.prototype.getPlayerId = function () {
    return this.playerId;
};

Hole.prototype.getSeedCount = function () {
    return this.seedCount;
};

Hole.prototype.setRelatedHoles = function (nextHole, oppositeHole) {
    this.nextHole = nextHole;
    this.oppositeHole = oppositeHole;
};

Hole.prototype.setSeedCount = function (seedCount) {
    this.seedCount = seedCount;
};
