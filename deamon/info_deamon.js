import pidusage from 'pidusage';

/**
 * Récupère la consommation CPU/RAM d’un processus
 * @param {object} child - Processus spawné (doit avoir une propriété `pid`)
 * @returns {Promise<object>} - CPU (%) et mémoire (MB)
 */
export default async function getProcessUsage(child) {
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
