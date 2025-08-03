import { spawn } from 'child_process';

/**
 * lance un programme en arrière-plan (daemon)
 * @param {string} name - le programme à lancer (ex: "node", "python", "ping")
 * @param {string[]} args - arguments du programme
 * @returns {object} - infos sur le processus
 */
export default function createDaemon(name, args = []) {
    const child = spawn(name, args, {
        detached: true, // continue même si le parent s’arrête
        stdio: 'ignore', // ignore la sortie (mettre 'pipe' si tu veux lire la sortie)
    });
    child.unref();
    return child;
}
