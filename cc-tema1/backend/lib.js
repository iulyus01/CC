var http = require('http');
var https = require('https');
var fs = require('fs');
const { promises: { readFile, writeFile } } = fs;
var config = JSON.parse(fs.readFileSync('backend/config.json'));

async function sendRandomData(res) {
    const timeNow = new Date().getTime();

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    });

    const firstResponse = await makeRequest({
        hostname: 'www.randomnumberapi.com',
        path: '/api/v1.0/random?min=10&max=50&count=3',
        method: 'GET'
    }, false);
    const secondResponse = await makeRequest({
        hostname: 'csrng.net',
        path: '/csrng/csrng.php?min=10&max=50',
        method: 'GET',
    }, true);

    const ipParam = `${firstResponse.join('.')}.${secondResponse[0].random}`;
    const options = {
        hostname: 'weatherapi-com.p.rapidapi.com',
        path: `/ip.json?q=${ipParam}`,
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com',
            'x-rapidapi-key': config.apiKey
        }
    }
    const thirdResponse = await makeRequest(options, true);


    const delay = new Date().getTime() - timeNow;
    const responseText = JSON.stringify(thirdResponse)
    let obj = JSON.parse(fs.readFileSync('temp.js'));
    obj.responseText = responseText;
    obj.delay = delay;
    
    res.end(responseText);
    const temp = JSON.parse(fs.readFileSync('backend/metricsData.js') ?? '[]');
    temp.push(obj);
    fs.writeFileSync('backend/metricsData.js', JSON.stringify(temp));
}

function sendMetricsData(res) {
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    });
    
    readMetricsAndSend(res);
}

async function sendNotFound(res) {
    const timeNow = new Date().getTime();

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    });
    
    const delay = new Date().getTime() - timeNow;
    let obj = JSON.parse(fs.readFileSync('temp.js'));
    obj.code = 404;
    obj.delay = delay;

    await readFile('backend/metricsData.js').then(fileBuffer => {
        temp = JSON.parse(fileBuffer.toString);
        console.log(fileBuffer.toString());
    }).catch(() => {
        temp = [];
    });
    temp.push(obj);
    await js.writeFile('backend/metricsData.js', JSON.stringify(temp));

    res.end(JSON.stringify({
        code: 404
    }));
}


async function makeRequest(options, withS) {
    const h = withS ? https : http;
    return new Promise((resolve, rej) => {
        const req = h.request(options, res => {
            let textResponse = '';
            res.on('data', d => {
                textResponse += d;
            });
            res.on('end', () => {
                resolve(JSON.parse(textResponse));
            })
        });
        req.on('error', error => {
            console.log(`Error on ${options.hostname} API`);
            rej(error);
        });
        req.end();
    });
}

async function readMetricsAndSend(res) {
    let data;
    await readFile('backend/metricsData.js').then(fileBuffer => {
        data = fileBuffer.toString();
    }).catch(() => {
        data = '[]';
    });

    console.log(`read metrics and send: ${data}`);
    res.end(data);
}

module.exports = { makeRequest, sendRandomData, sendMetricsData, sendNotFound };