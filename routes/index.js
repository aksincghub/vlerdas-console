/*
 * GET home page.
 */

var config = require('config');
var forever = require('forever');
var moment = require('moment');

exports.index = function(req, res) {
    var processes = config.processes;
 
    if (req.body.start) {
	var p = processes[req.body.uid];
	if (p) {
	    var r = forever.startDaemon(p.cmd, p.options);
	    forever.startServer(r);
	    renderPage(req, res, processes);
	}
    } else if (req.body.stop) {
	var p = processes[req.body.uid];
	if (p) {
	    var r = forever.stop(p.options.uid);
	    renderPage(req, res, processes);
	}
    } else {
	renderPage(req, res, processes);
    }
};

function renderPage(req, res, processes) {  
    forever.list(false, function (p, procs) {
	var taskList = {};

	if (procs) {
            for (var i = 0;  i < procs.length;  ++i) {
    	    	var proc = procs[i];
	    	
	    	if (processes[proc.uid]) {
		    taskList[proc.uid] = {config: processes[proc.uid], proc: proc, started: moment(proc.ctime).format(),
                                          uptime: moment(proc.ctime).fromNow(true)};
	    	}
	    }
	}

	for (var p in processes) {
	    if (taskList[p] == null) {
		taskList[p] = {config: processes[p]};
	    }
	}
    
   	res.render('index', {
	    title : 'VLER DAS Console',
	    taskList : taskList 
    	});
    });
}
