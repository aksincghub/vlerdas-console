/*
 * GET home page.
 */

var config = require('config');
var forever = require('forever');
var moment = require('moment');

exports.index = function(req, res) {
    var processes = config.processes;
 
    if (req.body.start) {
	if (Array.isArray(req.body.uid)) {
	    for (var i = 0;  i < req.body.uid.length;  ++i) {
	        startProcess(req.body.uid[i], processes);
	    }
	} else {
	    startProcess(req.body.uid, processes);
	}
	renderPage(req, res, processes);
    } else if (req.body.stop) {
        if (Array.isArray(req.body.uid)) {
            for (var i = 0;  i < req.body.uid.length;  ++i) {
                stopProcess(req.body.uid[i], processes);
            }
        } else {
            stopProcess(req.body.uid, processes);
        }
        renderPage(req, res, processes);
    } else {
	renderPage(req, res, processes);
    }
};

function startProcess(uid, processes) {
    var p = processes[uid];
    if (p) {
	isProcessRunning(uid, function(running) {
	    if (!running) {
	        var r = forever.startDaemon(p.cmd, p.options);
	        forever.startServer(r);
    	    }
	});
    }
}

function stopProcess(uid, processes) {
    var p = processes[uid];
    if (p) {
	isProcessRunning(uid, function(running) {
	    if (running) {
	        forever.stop(uid);
	    }
	});
    }
}

function isProcessRunning(uid, callback) {
    var ret = false;
    forever.list(false, function (p, procs) {
        if (procs) {
	    for (var i = 0;  i < procs.length;  ++i) {
	        if (procs[i].uid == uid) {
		    ret = true;
		    break;
		}
	    }
	}
	callback(ret);
    });
}

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
