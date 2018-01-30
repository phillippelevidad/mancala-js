function EventHub() {
    this.handlers = [];
}

EventHub.prototype.publish = function (event) {
    var eventType = event.constructor.name;
    for (var i in this.handlers) {
        var entry = this.handlers[i];
        if (entry.eventType === eventType) {
            var fn = entry.thisArgument[entry.fnName];
            fn.call(entry.thisArgument, event);
        }
    }
};

EventHub.prototype.registerHandler = function (event, thisArgument, fnName) {
    this.handlers.push({ eventType: event.name, thisArgument: thisArgument, fnName: fnName });
};
