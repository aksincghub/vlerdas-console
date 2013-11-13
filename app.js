/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var config = require('config');
var forever = require('forever-monitor');

var app = express();
var processes = [];

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(config.server.port, config.server.host, function() {
    console.log('VLER DAS Console listening at http://' + config.server.host + ':' + config.server.port);
    for ( var i = 0; i < config.processes.length; ++i) {
	var p = config.processes[i];
	var child = new (forever.Monitor)(p.cmd, {
	    'sourceDir' : 'c:\\Projects\\vlerdas-ecrud\\bin',
	    'cwd' : 'c:\\Projects\vlerdas-ecrud',
	    'max' : 5,
	    'outFile' : 'stdout.txt',
	    'errFile' : 'stderr.txt',
	    'logFile' : 'log.txt'
	});
	child.start();
	processes.push({
	    pconfig : p,
	    process : child
	});
    }
});
