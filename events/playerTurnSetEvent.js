function PlayerTurnSetEvent(activePlayer) {
    this.activePlayer = activePlayer;
}

PlayerTurnSetEvent.prototype.getActivePlayer = function () {
    return this.activePlayer;
};