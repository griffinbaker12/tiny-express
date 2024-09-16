function Router() {
    this.routes = [];
}

Router.prototype.route = function(path) {
    var route = { path: path, stack: [] };
    this.routes.push(route);
    return route;
}
