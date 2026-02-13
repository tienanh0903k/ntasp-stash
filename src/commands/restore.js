const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const vault = require('../utils/vault');

function restore(id, newName) {
  if (!id) {
    console.error(chalk.red('Error: No ID specified'));
    console.log(chalk.gray('Usage: ntasp restore <id> [newName]'));
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

  const filename = newName || snippet.name;
  const filepath = path.resolve(filename);

  if (fs.existsSync(filepath)) {
    console.error(chalk.red(`Error: File already exists: ${filename}`));
    console.log(chalk.gray('Choose a different name or delete the existing file'));
    process.exit(1);
  }

  try {
    fs.writeFileSync(filepath, snippet.content);
    console.log(chalk.green('✓ Restored successfully'));
    console.log(chalk.gray(`  File: ${filename}`));
    console.log(chalk.gray(`  From: Snippet #${snippet.id}`));
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

module.exports = restore;
