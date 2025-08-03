// daemon/server.js
import http from 'http';
import Manager from './deamon/Manager.js';

const manager = new Manager();

const server = http.createServer(async (req, res) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
        if (req.method === 'POST' && req.url === '/start') {
            const { pseudo, cmd, args } = JSON.parse(body);
            manager.addDaemon(cmd, args, pseudo);
            res.end(JSON.stringify({ status: 'ok', message: `Daemon ${pseudo} started` }));
        } 
        else if (req.method === 'POST' && req.url === '/stop') {
            const { pseudo } = JSON.parse(body);
            const ok = manager.stopDaemon(pseudo);
            res.end(JSON.stringify({ status: ok ? 'ok' : 'error' }));
        } 
        else if (req.method === 'POST' && req.url === '/delete') {
            const { pseudo } = JSON.parse(body);
            const ok = manager.delDaemon(pseudo);
            res.end(JSON.stringify({ status: ok ? 'ok' : 'error' }));
        } 
        else if (req.method === 'POST' && req.url === '/restart') {
            const { pseudo } = JSON.parse(body);
            const ok = manager.restartDaemon(pseudo);
            res.end(JSON.stringify({ status: ok ? 'ok' : 'error' }));
        } 
        else if (req.method === 'GET' && req.url === '/list') {
            manager.listDaemons().then((list) => res.end(JSON.stringify(list)));
        } 
        else {
            res.statusCode = 404;
            res.end('Not found');
        }
    });
});

server.listen(5678, '127.0.0.1', () => console.log('Daemon API en local sur 127.0.0.1:5678'));

