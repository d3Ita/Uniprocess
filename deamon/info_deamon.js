import pidusage from 'pidusage';

/**
 * Récupère la consommation CPU/RAM d’un processus
 * @param {object} child - Processus spawné (doit avoir une propriété `pid`)
 * @returns {Promise<object>} - CPU (%) et mémoire (MB)
 */
export async function getProcessUsage(child) {
    try {
        const stats = await pidusage(child.pid);
        return {
            cpu: stats.cpu.toFixed(2) + '%',
            memory: (stats.memory / 1024 / 1024).toFixed(2) + ' MB',
        };
    } catch (err) {
        return { error: 'Process terminé ou inaccessible' };
    }
}

/**
 * Vérifie si un processus est toujours en cours d'exécution.
 * @param {object} child - Processus ou PID.
 * @returns {boolean} - True si le processus existe, sinon false.
 */
export function isRunning(child) {
    try {
        process.kill(child.pid, 0); // 0 = juste un test, ne tue pas le process
        return true;
    } catch (err) {
        return false; // Erreur = le processus n'existe pas ou pas d'accès
    }
}
