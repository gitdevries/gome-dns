const dns = require('./lib/dns');
const logger = require('./lib/logger');

const { createServer } = require('dns2');

const server = createServer({ udp: true });

server.on('request', (request, send, info) => {
    const response = dns.resolve(request, info);
    send(response);
});

server.on('listening', () => {
    logger.info('Server started on :8053');
});

server.on('close', () => {
    logger.info('Server shutdown');
});

server.listen({
    udp: 8053
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close();
});