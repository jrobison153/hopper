require('babel-polyfill');
require('babel-register');

const server = require('./src/serverWrapper');

server.start();
