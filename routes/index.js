/*
 * GET home page.
 */

var config = require('config');
var forever = require('forever');

exports.index = function(req, res) {
    var processes = config.processes;
    
    forever.list(false, function (p, procs) {
        for (var i = 0;  i < procs.length;  ++i) {
	    var proc = procs[i];
	    
	    if (processes[proc.uid]) {
	    	processes[proc.uid].proc = proc;
	    }
	}
    });
    
    res.render('index', {
	title : 'VLER DAS Console',
	processes : processes
    });
};
