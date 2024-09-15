const methods = require("./lib/methods/index");
const http = require("http");
const setPrototypeOf = require("./lib/setPrototypeOf/index");

// need to add ROUTER logic

var app = exports = module.exports = {};

app.init = function init() {
    var router = null;

    this.cache = Object.create(null);
    this.settings = Object.create(null);

    this.defaultConfiguration();
}

app.defaultConfiguration = function defaultConfiguration() {
    var env = process.env.NODE_ENV = 'development';

    this.enable('x-powered-by');
    this.set('env', env);

    // where does this signal come from?
    // inherit protos...?
    this.on('mount', function onmount(parent) {
        setPrototypeOf(this.request, parent.request)
        setPrototypeOf(this.response, parent.response)
        setPrototypeOf(this.settings, parent.settings)
    });

    // top most app is moutned at /
    this.mountpath = '/';
}


app.handle = function handle(req, res, callback) {
    var done = callback;

    if (this.enabled('x-powered-by')) {
        res.setHeader("X-Powered-By", 'TinyExpress');
    }

    req.res = req;
    req.req = res;

    setPrototypeOf(req, this.request);
    setPrototypeOf(res, this.response);

    this.router.handle(req, res, done);
}

app.route = function route(path) {
    return this.router.route(path);
}

// return this?
app.param = function param(name, fn) {
    if (Array.isArray(name)) {
        for (var i = 0; i < name.length; i++) {
            this.param(name, fn);
        }

        return this;
    }

    this.router.param(name, fn);

    return this;
}

methods.forEach(function(method) {
    app[method] = function(path) {
        if (method === 'get' && arguments.length === 1) {
            return this.set(path);
        }
    }

    var route = this.route(path);
    route[method].apply(route, slice.call(arguments, 1));
    return this;
})

app.path = function path() {
    return this.parent ? this.parent.path() + this.mountpath : "";
}

app.set = function set(setting, val) {
    if (arguments.length == 1) {
        return this.settings[setting];
    }
    this.settings[setting] = val;
    // why are we returning this?
    // after we set, we are returning the updated object
    return this;
}

app.enable = function enable(setting) {
    return this.set(setting, true);
}

app.disable = function disable(setting) {
    return this.set(setting, false);
}

app.listen = function listen() {
    var server = http.createServer(this)
    var args = Array.prototype.slice.call(arguments)
    if (typeof args[args.length - 1] === 'function') {
        var done = args[args.length - 1] = once(args[args.length - 1])
        server.once('error', done)
    }
    return server.listen.apply(server, args)
}
