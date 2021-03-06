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

JL._createXMLHttpRequest = function() {
	return xhr;
}

var appender = JL.createAjaxAppender("example appender");
var beforeSendExampple = function(xhr:any) {
	console.log('---before send example----')
	xhr.setRequestHeader('Authorization', '123445')
};
appender.setOptions({
	'beforeSend': beforeSendExampple,
	'url':'http://localhost:3001/postToSplunk'
});
JL().setOptions({
	"appenders": [appender]
});

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

app.post('postToSplunk',function(req,res) {
	res.send('');
})

// jsnlog.js on the client by default sends log messages to jsnlog.logger, using POST.
app.post('*.logger', function (req, res) { 

    // Process incoming log messages, by handing to the server side jsnlog.
    // JL is the object that you got at
    // var JL = require('jsnlog').JL;
    jsnlog_nodejs(JL, req.body);
    console.log('-------received message from client------------')
    //JL().log('Hellow every body')
    //JL().info("log message");

    // Send empty response. This is ok, because client side jsnlog does not use response from server.
    res.send(''); 
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});