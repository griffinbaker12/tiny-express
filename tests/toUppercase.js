function toUpperCase(s) {
    return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return toUpperCase(this);
    },
    // what is this?
    configurable: true
})

console.log('hey'.captalize()) // "Hey"
