#!/usr/bin/env node
import { Command } from 'commander';
import fetch from 'node-fetch';
import chalk from 'chalk';
import Table from 'cli-table3';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_PATH = path.resolve(__dirname, '../index.js');

const program = new Command();
const API = 'http://127.0.0.1:5678';
const PID_FILE = path.resolve('/tmp/uniprocess_daemon.pid'); // PID du serveur

// ---- DAEMON START ----
program
  .command('daemon-start')
  .description('Lance le serveur de gestion des daemons en arrière-plan')
  .action(() => {
    if (fs.existsSync(PID_FILE)) {
      console.log(chalk.yellow('Daemon déjà lancé.'));
      return;
    }
    const child = spawn('node', [SERVER_PATH], {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    fs.writeFileSync(PID_FILE, child.pid.toString());
    console.log(chalk.green(`Daemon lancé avec PID ${child.pid}`));
  });

// ---- DAEMON STOP ----
program
  .command('daemon-stop')
  .description('Arrête le serveur de gestion des daemons')
  .action(() => {
    if (!fs.existsSync(PID_FILE)) {
      console.log(chalk.red('Aucun daemon n’est lancé.'));
      return;
    }
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'));
    try {
      process.kill(pid);
      fs.unlinkSync(PID_FILE);
      console.log(chalk.green(`Daemon (PID ${pid}) stoppé.`));
    } catch (err) {
      console.log(chalk.red(`Impossible de stopper le daemon : ${err.message}`));
    }
  });


program
  .command('start')
  .description('Démarre un daemon')
  .requiredOption('--name <name>', 'Nom interne du daemon')
  .argument('<cmd>', 'Programme à lancer')
  .argument('[args...]', 'Arguments')
  .action(async (cmd, args, options) => {
    await fetch(`${API}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo: options.name, cmd, args })
    });
    console.log(`Daemon "${options.name}" lancé`);
  });

program
  .command('stop')
  .description('Stoppe un daemon')
  .requiredOption('--name <name>', 'Nom interne du daemon')
  .action(async (options) => {
    await fetch(`${API}/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo: options.name })
    });
    console.log(`Daemon "${options.name}" stoppé`);
  });

program
  .command('delete')
  .description('Supprime un daemon du manager')
  .requiredOption('--name <name>', 'Nom interne du daemon')
  .action(async (options) => {
    await fetch(`${API}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo: options.name })
    });
    console.log(`Daemon "${options.name}" supprimé`);
  });

program
  .command('restart')
  .description('Redémarre un daemon')
  .requiredOption('--name <name>', 'Nom interne du daemon')
  .action(async (options) => {
    await fetch(`${API}/restart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo: options.name })
    });
    console.log(`Daemon "${options.name}" redémarré`);
  });

program
  .command('list')
  .description('Liste les daemons')
  .action(async () => {
    const res = await fetch(`${API}/list`);
    const data = await res.json();

    const table = new Table({
      head: [
        chalk.bold('Pseudo'),
        chalk.bold('Commande'),
        chalk.bold('PID'),
        chalk.bold('Statut'),
        chalk.bold('CPU'),
        chalk.bold('Mémoire')
      ],
      chars: {
        'top': '─',
        'top-mid': '┬',
        'top-left': '╭',
        'top-right': '╮',
        'bottom': '─',
        'bottom-mid': '┴',
        'bottom-left': '╰',
        'bottom-right': '╯',
        'left': '│',
        'left-mid': '├',
        'mid': '─',
        'mid-mid': '┼',
        'right': '│',
        'right-mid': '┤',
        'middle': '│'
      },
      style: { head: [], border: [] }
    });

    data.forEach(d => {
      table.push([
        chalk.cyan(d.pseudo),
        chalk.green(d.name),
        chalk.yellow(d.pid),
        d.status === 'running' ? chalk.green('En cours') : chalk.red('Arrêté'),
        chalk.magenta(d.cpu),
        chalk.blue(d.memory)
      ]);
    });

    console.log(table.toString());
  });

program.parse();

