const methods = require("./lib/methods.js");

var app = exports = module.exports = {};

app.init = function init() {
    this.settings = Object.create(null);
    this.defaultConfiguration();
}

app.defaultConfiguration = function defaultConfiguration() {
    var env = process.env.NODE_ENV = 'development';

    this.enable('x-powered-by');
    this.set('env', env);
}

app.set = function set(setting, val) {
    this.settings[setting] = val;
}

app.enable = function enable(setting) {
    return this.set(setting, true);
}

app.disable = function disable(setting) {
    return this.set(setting, false);
}
