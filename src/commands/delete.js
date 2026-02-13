const chalk = require('chalk');
const vault = require('../utils/vault');

function deleteSnippet(id) {
  if (!id) {
    console.error(chalk.red('Error: No ID specified'));
    console.log(chalk.gray('Usage: ntasp delete <id>'));
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

  const success = vault.delete(snippetId);

  if (success) {
    console.log(chalk.green('✓ Deleted successfully'));
    console.log(chalk.gray(`  ID: ${snippetId}`));
    console.log(chalk.gray(`  Name: ${snippet.name}`));
  } else {
    console.error(chalk.red('Error: Failed to delete snippet'));
    process.exit(1);
  }
}

module.exports = deleteSnippet;
