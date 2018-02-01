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

App.prototype.setupDomAdapter = function () {
    this.domAdapter.createDomLink();
};

App.prototype.setupEventHandlers = function () {
    this.eventHub.registerHandler(
        GameEndedEvent,
        this.domAdapter, 'handleGameEnded');

    this.eventHub.registerHandler(
        HoleInfosUpdatedEvent,
        this.domAdapter, 'handleHoleInfosUpdated');

    this.eventHub.registerHandler(
        HolePickedEvent,
        this.game, 'handleHolePicked');
    
    this.eventHub.registerHandler(
        HoleVisitedEvent,
        this.domAdapter, 'handleHoleVisited');

    this.eventHub.registerHandler(
        PlayerTurnSetEvent,
        this.domAdapter, 'handlePlayerTurnSet');

    this.eventHub.registerHandler(
        SeedDistributionCompletedEvent,
        this.domAdapter, 'handleSeedDistributionCompleted');

    this.eventHub.registerHandler(
        SeedDistributionCompletedEvent,
        this.game, 'handleSeedDistributionCompleted');
};