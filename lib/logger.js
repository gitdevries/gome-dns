const pino = require('pino');
const pretty = require('pino-pretty');

const streamConfig = pretty({
    colorize: true
});

const logger = pino(streamConfig);

module.exports = logger;