#!/usr/bin/env node

const chalk = require('chalk');

const save = require('./commands/save');
const list = require('./commands/list');
const show = require('./commands/show');
const restore = require('./commands/restore');
const deleteSnippet = require('./commands/delete');
const diff = require('./commands/diff');

const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(chalk.bold('\nntasp - Personal Dev Memory\n'));
  console.log('A lightweight alternative to git stash with global snippet vault\n');
  console.log(chalk.bold('Usage:'));
  console.log('  ntasp <command> [options]\n');
  console.log(chalk.bold('Commands:'));
  console.log(chalk.cyan('  save <file>         ') + 'Save a file to vault');
  console.log(chalk.cyan('  list                ') + 'List all saved snippets');
  console.log(chalk.cyan('  show <id>           ') + 'Show content of a snippet');
  console.log(chalk.cyan('  restore <id> [name] ') + 'Restore snippet to working directory');
  console.log(chalk.cyan('  delete <id>         ') + 'Delete a snippet');
  console.log(chalk.cyan('  diff <id> [file]    ') + 'Compare snippet with current file');
  console.log(chalk.cyan('  help                ') + 'Show this help message\n');
  console.log(chalk.bold('Examples:'));
  console.log(chalk.gray('  ntasp save app.js'));
  console.log(chalk.gray('  ntasp list'));
  console.log(chalk.gray('  ntasp show 1'));
  console.log(chalk.gray('  ntasp restore 1'));
  console.log(chalk.gray('  ntasp restore 1 app-backup.js'));
  console.log(chalk.gray('  ntasp diff 1'));
  console.log(chalk.gray('  ntasp diff 1 app.js'));
  console.log(chalk.gray('  ntasp delete 1\n'));
}

if (!command || command === 'help' || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

switch (command) {
  case 'save':
    save(args[1]);
    break;
  case 'list':
    list();
    break;
  case 'show':
    show(args[1]);
    break;
  case 'restore':
    restore(args[1], args[2]);
    break;
  case 'delete':
    deleteSnippet(args[1]);
    break;
  case 'diff':
    diff(args[1], args[2]);
    break;
  default:
    console.error(chalk.red(`Unknown command: ${command}`));
    console.log(chalk.gray('Run "ntasp help" for usage information'));
    process.exit(1);
}
