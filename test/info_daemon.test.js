import createdaemon from '../deamon/create_deamon.js';
import { getProcessUsage, isRunning } from '../deamon/info_deamon.js';
import stopProcess from '../deamon/stop_deamon.js';

describe('Tests info_daemon', () => {
    let daemon;

    beforeAll(() => {
        // On lance un petit process qui reste vivant
        daemon = createdaemon('node', ['-e', 'setInterval(()=>{}, 1000)']);
    });

    afterAll(() => {
        // On le stoppe proprement
        stopProcess(daemon);
    });

    test('isRunning retourne true pour un process actif', () => {
        expect(isRunning(daemon)).toBe(true);
    });

    test('isRunning retourne false pour un PID inexistant', () => {
        expect(isRunning(999999)).toBe(false); // PID qui n’existe pas
    });

    test('getProcessUsage retourne CPU et RAM valides', async () => {
        const usage = await getProcessUsage(daemon);
        expect(usage).toHaveProperty('cpu');
        expect(usage).toHaveProperty('memory');
        expect(typeof usage.cpu).toBe('string');
        expect(typeof usage.memory).toBe('string');
    });
});
