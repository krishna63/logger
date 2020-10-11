// lib/app.ts
import express = require('express');
var JL = require('jsnlog').JL;
var path = require('path');
var jsnlog_nodejs = require('jsnlog-nodejs').jsnlog_nodejs;

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

var serveStatic = require('serve-static');
var bodyParser = require('body-parser'); 

// Create a new express application instance
const app: express.Application = express();

// In this example, static files to be sent to the client (such as jsnlog.js) live in the public directory. 
app.use(serveStatic('public'))

// Log message directly from the server, to show you can log both from the client and from the server.
//JL().info('log message from server');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// parse application/json.
// Log messages from the client use POST and have a JSON object in the body.
// Ensure that those objects get parsed correctly.
app.use(bodyParser.json());
app.get('postToSplunk',function(req,res) {
    res.send('');
})

app.post('postToSplunk',function(req,res) {
	res.send('');
})


app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});