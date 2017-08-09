const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const router = require('express').Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8000; // set our port

// Handle CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/people', require('./routes'));
console.log("Kompis apiet mår bra!");
app.listen(port);
