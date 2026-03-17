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
- **List** all saved snippets with timestamps (with interactive open)
- **Show** full content of saved snippets
- **Restore** snippets to working directory
- **Apply** snippets to existing files (overwrite)
- **Delete** unwanted snippets
- **Diff** saved version vs current file (opens in IDE like Git changes)

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

After listing, you can enter a snippet ID to open it directly in your IDE (or view content if no IDE is detected).

### Show snippet content

```bash
ntasp show 1
```

### Restore snippet

```bash
ntasp restore 1
ntasp restore 1 app-backup.js
```

### Apply snippet to existing file

```bash
ntasp apply 1
ntasp apply 1 app.js
```

Note: `apply` overwrites existing files, while `restore` creates new files.

### Compare with current file

Opens diff view directly in IDE (like Git changes):

```bash
ntasp diff 1
ntasp diff 1 app.js
```

Supported IDEs (auto-detected):
- Cursor
- Windsurf
- VS Code
- VSCodium
- VS Code Insiders
- IntelliJ IDEA
- WebStorm
- Sublime Text
- Zed

**Smart detection**: Automatically detects your current IDE and prioritizes it:
- Detects IDE from terminal environment variables
- Prioritizes current IDE over system-wide installations
- Falls back to console diff if no IDE is available

Force console output:

```bash
ntasp diff 1 --console
```

Note: By default, `diff` will try to open your IDE. If no IDE is detected, it will fallback to console output.

### Delete snippet

```bash
ntasp delete 1
```

## How it works

### Storage

All snippets are stored in:

```
~/.ntasp-vault/
  index.json
  1.json
  2.json
  ...
```

### IDE Detection

When you run `ntasp diff`, the tool:

1. **Checks current IDE** - Detects which IDE terminal you're running from (via environment variables like `TERM_PROGRAM`, `VSCODE_GIT_IPC_HANDLE`)
2. **Finds IDE command** - Locates the corresponding CLI command (e.g., `cursor`, `windsurf`, `code`)
3. **Opens diff view** - Launches the diff in your current IDE, just like Git changes
4. **Falls back gracefully** - If no IDE is detected, shows a colored console diff

This means if you run `ntasp diff 1` from:
- **Cursor terminal** → Opens in Cursor
- **Windsurf terminal** → Opens in Windsurf
- **VS Code terminal** → Opens in VS Code
- **Regular terminal** → Shows console diff or opens first available IDE

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
- **IDE Integration** - Diff view opens directly in your editor
- **Simple** - File-based, no database
- **Fast** - Instant save and restore
- **Cross-platform** - Mac, Linux, Windows

## Roadmap

### Current (v1.0)

- [x] save
- [x] list
- [x] show
- [x] restore
- [x] apply
- [x] delete
- [x] diff
- [x] IDE integration with smart detection (Cursor, Windsurf, VS Code, IntelliJ, WebStorm, Sublime, Zed)

### Future (v1.1+)

- [ ] Full-text search
- [ ] Tag system
- [ ] Edit snippet
- [ ] Rename snippet
- [ ] Notes/descriptions
- [ ] Encryption mode
- [ ] Cloud sync
- [ ] Export/import
- [ ] Random string IDs
- [ ] Git branch awareness
- [ ] History/versions

## Technical Stack

- Node.js
- chalk (colors)
- diff (comparison)

## Requirements

- Node.js >= 14.0.0

## License

MIT