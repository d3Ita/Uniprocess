import Process from './Process.js';

class Manager {
    constructor() {
        this.childs = [];
    }

    /** Ajoute un daemon */
    addDaemon(name, args = [], pseudo) {
        const daemon = new Process(pseudo, name, args);
        this.childs.push(daemon);
        return daemon;
    }

    /** Supprime un daemon */
    delDaemon(pseudo) {
        const index = this.childs.findIndex((d) => d.pseudo === pseudo);
        if (index === -1) return false;
        this.childs[index].stop();
        this.childs[index].destroy();
        this.childs.splice(index, 1);
        return true;
    }

    /** Stop un daemon (sans le supprimer) */
    stopDaemon(pseudo) {
        const daemon = this.childs.find((d) => d.pseudo === pseudo);
        if (!daemon) return false;
        daemon.stop();
        return true;
    }

    /** Redémarre un daemon */
    restartDaemon(pseudo) {
        const daemon = this.childs.find((d) => d.pseudo === pseudo);
        if (!daemon) return false;
        daemon.restart();
        return daemon;
    }

    /** Liste tous les daemons avec leurs infos */
    async listDaemons() {
        return await Promise.all(
            this.childs.map(async (d) => ({
                pseudo: d.pseudo,
                name: d.name,
                pid: d.pid,
                status: d.status,
                ...(await d.usage()),
            }))
        );
    }
}

export default Manager;
