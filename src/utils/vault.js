const fs = require('fs');
const path = require('path');
const os = require('os');

const VAULT_DIR = path.join(os.homedir(), '.ntasp-vault');
const INDEX_FILE = path.join(VAULT_DIR, 'index.json');

class Vault {
  constructor() {
    this.ensureVaultExists();
  }

  ensureVaultExists() {
    if (!fs.existsSync(VAULT_DIR)) {
      fs.mkdirSync(VAULT_DIR, { recursive: true });
    }
    if (!fs.existsSync(INDEX_FILE)) {
      this.writeIndex({ lastId: 0, items: [] });
    }
  }

  readIndex() {
    try {
      const content = fs.readFileSync(INDEX_FILE, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return { lastId: 0, items: [] };
    }
  }

  writeIndex(index) {
    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
  }

  getSnippetPath(id) {
    return path.join(VAULT_DIR, `${id}.json`);
  }

  save(filename, content) {
    const index = this.readIndex();
    const newId = index.lastId + 1;
    const createdAt = new Date().toISOString();

    const snippet = {
      id: newId,
      name: filename,
      createdAt,
      content
    };

    fs.writeFileSync(this.getSnippetPath(newId), JSON.stringify(snippet, null, 2));

    index.lastId = newId;
    index.items.push({
      id: newId,
      name: filename,
      createdAt
    });
    this.writeIndex(index);

    return snippet;
  }

  list() {
    const index = this.readIndex();
    return index.items;
  }

  get(id) {
    const snippetPath = this.getSnippetPath(id);
    if (!fs.existsSync(snippetPath)) {
      return null;
    }
    try {
      const content = fs.readFileSync(snippetPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }

  delete(id) {
    const snippetPath = this.getSnippetPath(id);
    if (!fs.existsSync(snippetPath)) {
      return false;
    }

    fs.unlinkSync(snippetPath);

    const index = this.readIndex();
    index.items = index.items.filter(item => item.id !== id);
    this.writeIndex(index);

    return true;
  }

  getVaultDir() {
    return VAULT_DIR;
  }
}

module.exports = new Vault();
