import logger from './lib/logger';
import DnsResolver from './DnsResolver';

import { createSocket, RemoteInfo } from 'dgram';
import { decode, encode, Packet } from 'dns-packet';

const socket = createSocket('udp4');

socket.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    socket.close();
});

socket.on('message', (msg: Buffer, rinfo: RemoteInfo) => {
    logger.info(`Incomming request from ${rinfo.address}:${rinfo.port}`);
    const message: Packet = decode(msg);
    const response: Packet = DnsResolver.parse(message);

    const buf = new Buffer(encode(response));
    socket.send(buf, 0, buf.length, rinfo.port, rinfo.address)
});

socket.on('listening', () => {
    const address = socket.address();
    logger.info(`Socket server started on ${address.address}:${address.port}`);
});

socket.bind(8053);

// const server = createServer({ udp: true, handle });

// function handle(request: DnsRequest, send: (response: DnsResponse) => void, rinfo: RemoteInfo) {
//     const resolver = new DnsResolver(request, rinfo);
//     send(resolver.getResponse());
// }

// server.on('listening', () => {
//
// });

// server.on('close', () => {
//     logger.info(`Server shutdown`);
// });

// server.listen({
//     udp: 8053
// });

// process.on('SIGTERM', () => {
//     logger.info('SIGTERM signal received: closing HTTP server');
//     server.close();
// });