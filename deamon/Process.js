import createDaemon from './create_deamon.js';
import stopProcess from './stop_deamon.js';
import { getProcessUsage, isRunning } from './info_deamon.js';
import { EventEmitter } from 'events';

export default class Process extends EventEmitter {
    constructor(pseudo, name, args = []) {
        super();
        this.pseudo = pseudo;
        this.name = name;
        this.args = args;
        this.child = createDaemon(name, args, pseudo);
        this.status = 'running'; // running | stopped | paused
        this._watch(); // démarrer le watcher
    }

    /** Démarre le process si arrêté */
    start() {
        if (this.status === 'stopped') {
            this.child = createDaemon(this.name, this.args, this.pseudo);
            this.status = 'running';
            this._watch(); // relancer le watcher
            this.emit('status', this.status);
        }
    }

    /** Pause */
    pause() {
        if (this.child && this.status === 'running') {
            process.kill(this.child.pid, 'SIGSTOP');
            this.status = 'paused';
            this.emit('status', this.status);
        }
    }

    /** Continue */
    continue() {
        if (this.child && this.status === 'paused') {
            process.kill(this.child.pid, 'SIGCONT');
            this.status = 'running';
            this.emit('status', this.status);
        }
    }

    /** Stop */
    stop() {
        if (this.child) {
            stopProcess(this.child, 'SIGKILL');
            this.status = 'stopped';
            this._clearWatch(); // désactiver le watcher
            this.emit('status', this.status);
        }
    }

    /** Redémarre */
    restart() {
        this.stop();
        this.start();
    }

    /** Récupère l’état CPU/RAM */
    async usage() {
        if (!isRunning(this.child)) {
            this.status = 'stopped';
            return { error: 'Process terminé ou inaccessible' };
        }
        return await getProcessUsage(this.child);
    }

    /** PID actuel */
    get pid() {
        return this.child?.pid;
    }

    /** Watcher qui met à jour automatiquement le status */
    _watch() {
        this._clearWatch();
        this._interval = setInterval(() => {
            if (!this.child) return;
            const running = isRunning(this.child);
            const newStatus = running ? this.status : 'stopped';
            if (newStatus !== this.status) {
                this.status = newStatus;
                this.emit('status', this.status);
                if (newStatus === 'stopped') this._clearWatch();
            }
        }, 1000);
    }

    /** Stopper le watcher */
    _clearWatch() {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    /** Détruire complètement l’objet */
    destroy() {
        this.stop();
        this._clearWatch();
        this.child = null;
    }
}
