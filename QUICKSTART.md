# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Extract the Files
After downloading, extract the `docs-companion` folder to a location on your computer.

### Step 2: Navigate to the Folder
```bash
cd /path/to/docs-companion

# Example on Mac:
# cd ~/Downloads/docs-companion
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Open in VS Code
```bash
code .
```

### Step 5: Test It!
1. Press `F5` in VS Code
2. A new "Extension Development Host" window will open
3. Open any JavaScript/TypeScript project in that window
4. Put your cursor on a package name (like `react` or `axios`)
5. Press `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac)
6. See documentation in the sidebar! 🎉

---

## Setting Up GitHub

### Step 1: Create Repository on GitHub
1. Go to https://github.com/new
2. Name: `docs-companion`
3. **Don't** check any boxes (no README, gitignore, or license)
4. Click "Create repository"

### Step 2: Push Your Code
```bash
# Make sure you're in the docs-companion directory
cd /path/to/docs-companion

# Initialize git
git init
git branch -M main

# Stage and commit
git add .
git commit -m "Initial commit: VS Code extension MVP structure"

# Connect to GitHub (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/docs-companion.git

# Push to GitHub
git push -u origin main
```

If you get "remote origin already exists", run:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/docs-companion.git
git push -u origin main
```

---

## Development Workflow

```bash
# Make changes to src/*.ts files
# TypeScript compiler watches automatically

# In Extension Development Host, press Ctrl+R to reload

# Commit your changes
git add .
git commit -m "Add new feature"
git push
```

---

## What You've Built

✅ Working VS Code extension  
✅ Keybind for instant documentation  
✅ npm package lookup  
✅ Clean sidebar UI  
✅ Project-aware (reads package.json)  

Ready to build more? Check out README.md for the roadmap! 🚀
