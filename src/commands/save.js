const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const vault = require('../utils/vault');

function save(filepath) {
  if (!filepath) {
    console.error(chalk.red('Error: No file specified'));
    console.log(chalk.gray('Usage: ntasp save <file>'));
    process.exit(1);
  }

  const absolutePath = path.resolve(filepath);

  if (!fs.existsSync(absolutePath)) {
    console.error(chalk.red(`Error: File not found: ${filepath}`));
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(absolutePath, 'utf8');
    const filename = path.basename(absolutePath);

    const snippet = vault.save(filename, content);

    console.log(chalk.green('✓ Saved successfully'));
    console.log(chalk.gray(`  ID: ${snippet.id}`));
    console.log(chalk.gray(`  Name: ${snippet.name}`));
    console.log(chalk.gray(`  Time: ${new Date(snippet.createdAt).toLocaleString()}`));
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

module.exports = save;
