import createDaemon from '../deamon/create_deamon.js';
import stopDaemon from '../deamon/stop_deamon.js';

test('Stopper un daemon avec un PID valide', () => {
    const daemon = createDaemon('node', ['-v']); // lance un process rapide
    const result = stopDaemon(daemon); // stoppe le process
    expect(result).toBe(true); // on attend que ça réussisse
});
