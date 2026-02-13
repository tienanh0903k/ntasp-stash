const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { diffLines } = require('diff');
const vault = require('../utils/vault');

function diff(id, filepath) {
  if (!id) {
    console.error(chalk.red('Error: No ID specified'));
    console.log(chalk.gray('Usage: ntasp diff <id> [file]'));
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

module.exports = diff;
