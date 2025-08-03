import createDaemon from '../deamon/create_deamon.js';

test('Crée un daemon avec un PID valide', () => {
    const daemon = createDaemon('node', ['-v']);
    expect(daemon).toHaveProperty('pid');
    expect(typeof daemon.pid).toBe('number');
    daemon.kill();
});
