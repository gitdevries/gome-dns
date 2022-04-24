import pino from 'pino';
import pretty from 'pino-pretty';

const streamConfig = pretty({
    colorize: true
});

export default pino(streamConfig);