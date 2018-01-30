function SeedDistributionCompletedEvent(lastVisitedHole) {
    this.lastVisitedHole = lastVisitedHole;
}

SeedDistributionCompletedEvent.prototype.getLastVisitedHole = function () {
    return this.lastVisitedHole;
};