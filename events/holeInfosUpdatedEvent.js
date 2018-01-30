function HoleInfosUpdatedEvent(holes) {
    this.holes = holes;
}

HoleInfosUpdatedEvent.prototype.getHoles = function () {
    return this.holes;
};