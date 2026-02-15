const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const chalk = require('chalk');
const { diffLines } = require('diff');
const vault = require('../utils/vault');

function detectIDE() {
  const ides = [
    { name: 'VS Code', command: 'code', args: '--diff' },
    { name: 'IntelliJ IDEA', command: 'idea', args: 'diff' },
    { name: 'Sublime Text', command: 'subl', args: '--command' },
    { name: 'WebStorm', command: 'webstorm', args: 'diff' },
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

function openInIDE(snippetPath, currentPath, snippetName) {
  const ide = detectIDE();

  if (!ide) {
    return { success: false, ide: null };
  }

  try {
    if (ide.command === 'code') {
      execSync(`code --diff "${snippetPath}" "${currentPath}" --wait`, { stdio: 'ignore' });
    } else if (ide.command === 'idea' || ide.command === 'webstorm') {
      execSync(`${ide.command} diff "${snippetPath}" "${currentPath}"`, { stdio: 'ignore' });
    } else if (ide.command === 'subl') {
      execSync(`subl --command "sublimerge_diff_views {\\\"left_read_only\\\": true, \\\"left_file\\\": \\\"${snippetPath}\\\", \\\"right_file\\\": \\\"${currentPath}\\\"}"`, { stdio: 'ignore' });
    }
    return { success: true, ide: ide.name };
  } catch (error) {
    return { success: false, ide: ide.name };
  }
}

function printConsoleDiff(snippet, currentContent, compareFile) {
  const differences = diffLines(snippet.content, currentContent);

  console.log(chalk.bold(`\nDiff: Snippet #${snippet.id} vs ${compareFile}`));
  console.log(chalk.gray('─'.repeat(50)));

  let hasChanges = false;

  differences.forEach(part => {
    if (part.added) {
      hasChanges = true;
      part.value.split('\n').forEach(line => {
        if (line) console.log(chalk.green('+ ' + line));
      });
    } else if (part.removed) {
      hasChanges = true;
      part.value.split('\n').forEach(line => {
        if (line) console.log(chalk.red('- ' + line));
      });
    } else {
      part.value.split('\n').forEach(line => {
        if (line) console.log(chalk.gray('  ' + line));
      });
    }
  });

  console.log(chalk.gray('─'.repeat(50)));

  if (!hasChanges) {
    console.log(chalk.green('✓ No differences found'));
  } else {
    console.log(chalk.yellow('! Files have differences'));
  }
}

function diff(id, filepath, options = {}) {
  if (!id) {
    console.error(chalk.red('Error: No ID specified'));
    console.log(chalk.gray('Usage: ntasp diff <id> [file] [--console|--ide]'));
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

  const compareFile = filepath || snippet.name;
  const absolutePath = path.resolve(compareFile);

  if (!fs.existsSync(absolutePath)) {
    console.error(chalk.red(`Error: File not found: ${compareFile}`));
    console.log(chalk.gray('Tip: Specify a different file with: ntasp diff <id> <file>'));
    process.exit(1);
  }

  const currentContent = fs.readFileSync(absolutePath, 'utf8');

  if (options.forceConsole) {
    printConsoleDiff(snippet, currentContent, compareFile);
    return;
  }

  const tempDir = os.tmpdir();
  const tempFileName = `ntasp-${snippet.id}-${snippet.name}`;
  const tempPath = path.join(tempDir, tempFileName);

  fs.writeFileSync(tempPath, snippet.content, 'utf8');

  console.log(chalk.blue('Opening diff in IDE...'));

  const result = openInIDE(tempPath, absolutePath, snippet.name);

  if (result.success) {
    console.log(chalk.green(`✓ Diff opened in ${result.ide}`));
    fs.unlinkSync(tempPath);
  } else {
    if (result.ide) {
      console.log(chalk.yellow(`! Could not open in ${result.ide}, showing console diff`));
    } else {
      console.log(chalk.yellow('! No IDE detected, showing console diff'));
    }
    fs.unlinkSync(tempPath);
    printConsoleDiff(snippet, currentContent, compareFile);
  }
}

module.exports = diff;
