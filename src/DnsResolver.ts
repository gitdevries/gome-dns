import Resolver from './resolvers';

import * as dns from 'dns';
import { Packet } from 'dns-packet';

export default new class DnsResolver {
    constructor(resolver: Resolver = Resolver.CLOUDFLARE) {
        dns.setServers([resolver]);
    }

    private id(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    /**
     * Resolved dns query via own json records to override or create custom endpoints
     */
    private gomeResolve() {

    }

    /**
     * Check if the DNS query is saved withing the local gome cache for faster resolving
     */
    private cacheResolve() {

    }

    public parse(message: Packet): Packet {
        console.log(message);
        const [q] = message.questions ?? [];

        // TODO: Use resolve to respond instead of hardcode
        dns.resolve(q.name, q.type, (addresses) => {

        });

        return {
            type: 'response',
            id: message.id ?? this.id(0, 65534),
            answers: [{
                name: q.name,
                // type: q.type,
                type: 'A',
                class: q.class,
                data: "127.0.0.1"
            }]
        };
    }
}