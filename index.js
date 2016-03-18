var http = require('http');
var fs = require('fs');

var networkPrefix = '192.168.25.';
var i = 0;
var report = {};
var ready = 0;

for (var i = 0; i < 255; i++) {
	var req = http.request({
		host: networkPrefix + i
	}, logConnection)
	.on('error', logError)
	.end();
}

function logConnection(resp) {
	if (!report.hasOwnProperty(resp.statusCode.toString()))
		report[resp.statusCode.toString()] = [];

	report[resp.statusCode.toString()].push(resp.req._headers.host);

	writeReport();
}

function logError(err) {
	if (!report.hasOwnProperty('error'))
		report['error'] = [];

	report['error'].push(err);

	writeReport();
}

function writeReport(){
	ready++;

	if (ready !== 254) return;

	fs.writeFileSync('report.json', JSON.stringify(report, false, 4));

	console.log('Report ready.');
}
