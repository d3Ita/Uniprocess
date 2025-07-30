/**
 * Arrête un processus donné
 * @param {object} child - Processus spawné (doit avoir une propriété `pid`)
 * @param {string} signal - Signal à envoyer (par défaut "SIGTERM")
 */
export default function stopProcess(child, signal = 'SIGTERM') {
    try {
        process.kill(child.pid, signal);
        console.log(`Process ${child.pid} arrêté avec le signal ${signal}`);
        return true;
    } catch (err) {
        console.error(
            `Impossible d'arrêter le process ${child.pid} :`,
            err.message
        );
        return false;
    }
}
