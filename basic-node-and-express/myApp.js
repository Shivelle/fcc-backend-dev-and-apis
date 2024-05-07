require('dotenv').config();

let bodyParser = require("body-parser");
let express = require('express');
let app = express();

// Log something on server start
console.log("Hello World");

app.get('/', (req, res) => {
    // Then log something in console
    // res.send('Hello Express');

    // Then send file 
    let path = __dirname + '/views/index.html';
    res.sendFile(path);
});

// Create API: Route that responds with JSON at the path /json
app.get('/json', (req, res) => {
    // Example response
    // res.json({"message": "Hello json"});

    // Transform by .env var
    const message = "Hello json";
    res.json({
        "message": process.env.MESSAGE_STYLE === 'uppercase' ? message.toUpperCase() : message
    });
});

// Logger middleware - Needs to be placed first
function logRequest(req, res, next) {
    const method = req.method;
    const path = req.path;
    const ip = req.ip;
    console.log(`${method} ${path} - ${ip}`);
    next();
}

app.use(logRequest);

// Chaining middleware functions
app.get('/now', (req, res, next) => {
    req.time = new Date().toString();
    next();
}, (req, res) => {
    res.json({ time: req.time });
});

// Handling route params
// Echo word by param
app.get('/:word/echo', (req, res) => {
    const word = req.params.word;
    res.json({ echo: word });
});

// Handling route params II - query strings
app.get('/name', (req, res) => {
    res.json({ name: `${req.query.first} ${req.query.last}`})
});

// Use body-parser to parse POST Request
// URL-encoded = query strings in request body (the payload)
// AJAX = JSON instead
// multipart/form-data = Used to upload binary files
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/name', (req, res) => {
    res.json({ name: `${req.body.first} ${req.body.last}` });
});

// Serve static assets by using a middleware
// "Basically, middleware are functions that intercept
// route handlers, adding some kind of information."
app.use('/public', express.static(__dirname + '/public'));

module.exports = app;
