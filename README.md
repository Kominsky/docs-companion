# Docs Companion

> A context-aware documentation assistant for VS Code that keeps you informed without writing code.

## Philosophy

Docs Companion puts you back in the driver's seat. Instead of AI autocompleting your code, this extension acts as your knowledgeable companion—like having an experienced developer sitting next to you, ready to explain things when you ask.

### What it does:
- 📖 Shows relevant documentation for packages and symbols
- 🎯 Understands your project context (dependencies, imports, file structure)
- ⚡ Fast, local-first where possible
- 🚫 **Never writes code for you**—only informs

### What it's NOT:
- ❌ Not an autocomplete tool
- ❌ Not a code generator
- ❌ Not trying to replace you as a developer

## Features

### Current (v0.0.1 - MVP)
- **Keybind Documentation Lookup** (`Ctrl+Shift+D` / `Cmd+Shift+D`)
  - Place cursor on any npm package name
  - Press the keybind to see its documentation
  - View README, description, and links
  
- **Project-Aware**
  - Reads your `package.json`
  - Knows what dependencies you're using
  - Identifies built-in language features

- **Sidebar Panel**
  - Persistent documentation view
  - Clean, readable formatting
  - Source attribution for all information

### Planned Features
- 🔄 Context-aware suggestions based on what you're writing
- 🔍 Pattern recognition (e.g., "looks like you're setting up OAuth")
- 📚 Support for more documentation sources (MDN, TypeScript, Python docs)
- 💾 Local caching for faster lookups
- 🌳 Project structure analysis
- 🎨 Syntax-specific documentation (TSX, JSX, etc.)

## Installation

### For Development
1. Clone this repository
2. Run `npm install`
3. Press `F5` in VS Code to open Extension Development Host
4. Open a TypeScript/JavaScript project
5. Try pressing `Ctrl+Shift+D` on a package name!

### From Marketplace
*Coming soon once extension is published*

## Usage

### Basic Lookup
1. Open any `.ts`, `.tsx`, `.js`, or `.jsx` file
2. Place your cursor on a package name (e.g., `react`, `axios`)
3. Press `Ctrl+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (Mac)
4. Documentation appears in the sidebar

### Example
```typescript
import axios from 'axios';  // <- Put cursor here and press Ctrl+Shift+D

const response = await axios.get('https://api.example.com');
```

## Keyboard Shortcuts

| Command | Windows/Linux | Mac |
|---------|---------------|-----|
| Show Documentation | `Ctrl+Shift+D` | `Cmd+Shift+D` |

## Roadmap

### Phase 1: MVP ✅ (Current)
- [x] Basic VS Code extension structure
- [x] Keybind for documentation lookup
- [x] npm package documentation fetching
- [x] Sidebar panel display
- [x] package.json parsing

### Phase 2: Context Awareness (Next)
- [ ] AST parsing for better symbol detection
- [ ] Detect common code patterns
- [ ] Show relevant docs as you type (debounced)
- [ ] Support for more languages (Python, Go, Rust)
- [ ] Local documentation caching

### Phase 3: Intelligence Layer
- [ ] Intent inference (recognize what you're trying to do)
- [ ] Multi-file project context
- [ ] Custom documentation sources
- [ ] Integration with official docs (MDN, etc.)
- [ ] Learning mode (track what you've looked up)

## Contributing

This project is in early development. Contributions, ideas, and feedback are welcome!

### Development Setup
```bash
git clone https://github.com/Kominsky/docs-companion.git
cd docs-companion
npm install
```

Press `F5` to launch the Extension Development Host and test your changes.

### Project Structure
```
docs-companion/
├── src/
│   ├── extension.ts          # Main entry point
│   ├── docsProvider.ts        # Documentation fetching logic
│   └── sidebarProvider.ts     # Webview UI
├── resources/
│   └── icon.svg              # Extension icon
└── package.json              # Extension manifest
```

## Credits

Inspired by a conversation about putting the developer back in control and making AI tools that teach rather than replace.

## License

MIT

---

**Note:** This is an early-stage project. Expect bugs and missing features. Your feedback helps shape the direction!
