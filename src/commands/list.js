const chalk = require('chalk');
const vault = require('../utils/vault');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

function detectCurrentIDE() {
  const termProgram = process.env.TERM_PROGRAM;
  const vsCodeIPC = process.env.VSCODE_GIT_IPC_HANDLE;
  const vsCodeInjection = process.env.VSCODE_INJECTION;

  if (termProgram === 'vscode' || vsCodeIPC || vsCodeInjection) {
    const possibleCommands = ['cursor', 'windsurf', 'code', 'codium', 'code-insiders'];

    for (const cmd of possibleCommands) {
      try {
        execSync(`which ${cmd}`, { stdio: 'ignore' });
        const name = cmd === 'cursor' ? 'Cursor' :
                    cmd === 'windsurf' ? 'Windsurf' :
                    cmd === 'codium' ? 'VSCodium' :
                    cmd === 'code-insiders' ? 'VS Code Insiders' : 'VS Code';
        return { name, command: cmd, type: 'vscode' };
      } catch (error) {
        continue;
      }
    }
  }

  if (termProgram === 'iTerm.app' || termProgram === 'Apple_Terminal') {
    const possibleCommands = ['cursor', 'windsurf', 'code', 'codium'];
    for (const cmd of possibleCommands) {
      try {
        execSync(`which ${cmd}`, { stdio: 'ignore' });
        const name = cmd === 'cursor' ? 'Cursor' :
                    cmd === 'windsurf' ? 'Windsurf' :
                    cmd === 'codium' ? 'VSCodium' : 'VS Code';
        return { name, command: cmd, type: 'vscode' };
      } catch (error) {
        continue;
      }
    }
  }

  return null;
}

function detectIDE() {
  const currentIDE = detectCurrentIDE();
  if (currentIDE) {
    return currentIDE;
  }

  const ides = [
    { name: 'Cursor', command: 'cursor', type: 'vscode' },
    { name: 'Windsurf', command: 'windsurf', type: 'vscode' },
    { name: 'VS Code', command: 'code', type: 'vscode' },
    { name: 'VSCodium', command: 'codium', type: 'vscode' },
    { name: 'VS Code Insiders', command: 'code-insiders', type: 'vscode' },
    { name: 'IntelliJ IDEA', command: 'idea', type: 'jetbrains' },
    { name: 'WebStorm', command: 'webstorm', type: 'jetbrains' },
    { name: 'Sublime Text', command: 'subl', type: 'sublime' },
    { name: 'Zed', command: 'zed', type: 'zed' },
  ];

  for (const ide of ides) {
    try {
      execSync(`which ${ide.command}`, { stdio: 'ignore' });
      return ide;
    } catch (error) {
      continue;
    }
  }

  return null;
}

function openInIDE(snippetId) {
  const vaultPath = path.join(os.homedir(), '.ntasp-vault');
  const snippetPath = path.join(vaultPath, `${snippetId}.json`);

  if (!fs.existsSync(snippetPath)) {
    console.log(chalk.red('✗ Snippet not found'));
    return;
  }

  const snippet = JSON.parse(fs.readFileSync(snippetPath, 'utf-8'));
  const tempPath = path.join(os.tmpdir(), snippet.name);
  fs.writeFileSync(tempPath, snippet.content);

  const ide = detectIDE();

  if (!ide) {
    console.log(chalk.yellow('! No IDE detected'));
    console.log(chalk.gray('\nContent:\n'));
    console.log(snippet.content);
    return;
  }

  try {
    if (ide.type === 'vscode') {
      execSync(`${ide.command} "${tempPath}"`, { stdio: 'ignore' });
    } else if (ide.type === 'jetbrains') {
      execSync(`${ide.command} "${tempPath}"`, { stdio: 'ignore' });
    } else if (ide.type === 'sublime') {
      execSync(`subl "${tempPath}"`, { stdio: 'ignore' });
    } else if (ide.type === 'zed') {
      execSync(`zed "${tempPath}"`, { stdio: 'ignore' });
    }
    console.log(chalk.green(`✓ Opened in ${ide.name}`));
  } catch (error) {
    console.log(chalk.yellow('! Could not open IDE'));
    console.log(chalk.gray('\nContent:\n'));
    console.log(snippet.content);
  }
}

function list(options = {}) {
  const items = vault.list();

  if (items.length === 0) {
    console.log(chalk.gray('No snippets saved yet'));
    console.log(chalk.gray('Use: ntasp save <file>'));
    return;
  }

  console.log(chalk.bold('\nSaved Snippets:\n'));

  items.forEach(item => {
    const date = new Date(item.createdAt);
    console.log(chalk.cyan(`  [${item.id}]`) + ' ' + chalk.white(item.name));
    console.log(chalk.gray(`      ${date.toLocaleString()}\n`));
  });

  console.log(chalk.gray(`Total: ${items.length} snippet${items.length > 1 ? 's' : ''}`));

  if (options.interactive !== false && process.stdin.isTTY) {
    console.log(chalk.gray('\nPress Enter to select a snippet to open, or Ctrl+C to exit'));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(chalk.cyan('Enter snippet ID to open: '), (answer) => {
      rl.close();

      const id = parseInt(answer);
      if (isNaN(id)) {
        return;
      }

      const snippet = items.find(item => item.id === id);
      if (!snippet) {
        console.log(chalk.red('✗ Snippet not found'));
        return;
      }

      openInIDE(id);
    });
  }
}

module.exports = list;
