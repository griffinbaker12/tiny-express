function Route(path) {
    this.path = path;
    this.stack = [];
    this.methods = {};
}

Route.prototype.get = function(handler) {
    const layer = new Layer('/', handler);
    layer.method = 'get';
    this.methods['get'] = true;
    this.stack.push(layer);
};

Route.prototype.dispatch = function(req, res, next) {
    let idx = 0;
    const self = this;

    function nextLayer(err) {
        if (err) return next(err);

        const layer = self.stack[idx++];
        if (!layer) return next();

        if (layer.method === req.method.toLowerCase()) {
            layer.handle(req, res, nextLayer);
        } else {
            nextLayer();
        }
    }

    nextLayer();
};
