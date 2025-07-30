import createDaemon from './deamon/create_deamon.js';
import getProcessUsage from './deamon/info_deamon.js';
import stopProcess from './deamon/stop_deamon.js';

const daemon = createDaemon('ping', ['google.com'], 'test-connection');

setTimeout(async () => {
    const usage = await getProcessUsage(daemon);
    console.log(`[${daemon.name} - PID ${daemon.pid}]`, usage);
}, 2000);
setTimeout(async () => {
    stopProcess(daemon);
    const usage = await getProcessUsage(daemon);
    console.log(`[${daemon.name} - PID ${daemon.pid}]`, usage);
}, 4000);
