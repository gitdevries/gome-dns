const logger = require('./logger');

const { Packet } = require('dns2');
const dns = require('dns');

const CLOUDFLARE = '1.1.1.1';
const GOOGLE = '4.4.4.4';

class DNS {
    constructor(resolver = CLOUDFLARE) {
        dns.setServers([CLOUDFLARE]);

        this.request = null;
        this.requestInfo = null;

        this.additional = null;
        this.question = null;
        this.response = null;
    }

    parseRequest(request) {
        const [additional] = request.additionals;
        const [question] = request.questions;

        this.response = Packet.createResponseFromRequest(request);
        this.additional = additional;
        this.question = question;
    }

    getOptions() {
        const { family } = this.requestInfo;

        let options = { all: true };

        if (family === 'IPv4') {
            options = { family: 4 };
        }

        if (family === 'IPv6') {
            options = { family: 6 };
        }
    }

    resolve(request, info) {
        this.requestInfo = info;
        this.parseRequest(request);
        const options = this.getOptions();

        const { name } = this.question;
        const { address, family } = this.requestInfo;

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


module.exports = new DNS();