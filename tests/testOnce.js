function once(fn) {
    if (this.called && this.called[fn.name]) {
        console.log("already called");
        return;
    }
    this.called = {};
    this.called[fn.name] = true
    fn();
}

const printRunning = () => console.log("running!");

once(printRunning);
once(printRunning);
