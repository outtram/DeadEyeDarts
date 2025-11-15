# Your GitHub Repository Walkthrough

## 🌐 Repository URL
**https://github.com/outtram/DeadEyeDarts**

---

## 📂 What's in Your Repo?

When you (or your friends) visit your GitHub page, you'll see:

### Main Page
- **README.md** - First thing people see! Shows:
  - Project description
  - Features
  - How to get started
  - Game rules

### Files Committed

1. **DeadEyeDarts/** folder
   - `deadeyedarts_client.py` - Your game code!

2. **Documentation**
   - `README.md` - Project overview
   - `SETUP_FIRST_TIME.md` - Detailed setup guide
   - `QUICK_START.md` - Quick reference
   - `INSTALL_FOR_FRIENDS.md` - Guide for your friends

3. **Scripts**
   - `start_darts.sh` - Starts darts-caller server
   - `run_deadeyedarts.sh` - Starts your game

4. **Config**
   - `.gitignore` - Tells git what NOT to upload

---

## 🚫 What's NOT in Your Repo? (Intentionally)

These are ignored by `.gitignore`:

- `darts-caller/` - Third-party repo (friends download separately)
- `darts-media/` - Downloaded voice packs (too big!)
- `darts-venv/` - Python virtual environment
- `_archive/` - Old unused files
- `__pycache__/` - Python cache files

This keeps your repo clean and small!

---

## 👥 How to Share With Friends

### Option 1: Send Them the Link
Just text/email them:
```
Hey! Check out my zombie darts game:
https://github.com/outtram/DeadEyeDarts

Follow the INSTALL_FOR_FRIENDS.md guide to get it running!
```

### Option 2: Make It Even Easier
You can also send them this direct link to the installation guide:
```
https://github.com/outtram/DeadEyeDarts/blob/main/INSTALL_FOR_FRIENDS.md
```

---

## 🔄 How to Update Your Repo (After Making Changes)

When you modify your code and want to push updates:

```bash
cd ~/CODE

# Check what changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Describe what you changed"

# Push to GitHub
git push
```

**Example:**
```bash
git add .
git commit -m "Added health bar for zombies"
git push
```

Now your friends can pull the latest version!

---

## 📥 How Friends Get Updates

If you push changes, your friends can update their local copy:

```bash
cd ~/Desktop/DeadEyeDarts
git pull
```

---

## 🎯 Navigation Tips for GitHub

On your repo page, you'll see:

### Tabs at the Top:
- **Code** - Browse your files
- **Issues** - Track bugs or feature requests
- **Pull requests** - If others want to contribute
- **Actions** - Automated workflows (not used yet)
- **Settings** - Repo settings

### On the Right Side:
- **About** - Short description
- **Releases** - Version releases (optional)
- **Packages** - (not used)
- **Used by** - Shows who's using your code

### Clone Button (Green)
Your friends click this to get the code:
- **HTTPS** method (easiest): `git clone https://github.com/outtram/DeadEyeDarts.git`

---

## 🎨 Making Your Repo Look Better (Optional)

### Add Topics
Click the gear icon next to "About" and add topics:
- `darts`
- `autodarts`
- `python`
- `game`
- `zombie`

This helps people discover your project!

### Add a License
If you want others to use your code:
1. Click "Add file" → "Create new file"
2. Name it `LICENSE`
3. GitHub will offer license templates
4. Choose MIT License (simple and permissive)

### Add Screenshots
Take a screenshot of your game running and add it to README:
1. Create an `images/` folder
2. Upload screenshot
3. Add to README: `![Game Screenshot](images/screenshot.png)`

---

## 🐛 If Something Goes Wrong

### "I accidentally committed something I shouldn't have"
```bash
git reset HEAD~1  # Undo last commit (keeps changes)
git push --force  # Push the reset
```

### "My local and GitHub are out of sync"
```bash
git pull --rebase
```

### "I want to start over"
Download fresh from GitHub:
```bash
cd ~/Desktop
rm -rf DeadEyeDarts
git clone https://github.com/outtram/DeadEyeDarts.git
```

---

## 📊 Viewing Your Repo Stats

On your repo page, you can see:
- **Stars** ⭐ - How many people liked it
- **Forks** 🍴 - How many copied it
- **Watchers** 👀 - Who's following updates
- **Commits** - Your update history

---

## 🤝 Collaborating With Friends

If a friend wants to contribute code:

1. **Add them as a collaborator:**
   - Settings → Collaborators → Add people

2. **They can then:**
   ```bash
   git clone https://github.com/outtram/DeadEyeDarts.git
   # Make changes
   git add .
   git commit -m "Added new feature"
   git push
   ```

---

## 🎓 Quick Git Commands Cheat Sheet

```bash
git status          # See what changed
git add .           # Stage all changes
git commit -m "msg" # Commit with message
git push            # Upload to GitHub
git pull            # Download from GitHub
git log             # View commit history
git diff            # See changes
```

---

That's it! Your code is now publicly available and your friends can easily install and play your zombie darts game! 🎯🧟‍♂️
