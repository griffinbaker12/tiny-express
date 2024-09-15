var mixin = require('./lib/mergeDescriptors');
var proto = require('./application.js');

exports = module.exports = createApplication;

function createApplication() {
    var app = function(req, res, next) {
        app.handle(req, res, next);
    }

    mixin(app, proto, false);

    app.init();
    console.log("app we created", app)
    return app;
}

createApplication();
