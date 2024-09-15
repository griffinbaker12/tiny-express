var http = require("http");

module.exports = getCurrentNodeMethods() || getBasicNodeMethods();

function getCurrentNodeMethods() {
    return http.METHODS.map(m => m.toLowerCase());
}

function getBasicNodeMethods() {
    // won't use more than these
    return [
        'get', 'post', 'put', 'delete',
    ]
}


