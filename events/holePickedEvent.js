function HolePickedEvent(holeId) {
    this.holeId = holeId;
}

HolePickedEvent.prototype.getHoleId = function () {
    return this.holeId;
};