const chalk = require('chalk');
const vault = require('../utils/vault');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const readline = require('readline');

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

function openInIDE(snippet) {
  const vaultPath = path.join(os.homedir(), '.ntasp-vault');
  const tempPath = path.join(os.tmpdir(), snippet.name);
  fs.writeFileSync(tempPath, snippet.content);

  const ide = detectIDE();

  if (!ide) {
    console.log(chalk.yellow('! No IDE detected'));
    return false;
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
    return true;
  } catch (error) {
    console.log(chalk.yellow('! Could not open IDE'));
    return false;
  }
}

function show(id) {
  if (!id) {
    console.error(chalk.red('Error: No ID specified'));
    console.log(chalk.gray('Usage: ntasp show <id>'));
    process.exit(1);
  }

  const snippetId = parseInt(id, 10);
  if (isNaN(snippetId)) {
    console.error(chalk.red('Error: ID must be a number'));
    process.exit(1);
  }

  const snippet = vault.get(snippetId);

  if (!snippet) {
    console.error(chalk.red(`Error: Snippet #${snippetId} not found`));
    process.exit(1);
  }

  console.log(chalk.bold(`\nSnippet #${snippet.id}: ${snippet.name}`));
  console.log(chalk.gray(`Created: ${new Date(snippet.createdAt).toLocaleString()}`));

  const opened = openInIDE(snippet);

  if (!opened) {
    console.log(chalk.gray('─'.repeat(50)));
    console.log(snippet.content);
    console.log(chalk.gray('─'.repeat(50)));
  }
}

module.exports = show;
