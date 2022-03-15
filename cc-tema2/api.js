const http = require('http');

module.exports = class ApiApp {

    METHOD_GET = 'GET';
    METHOD_POST = 'POST';
    METHOD_PUT = 'PUT';
    METHOD_DELETE = 'DELETE';
    METHOD_NOT_ALLOWED = JSON.stringify({
        message: 'Method Not Allowed'
    });

    paths = {
        get: [],
        post: [],
        put: [],
        delete: [],
    }

    constructor(port) {
        http.createServer((req, res) => {
            let index = this.#checkUrlPaths(req, res);
            if (index === -1) return;
            let pathInfo = this.paths[req.method.toLowerCase()][index];

            req.params = this.#extractParams(req.url, pathInfo.regexPath);

            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            });
            try {
                pathInfo.callback(req, res);
            } catch (e) {
                res.writeHead(200, e.message);
                res.end();
            }

            this.#sendTimeout(res);
        }).listen(port);
    }

    #extractParams(path, pattern) {
        let params = path.match(pattern).groups || {};
        let resourceParams = path.split('?');

        if (resourceParams.length > 1) {
            resourceParams = resourceParams[1];
            resourceParams = resourceParams.split('&');

            resourceParams.forEach(element => {
                let paramValue = element.split('=');
                if (paramValue.length > 1) {
                    let [param, value] = paramValue;
                    params[param] = value;
                }
            });
        }

        return params;
    }

    #checkUrlPaths(req, res) {
        for (let i = 0; i < this.paths[req.method.toLowerCase()].length; i++) {
            let clearedPath = req.url.split('?')[0].split('/');
            clearedPath.push('$');
            let simplifiedPath = this.paths[req.method.toLowerCase()][i].simplifiedPath;
            let found = true;
            for (let j = 0; j < simplifiedPath.length; j++) {
                if (simplifiedPath[j] !== '*' && simplifiedPath[j] !== clearedPath[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return i;
        }

        res.writeHead(404);
        res.end();
        return -1;
    }

    #sendTimeout(res) {
        setTimeout(() => {
            res.writeHead(408, 'Request Timeout');
            res.end();
        }, 3000);
    }

    get(path, callback) {
        let regexPath = '^' + path.replace(/{(.+?)}/gi, '(?<$1>\\w+?/?)') + '(?:\\?.*)?$';
        let simplifiedPath = path.split('/').map(e => e.includes('{') ? '*' : e);
        simplifiedPath.push('$');
        this.paths.get.push({
            path,
            regexPath,
            simplifiedPath,
            callback
        });
    }

    post(path, callback) {
        let regexPath = '^' + path.replace(/{(.+?)}/gi, '(?<$1>\\w+?/?)') + '(?:\\?.*)?$';
        let simplifiedPath = path.split('/').map(e => e.includes('{') ? '*' : e);
        simplifiedPath.push('$');
        this.paths.post.push({
            path,
            regexPath,
            simplifiedPath,
            callback
        });
    }

    put(path, callback) {
        let regexPath = '^' + path.replace(/{(.+?)}/gi, '(?<$1>\\w+?/?)') + '(?:\\?.*)?$';
        let simplifiedPath = path.split('/').map(e => e.includes('{') ? '*' : e);
        simplifiedPath.push('$');
        this.paths.put.push({
            path,
            regexPath,
            simplifiedPath,
            callback
        });
    }

    delete(path, callback) {
        let regexPath = '^' + path.replace(/{(.+?)}/gi, '(?<$1>\\w+?/?)') + '(?:\\?.*)?$';
        let simplifiedPath = path.split('/').map(e => e.includes('{') ? '*' : e);
        simplifiedPath.push('$');
        this.paths.delete.push({
            path,
            regexPath,
            simplifiedPath,
            callback
        });
    }
}