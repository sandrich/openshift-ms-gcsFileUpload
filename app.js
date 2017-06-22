'use strict';

if (!process.env.GCS_PROJECT || !process.env.GCS_KEY_FILENAME || !process.env.GCS_BUCKET ) {
    console.log("Please set the following ENV variables:");
    console.log("GCS_PROJECT, GCS_KEY_FILENAME, GCS_BUCKET");
    process.exit(1);
}

let restify = require('restify')
    ,healthcheck = require('healthcheck-middleware')
    ,fs = require('fs');

let port = process.env.PORT || 8080;

const server = restify.createServer({
  name: 'gcsImageUpload',
  version: '1.0.0'
});

server.get('/healthz',healthcheck())

server.put('/upload', function (req, res, next) {
    req.pipe(fs.createWriteStream('test.png'))
    req.once('end', () => {
        console.log('saved')
        res.json(200,{status:"ok",message:"Image uploaded"})
    })
    next();
});

server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url);
});
