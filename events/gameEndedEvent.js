function GameEndedEvent(endGameStatus) {
    this.endGameStatus = endGameStatus;
}

GameEndedEvent.prototype.getEndGameStatus = function () {
    return this.endGameStatus;
};