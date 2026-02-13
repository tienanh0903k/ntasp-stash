const chalk = require('chalk');
const vault = require('../utils/vault');

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
  console.log(chalk.gray('─'.repeat(50)));
  console.log(snippet.content);
  console.log(chalk.gray('─'.repeat(50)));
}

module.exports = show;
