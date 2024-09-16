// Simplified Layer
function Layer(path, fn) {
    this.path = path;
    this.handle = fn;
}

Layer.prototype.match = function(path) {
    return this.path === path;
};

// Simplified Route
function Route(path) {
    this.path = path;
    this.stack = [];  // Stack of Layers
    this.methods = {};
}

Route.prototype.get = function(handler) {
    const layer = new Layer('/', handler);
    layer.method = 'get';
    this.methods['get'] = true;
    this.stack.push(layer);
};

// Simplified Router
function Router() {
    this.stack = [];  // Stack of Layers, some of which might point to Routes
}

Router.prototype.use = function(path, fn) {
    if (typeof path === 'function') {
        fn = path;
        path = '/';
    }
    const layer = new Layer(path, fn);
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

Router.prototype.route = function(path) {
    const route = new Route(path);
    const layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer);
    return route;
};

Router.prototype.get = function(path, handler) {
    const route = this.route(path);
    route.get(handler);
};

Router.prototype.handle = function(req, res, done) {
    let idx = 0;
    const self = this;

    function next() {
        const layer = self.stack[idx++];
        if (!layer) return done();

        if (layer.match(req.url)) {
            if (layer.route) {
                // It's a route handler
                if (layer.route.methods[req.method.toLowerCase()]) {
                    layer.handle(req, res, next);
                } else {
                    next();
                }
            } else {
                // It's middleware
                layer.handle(req, res, next);
            }
        } else {
            next();
        }
    }

    next();
};

// Usage
const router = new Router();

router.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
});

router.get('/hello', (req, res) => {
    console.log("hey")
    res.end('Hello, World!');
});

// Simulate incoming request
router.handle({ url: '/hello', method: 'GET' },
    { end: (msg) => console.log(msg) },
    () => console.log('Request handled'));
