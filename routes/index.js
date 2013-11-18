/*
 * GET home page.
 */

var config = require('config');
var forever = require('forever');

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
	var listed = {};

	if (procs) {
	    console.log(procs);
            for (var i = 0;  i < procs.length;  ++i) {
    	    	var proc = procs[i];
	    
	    	if (processes[proc.uid]) {
	    	    processes[proc.uid].proc = proc;
		    listed[proc.uid] = proc;
	    	}
	    }
	}

	for (var p in processes) {
	    if (listed[p] == null) {
		console.log(p + ' is not listed.');
		processes[p].proc = null;
	    }
	}
    
	console.log(JSON.stringify(processes));

   	res.render('index', {
	    title : 'VLER DAS Console',
	    processes : processes
    	});
    });
}
