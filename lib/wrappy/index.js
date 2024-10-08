module.exports = wrappy
function wrappy(fn, cb) {
    if (fn && cb) return wrappy(fn)(cb)

    if (typeof fn !== 'function')
        throw new TypeError('need wrapper function')

    Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k]
    })

    return wrapper

    function wrapper() {
        var ret = fn.apply(this, arguments)
        var cb = arguments[arguments.length - 1]
        if (typeof ret === 'function' && ret !== cb) {
            Object.keys(cb).forEach(function(k) {
                ret[k] = cb[k]
            })
        }
        return ret
    }
}
