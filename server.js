const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('database.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3200;

server.use(middlewares);
server.use(router);

server.listen(port);

//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static('./dist/yarkinscoffeestore'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/yarkinscoffeestore/'}),
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);