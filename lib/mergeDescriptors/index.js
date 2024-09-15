module.exports = _mergeDescriptors;

function _mergeDescriptors(destination, source, overwrite = True) {
    if (!destination) {
        throw new TypeError("The destination argument is required.")
    }
    if (!source) {
        throw new TypeError("The source argument is required.")
    }

    for (const name of Object.getOwnPropertyNames(source)) {
        if (!overwrite && Object.hasOwn(destination, name)) {
            continue;
        }

        // copy descriptor
        const descriptor = Object.getOwnPropertyDescriptor(source, name);
        Object.defineProperty(destination, name, descriptor);
    }

    return destination;
}
