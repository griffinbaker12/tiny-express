const express = require('express');
app = express()

app.get("/", (req, res) => {
    res.send("hello world");
})

app.listen(3001, () => {
    console.log('hey');
})
