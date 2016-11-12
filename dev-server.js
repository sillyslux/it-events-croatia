/* eslint no-console: 0 */

const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const configFrontend = require('./webpack.config.frontend.js');
const configBackend = require('./webpack.config.backend.js');

const compilerFrontend = webpack(configFrontend);
const compilerBackend = webpack(configBackend);
let frontendStart;
let backendStart;

compilerFrontend.plugin('compile', () => {
  console.log('Frontend bundling started ...');
  frontendStart = Date.now();
});
compilerFrontend.plugin('done', () => console.log(`Frontend bundling finished (${Date.now() - frontendStart}ms)`));

const serverFrontend = new WebpackDevServer(compilerFrontend, configFrontend.devServer);
serverFrontend.listen(configFrontend.port, 'localhost', () => {
  console.log(`Webpack-Dev-Server Frontend started on port ${configFrontend.port}`);
});


compilerBackend.plugin('compile', () => {
  console.log('Backend bundling started ...');
  backendStart = Date.now();
});
compilerBackend.plugin('done', () => console.log(`Backend bundling finished (${Date.now() - backendStart}ms)`));

const serverBackend = new WebpackDevServer(compilerBackend, configBackend.devServer);
serverBackend.listen(configBackend.port, 'localhost', () => {
  console.log(`Webpack-Dev-Server Backend started on port ${configBackend.port}`);
});

// require('./backend')
