// TODO: Make it typescript ready!

import logger from './logger';
import Resolver from '../resolvers';

import { DnsRequest, DnsResponse, Packet } from 'dns2';
import * as dns from 'dns';
import { RemoteInfo } from 'dgram';

export default new class DNS {

    private request: object;
    private rinfo: RemoteInfo;
    private response: DnsResponse;

    private additional: object;
    private question: object;


    constructor(resolver: Resolver = Resolver.CLOUDFLARE) {
        dns.setServers([resolver]);
    }

    parseRequest(request: DnsRequest) {
        const [additional] = request.additionals;
        const [question] = request.questions;

        this.response = Packet.createResponseFromRequest(request);
        this.additional = additional;
        this.question = question;
    }

    getOptions(): dns.LookupOptions | dns.LookupAllOptions {
        const { family } = this.requestInfo;

        let options = { all: true };

        if (family === 'IPv4') {
            options = { family: 4 };
        }

        if (family === 'IPv6') {
            options = { family: 6 };
        }

        return options;
    }

    resolve(request: DnsRequest, info: RemoteInfo): DnsResponse {
        this.rinfo = info;
        this.parseRequest(request);
        const options = this.getOptions();

        const { name } = this.question;
        const { address, family } = this.rinfo;

        logger.info('Request from "%s" for "%s" via "%s"', address, name, family);

        dns.lookup(name, options, (err, addresses) => {
            console.log(addresses);

            this.response.answers.push({
                name,
                type: Packet.TYPE.A,
                class: Packet.CLASS.IN,
                ttl: 300,
                address
            });
        });

        return this.response;
    }
}