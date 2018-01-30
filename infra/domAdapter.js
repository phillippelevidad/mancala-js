function DomAdapter(eventHub) {
    this.eventHub = eventHub;
    this.highlightStep = 1;
}

DomAdapter.prototype.createDomLink = function () {
    var self = this;
    var holeIds = 'h1a,h1b,h1c,h1d,h1e,h1f,h1g,h2a,h2b,h2c,h2d,h2e,h2f,h2g'.split(',');

    $.each(holeIds, function (i, id) {
        $('#' + id).click(function (e) {
            var holeId = $(this).attr('id');
            self.eventHub.publish(new HolePickedEvent(holeId));
        });
    });
};

DomAdapter.prototype.handleGameEndedEvent = function (eventData) {
};

DomAdapter.prototype.handleHoleInfosUpdated = function (eventData) {
    var holes = eventData.getHoles();

    $.each(holes, function (ix, item) {
        var id = item.getId();
        var el = $('#' + id);
        el.find('.seed-count').text(item.getSeedCount());
        el.find('.hole-name').text(item.getName());

        if (id === 'h1g')
            $('#scoreBoard #player1 .player-score').text(item.getSeedCount())
        else if (id === 'h2g')
            $('#scoreBoard #player2 .player-score').text(item.getSeedCount())
    });
};

DomAdapter.prototype.handlePlayerTurnSetEvent = function (eventData) {
    var id = eventData.getActivePlayer().getId();
    var name = eventData.getActivePlayer().getName();

    $('#activePlayer .player-name').text(name);

    var classToActivate = id === 'player1' ? 'p1-holes' : 'p2-holes';
    $('.p1-holes, .p2-holes').removeClass('active');
    $('.' + classToActivate).addClass('active');
};

DomAdapter.prototype.handleSeedDistributionCompleted = function (eventData) {
    this.highlightStep = 1;

    return;
    var lastVisitedHole = eventData.getLastVisitedHole();
    var speed = 150;

    window.setTimeout(function () {
        $('#' + lastVisitedHole.getId())
            .fadeIn(speed).fadeOut(speed).fadeIn(speed)
            .fadeOut(speed).fadeIn(speed);
    }, speed);
};

DomAdapter.prototype.handleHoleVisited = function (eventData) {
    var hole = $('#' + eventData.getHoleId());
    var speed = 150;

    window.setTimeout(function () {
        hole.fadeIn(speed).fadeOut(speed).fadeIn(speed);
    }, this.highlightStep * 50);

    this.highlightStep += 1;
};
