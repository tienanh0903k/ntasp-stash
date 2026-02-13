# ntasp

> Personal Dev Memory - Lightweight alternative to git stash with global snippet vault

## What is ntasp?

**ntasp** is a CLI tool for developers who want to:

- Save code snippets without git
- Compare saved versions with current files
- Work across multiple projects
- Keep a personal code vault

Think of it as **"git stash" but global and project-independent**.

## Features

- **Save** any file to a global vault
- **List** all saved snippets with timestamps
- **Show** full content of saved snippets
- **Restore** snippets to working directory
- **Delete** unwanted snippets
- **Diff** saved version vs current file (with colors)

## Installation

```bash
npm install
npm link
```

Or run directly:

```bash
npx . <command>
```

## Usage

### Save a file

```bash
ntasp save app.js
```

### List all snippets

```bash
ntasp list
```

### Show snippet content

```bash
ntasp show 1
```

### Restore snippet

```bash
ntasp restore 1
ntasp restore 1 app-backup.js
```

### Compare with current file

```bash
ntasp diff 1
ntasp diff 1 app.js
```

### Delete snippet

```bash
ntasp delete 1
```

## How it works

All snippets are stored in:

```
~/.ntasp-vault/
  index.json
  1.json
  2.json
  ...
```

## Data Structure

### index.json

```json
{
  "lastId": 3,
  "items": [
    {
      "id": 1,
      "name": "app.js",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Snippet file (e.g., 1.json)

```json
{
  "id": 1,
  "name": "app.js",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "content": "console.log('hello');"
}
```

## Why ntasp?

- **No git required** - Works anywhere
- **Global** - Access from any project
- **Simple** - File-based, no database
- **Fast** - Instant save and restore
- **Cross-platform** - Mac, Linux, Windows

## Roadmap

### Current (v1.0 - MVP)

- [x] save
- [x] list
- [x] show
- [x] restore
- [x] delete
- [x] diff

### Future

- [ ] Full-text search
- [ ] Tag system
- [ ] Encryption mode
- [ ] Cloud sync
- [ ] Export/import
- [ ] Random string IDs
- [ ] Git branch awareness

## Technical Stack

- Node.js
- chalk (colors)
- diff (comparison)

## Requirements

- Node.js >= 14.0.0

## License

MIT