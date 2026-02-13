const chalk = require('chalk');
const vault = require('../utils/vault');

function list() {
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
}

module.exports = list;
