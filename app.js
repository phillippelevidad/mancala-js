function App() {
    this.eventHub = null;
    this.game = null;
    this.domAdapter = null;
}

App.prototype.init = function () {
    this.eventHub = new EventHub();
    this.game = new Game(this.eventHub);
    this.domAdapter = new DomAdapter(this.eventHub);

    this.setupEventHandlers();
    this.setupDomAdapter();

    this.game.start();
};

App.prototype.setupEventHandlers = function () {
    this.eventHub.registerHandler(
        SeedDistributionCompletedEvent,
        this.game, 'actOnSeedDistributionCompleted');

    this.eventHub.registerHandler(
        PlayerTurnSetEvent,
        this.domAdapter, 'handlePlayerTurnSetEvent');

    this.eventHub.registerHandler(
        HolePickedEvent,
        this.game, 'actOnHolePicked');

    this.eventHub.registerHandler(
        HoleInfosUpdatedEvent,
        this.domAdapter, 'handleHoleInfosUpdated');

    this.eventHub.registerHandler(
        SeedDistributionCompletedEvent,
        this.domAdapter, 'handleSeedDistributionCompleted');

    this.eventHub.registerHandler(
        HoleVisitedEvent,
        this.domAdapter, 'handleHoleVisited');
};

App.prototype.setupDomAdapter = function () {
    this.domAdapter.createDomLink();
};