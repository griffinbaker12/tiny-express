function EventEmitter() {
    this.events = {};
}

EventEmitter.prototype.on = function(event, cb) {
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(cb);
    // why do we return this? TO ALLOW FOR CHAINING
    return this;
}

EventEmitter.prototype.emit = function(event, ...args) {
    const callbacks = this.events[event];
    if (!callbacks) return false;

    callbacks.forEach(cb => {
        console.log('inside arrow', this);
        // what does this do and why do we do it this way?
        cb.apply(this, args);
        // instead of like
        // cb(...args) ?
    })
}

var ee = new EventEmitter();
ee.on('message', function(t) {
    console.log('this', this)
    console.log(t);
});
ee.emit('message', 'hey');

function foo() { console.log(this) }

function hey() {
    (() => console.log(this))();
    console.log(this)
}
new hey()
console.log(hey.prototype, foo.prototype, (function r() { }).prototype)
