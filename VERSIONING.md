# Versioning & Release Guide

## Version Format

Uses **semantic versioning**: `MAJOR.MINOR.PATCH`

| Bump  | When                                      | Example          |
|-------|-------------------------------------------|------------------|
| PATCH | Bug fixes, typos, polish, dependency updates | 1.0.0 → 1.0.1 |
| MINOR | New features, new guides, new components  | 1.0.1 → 1.1.0   |
| MAJOR | Breaking changes, major redesigns         | 1.1.0 → 2.0.0   |

## Step-by-Step Release Flow

### 1. Update version in package.json

```bash
# Option A: Use npm (auto-updates package-lock.json too)
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.1 → 1.1.0
npm version major   # 1.1.0 → 2.0.0

# Option B: Manual — edit "version" in package.json, then:
npm install          # updates package-lock.json to match
```

> **Note:** `npm version` also creates a git commit and tag automatically.  
> To skip the auto-commit/tag: `npm version patch --no-git-tag-version`

### 2. Commit the changes

```bash
git add package.json package-lock.json   # + any other changed files
git commit -m "v1.0.1: Fix robots.txt, add OG image and DNS prefetch"
```

### 3. Tag the commit

Skip this if you used `npm version` (it tags automatically).

```bash
git tag -a v1.0.1 -m "v1.0.1: Production polish"
```

**Tag naming:** Always prefix with `v` (e.g., `v1.0.1`, not `1.0.1`).

### 4. Push commit + tag

```bash
git push origin main
git push origin v1.0.1

# Or push all tags at once:
git push origin main --tags
```

### 5. Create GitHub Release (optional but recommended)

**Via CLI:**
```bash
gh release create v1.0.1 --title "v1.0.1 — Production Polish" --notes "Release notes here"
```

**Via GitHub UI:**
1. Repo → **Releases** → **Create a new release**
2. Select tag `v1.0.1`
3. Add title and release notes
4. Click **Publish release**

## Quick Reference

```bash
# Full flow in one go (example for a patch release):
npm version patch --no-git-tag-version
git add -A
git commit -m "v1.0.1: Brief description"
git tag -a v1.0.1 -m "v1.0.1: Brief description"
git push origin main --tags
gh release create v1.0.1 --title "v1.0.1" --notes "Release notes"
```

## Tips

- **Tag after committing** — a tag points to a specific commit, so the commit must exist first.
- **Don't move tags** — if you tagged the wrong commit, delete and recreate:
  ```bash
  git tag -d v1.0.1                    # delete local
  git push origin --delete v1.0.1      # delete remote
  git tag -a v1.0.1 -m "message"       # recreate
  git push origin v1.0.1               # push again
  ```
- **List all tags:** `git tag` or `git tag -l "v1.*"`
- **See tag details:** `git show v1.0.1`
- **Not every commit needs a tag** — only tag when you want to mark a release point.
- **Changelog** — update `src/content/changelog.md` before tagging so the release includes the notes.
