/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var config = require('config');
var forever = require('forever');

var app = express();

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
app.post('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(config.server.port, config.server.host, function() {
    console.log('VLER DAS Console listening at http://' + config.server.host + ':' + config.server.port);
    var processes = config.processes;

    forever.list(false, function (p, procs) {
        var taskList = {};

        if (procs) {
            for (var i = 0;  i < procs.length;  ++i) {
                var proc = procs[i];

                if (processes[proc.uid]) {
                    taskList[proc.uid] = {config: processes[proc.uid], proc: proc};
                }
            }
        }

        for (var p in processes) {
	    var process = processes[p];
            if (process.runAtStartup && (taskList[p] == null || !taskList[p].proc.running)) {
		var child = forever.startDaemon(process.cmd, process.options);
		forever.startServer(child);
            }
        }
    });
});
