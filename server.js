const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('database.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3200;

server.use(middlewares);
server.use(router);

server.listen(port);

const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(dirname + '/dist/yarkinscoffeestore'));
app.get('/*', function(req,res)

{res.sendFile(path.join(dirname+'/dist/yarkinscoffeestore/index.html'));});

app.listen(process.env.PORT || 8080);