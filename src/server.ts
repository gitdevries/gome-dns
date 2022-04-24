import logger from './lib/logger';
import dns from './lib/dns';

import { createServer, DnsRequest, DnsResponse } from 'dns2';
import { RemoteInfo } from 'dgram';

const server = createServer({ udp: true, handle });

function handle(request: DnsRequest, send: (response: DnsResponse) => void, rinfo: RemoteInfo) {
    const response = dns.resolve(request, rinfo);
    send(response);
}

server.on('listening', () => {
    logger.info(`Server started on :8053`);
});

server.on('close', () => {
    logger.info(`Server shutdown`);
});

server.listen({
    udp: 8053
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close();
});