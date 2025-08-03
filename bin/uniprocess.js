#!/usr/bin/env node
import { Command } from 'commander';
import fetch from 'node-fetch';
import chalk from 'chalk';
import Table from 'cli-table3';

const program = new Command();
const API = 'http://127.0.0.1:5678';

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

