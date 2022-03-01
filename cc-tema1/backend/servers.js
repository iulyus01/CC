var http = require('http');
var fs = require('fs');
var lib = require('./lib');

function createFrontendServer() {
    http.createServer((request, response) => {
        console.log('request ', request.url);

        var filePath = '.' + request.url;
        if (filePath == './') {
            filePath = './index.html';
        }

        var contentType = 'text/html';

        fs.readFile(`frontend/${filePath}`, function (error, content) {
            if (error) {
                if (error.code == 'ENOENT') {
                    fs.readFile('404.html', function (error, content) {
                        response.writeHead(404, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    });
                }
                else {
                    response.writeHead(500);
                    response.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
                }
            }
            else {
                response.writeHead(200, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': contentType
                });
                response.end(content, 'utf-8');
            }
        });

    }).listen(8125);
    console.log('FE Server running at http://127.0.0.1:8125/');
}

function createBackendDataServer() {
    http.createServer((req, res) => {
        const path = req.url.split('/').filter(e => e.length);
        console.log(`Path: ${path}`);

        

        const d = new Date();
        const timestamp = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;
        const obj = {
            timestamp: timestamp,
            method: 'GET',
            url: req.url
        }
        fs.writeFileSync('temp.js', JSON.stringify(obj));

        if(req.url.startsWith('/data')) {
            lib.sendRandomData(res);
        } else {
            lib.sendNotFound(res);
        }

    }).listen(8126);
    console.log('BE Server running at http://127.0.0.1:8126/');
}

function createBackendMetricsServer() {
    http.createServer((req, res) => {
        const path = req.url.split('/').filter(e => e.length);

        if(req.url.startsWith('/metrics')) {
            lib.sendMetricsData(res);
        } else {
            lib.sendNotFound(res);
        }

    }).listen(8127);
    console.log('BE Server running at http://127.0.0.1:8127/');
}

module.exports = { createFrontendServer, createBackendDataServer, createBackendMetricsServer };