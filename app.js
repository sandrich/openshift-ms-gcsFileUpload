'use strict';

if (!process.env.GCS_PROJECT || !process.env.GCS_KEY_FILENAME || !process.env.GCS_BUCKET ) {
    console.log("Please set the following ENV variables:");
    console.log("GCS_PROJECT, GCS_KEY_FILENAME, GCS_BUCKET");
    process.exit(1);
}

let restify = require('restify')
    ,healthcheck = require('healthcheck-middleware')
    ,storage = require('@google-cloud/storage')
    ,uuid = require('uuid');

let port = process.env.PORT || 8080;

const server = restify.createServer({
  name: 'gcsImageUpload',
  version: '1.0.0'
});

let gcs = storage({
    projectId: process.env.GCS_PROJEC,
    keyFilename: process.env.GCS_KEY_FILENAME
});

let bucket = gcs.bucket(process.env.GCS_BUCKET);
bucket.acl.default.add({
    entity: "allUsers",
    role: storage.acl.READER_ROLE
}, err => {})

let uploadToGoogle = (buffer, fileName, callback) => {
    let s = stream.createReadStream(buffer);

    let ws = bucket.file(fileName).createWriteStream();
    s.pipe(ws);

    ws.on('finish', () => {
        callback();
    })

    ws.on('error', (err) => {
        callback(err);
    })
}

server.get('/healthz',healthcheck())

server.put('/upload', function (req, res, next) {
    let imageName = uuid.v4().concat('.png')
    let ws = bucket.file(imageName).createWriteStream();


    req.pipe(ws.on('finish', () => {
        res.json(200,{status:"ok",imageName:imageName})
        next();
    }).on('error', err => {
        res.json(400,err)
        next();
    }))
});

server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url);
});
