import { spawn } from 'child_process';

/**
 * lance un programme en arrière-plan (daemon)
 * @param {string} name - le programme à lancer (ex: "node", "python", "ping")
 * @param {string[]} args - arguments du programme
 * @param {string} pseudo - pseudo du prcocess
 * @returns {object} - infos sur le processus
 */
export default function createdaemon(name, args = [], pseudo) {
    const child = spawn(name, args, {
        detached: true, // continue même si le parent s’arrête
        stdio: 'ignore', // ignore la sortie (mettre 'pipe' si tu veux lire la sortie)
    });
    child.unref();
    child.name = pseudo;
    return child;
}
