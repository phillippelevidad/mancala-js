function Player(id, name) {
    this.id = id;
    this.name = name;
}

Player.prototype.getId = function () {
    return this.id;
};

Player.prototype.getName = function () {
    return this.name;
};