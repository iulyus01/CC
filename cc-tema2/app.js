const ApiApp = require('./api');
const fs = require('fs');
const lib = require('./lib');


app = new ApiApp(3001);


app.get('/user/{id}', (req, res) => {
    const users = JSON.parse(fs.readFileSync('users.json'));

    let id = parseInt(req.params.id);
    if(isNaN(id)) {
        res.writeHead(500, 'Internal Server Error');
        res.end();
        return;
    }
    const response = users.filter(e => e.id === parseInt(req.params.id))[0];
    if(!response) res.writeHead(404, 'Not Found');
    
    res.end(JSON.stringify(response));
});
app.get('/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync('users.json'));
    res.end(JSON.stringify(users));
});


app.post('/user', async (req, res) => {
    req.body = JSON.parse(await lib.getReqData(req));
    console.log(req.body);
    const users = JSON.parse(fs.readFileSync('users.json'));

    let lastIndex = users.reduce((acc, user) => acc = acc > user.id ? acc : user.id, 0);
    users.push({
        id: parseInt(lastIndex) + 1,
        name: req.body.name,
        status: req.body.status || 'INACTIVE',
        photos: req.body.photos || []
    })

    fs.writeFileSync('users.json', JSON.stringify(users));
    res.end();
});
app.post('/user/{id}/photo', async (req, res) => {
    req.body = JSON.parse(await lib.getReqData(req));
    console.log(req.body);
    const users = JSON.parse(fs.readFileSync('users.json'));
    const user = users[parseInt(req.params.id)];
    if(!user) {
        res.writeHead(404, 'Not Found');
        res.end();
        return;
    }

    let lastIndex = user.photos.reduce((acc, photo) => acc = acc > photo.photoId ? acc : photo.photoId, 0);
    user.photos.push({
        photoId: parseInt(lastIndex) + 1,
        location: req.body.location,
        creationDate: req.body.creationDate,
        tags: req.body.tags || []
    })

    fs.writeFileSync('users.json', JSON.stringify(users));
    res.end();
});


app.put('/user/{id}', async (req, res) => {
    req.body = JSON.parse(await lib.getReqData(req));
    console.log(req.body);
    const users = JSON.parse(fs.readFileSync('users.json'));
    const user = users[parseInt(req.params.id)];
    if(!user) {
        res.writeHead(404, 'Not Found');
        res.end();
        return;
    }

    user.name = req.body.name || user.name;
    user.status = req.body.status || user.status;

    fs.writeFileSync('users.json', JSON.stringify(users));
    res.end();
});
app.put('/user/{id}/photo/{photoId}', async (req, res) => {
    req.body = JSON.parse(await lib.getReqData(req));
    console.log(req.body);
    const users = JSON.parse(fs.readFileSync('users.json'));
    const photo = users[parseInt(req.params.id)]?.photos[parseInt(req.params.photoId)];
    if(!photo) {
        res.writeHead(404, 'Not Found');
        res.end();
        return;
    }

    photo.location = req.body.location || photo.location;
    photo.creationDate = req.body.creationDate || photo.creationDate;

    fs.writeFileSync('users.json', JSON.stringify(users));
    res.end();
});


app.delete('/user/{id}', async (req, res) => {
    console.log(req.params);
    const users = JSON.parse(fs.readFileSync('users.json'));
    if(!users[parseInt(req.params.id)]) {
        res.writeHead(404, 'Not Found');
        res.end();
        return;
    }

    users.splice(parseInt(req.params.id), 1);

    fs.writeFileSync('users.json', JSON.stringify(users));
    res.end();
});
app.delete('/user/{id}/photo/{photoId}', async (req, res) => {
    console.log(req.body);
    const users = JSON.parse(fs.readFileSync('users.json'));
    const user = users[parseInt(req.params.id)];
    if(!user || !user.photos[parseInt(req.params.photoId)]) {
        res.writeHead(404, 'Not Found');
        res.end();
        return;
    }

    user.photos.splice(parseInt(req.params.photoId), 1);

    fs.writeFileSync('users.json', JSON.stringify(users));
    res.end();
});

