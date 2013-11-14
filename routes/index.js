/*
 * GET home page.
 */

var config = require('config');
var forever = require('forever');

exports.index = function(req, res) {
    var processes = {};
    
    forever.list(false, function (p, proc) {
	console.log(proc);
    });
    
    res.render('index', {
	title : 'VLER DAS Console',
	processes : processes
    });
};