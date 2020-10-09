// lib/app.ts
import express = require('express');
var JL = require('jsnlog').JL;
var jsnlog_nodejs = require('jsnlog-nodejs').jsnlog_nodejs;

var serveStatic = require('serve-static');
var bodyParser = require('body-parser'); 

// Create a new express application instance
const app: express.Application = express();

// In this example, static files to be sent to the client (such as jsnlog.js) live in the public directory. 
app.use(serveStatic('public'))

// Log message directly from the server, to show you can log both from the client and from the server.
JL().info('log message from server');

var pageHtml =
    "<html>\n" +
    "<head>\n" +
    "<script src='jsnlog.js'></script>\n" +
    "<script>\n" +
    "window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {\n" +
    "    JL('onerrorLogger').fatalException({\n" +
    "        'errorMsg': errorMsg, 'url': url, 'line': lineNumber, 'column': column\n" +
    "    }, errorObj);\n" +
    "    return false;\n" +
    "}\n" +
    "\n" +
    "function clickhandler() { \n" +
    "    // Induce reference exception.\n" +
    "    unknownvar.unknownrproperty = 5;\n" +
    "}\n" +
    "</script>\n" +
    "</head>\n" +
    "<body>\n" +
    "<h1>Test page</h1>\n" +
    "<button onclick='clickhandler()'>Throw exception. This will be logged to the server.</button\n" +
    "</body>\n" +
    "</html>";

app.get('/', function (req, res) {
  res.send(pageHtml);
});

// parse application/json.
// Log messages from the client use POST and have a JSON object in the body.
// Ensure that those objects get parsed correctly.
app.use(bodyParser.json())

// jsnlog.js on the client by default sends log messages to jsnlog.logger, using POST.
app.post('*.logger', function (req, res) { 

    // Process incoming log messages, by handing to the server side jsnlog.
    // JL is the object that you got at
    // var JL = require('jsnlog').JL;
    jsnlog_nodejs(JL, req.body);

    // Send empty response. This is ok, because client side jsnlog does not use response from server.
    res.send(''); 
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});