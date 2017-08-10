var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var chalk = require('chalk');
var path = require('path');

var routes = require('./routes');

var app = express();

app.use(morgan('      ↓ received :method :url · responded :status :res[Content-Type]'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res, next) {
  res.send('Welcome to Episodes! Check out our lovely routes.');
});

app.use('/', routes);

// custom error handling
app.use(function (err, req, res, next) {
  // just in case
  if (!err.stack || !err.message) next(err);
  // clean up the trace to just relevant info
  var cleanTrace = err.stack
  .split('\n')
  .filter(line => {
    // comment out the next two lines for full (verbose) stack traces
    var projectFile = line.indexOf(__dirname) > -1; // omit built-in Node code
    var nodeModule = line.indexOf('node_modules') > -1; // omit npm modules
    return projectFile && !nodeModule;
  })
  .join('\n');
  // colorize and format the output
  console.log(chalk.magenta('      ' + err.message));
  console.log('    ' + chalk.gray(cleanTrace));
  // send back error status
  res.status(err.status || 500).end();
});

module.exports = app;
