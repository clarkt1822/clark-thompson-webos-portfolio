# Clark Thompson Portfolio

A custom Next.js portfolio built as a personal operating system / digital command center.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- App Router

## Local Setup

1. Open a terminal in this project folder.
2. Install dependencies:

```powershell
npm install
```

3. Start the local dev server:

```powershell
npm run dev
```

4. Open the site in your browser:

```text
http://localhost:3000
```

5. Stop the dev server when you are done:

```powershell
Ctrl + C
```

## Production Check

Run a production build locally before pushing:

```powershell
npm run build
```

Optional local lint check:

```powershell
npm run lint
```

## File Structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  site/
    about-panel.tsx
    app-shell.tsx
    contact-panel.tsx
    experience-panel.tsx
    footer-note.tsx
    launcher-nav.tsx
    projects-panel.tsx
    reveal.tsx
    skills-panel.tsx
    terminal-widget.tsx
    workspace-hero.tsx
  ui/
    button.tsx
    section-header.tsx
    section-window.tsx
    tag.tsx
    window-chrome.tsx
content/
  site.ts
lib/
  utils.ts
public/
  resume/
    README.md
.env.example
.gitignore
next.config.ts
package.json
postcss.config.js
tailwind.config.ts
tsconfig.json
```

## Where To Edit Content

- Hero copy: `content/site.ts` in `siteContent.hero`
- About copy: `content/site.ts` in `siteContent.about`
- Projects: `content/site.ts` in `siteContent.projects`
- Experience: `content/site.ts` in `siteContent.experience`
- Skills: `content/site.ts` in `siteContent.skills`
- Contact links: `content/site.ts` in `siteContent.contact.links`
- Resume path: `content/site.ts` in `siteContent.resumePath`

## Resume Placement

Put your PDF here:

```text
public/resume/Clark-Thompson-Resume.pdf
```

That makes the public URL:

```text
/resume/Clark-Thompson-Resume.pdf
```

## Environment Variables

No secrets are hardcoded in this project.

If you add integrations later, copy `.env.example` to `.env.local` and add your own values there.

Never commit:

- `.env`
- `.env.local`
- `.env.production.local`
- API keys
- service role keys
- database passwords

## GitHub Notes Before First Commit

Double-check these before pushing publicly:

- `content/site.ts`
- `public/resume/`
- `.env.local` if you create it
- any real project links
- any personal email or phone number you do or do not want public

Files that should never be committed:

- `node_modules/`
- `.next/`
- `.vercel/`
- `.env*` files with real values
- local editor junk

## Recommended Git Defaults

- Create the files first, then create the GitHub repo.
- Use `main` as the branch name.
- Recommended first commit message:

```text
feat: initial Clark Thompson portfolio site
```

## Git Initialization

If this folder is not already a Git repo:

```powershell
git init
git branch -M main
git add .
git commit -m "feat: initial Clark Thompson portfolio site"
```

## Create The GitHub Repo And Connect It

1. Go to GitHub.
2. Click `New repository`.
3. Name it something like `clark-thompson-portfolio`.
4. Keep it empty.
   Do not add a README, `.gitignore`, or license on GitHub if you already have local files.
5. Copy the repo URL.
6. Run:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/clark-thompson-portfolio.git
git push -u origin main
```

## Vercel Deployment

1. Push the repo to GitHub first.
2. Go to Vercel and sign in.
3. Click `Add New Project`.
4. Import the GitHub repo.
5. Vercel should detect Next.js automatically.
6. Leave the default build settings unless you change them later.
7. Add environment variables in Vercel only if you introduce them later.
8. Click `Deploy`.

## Future Update Workflow

1. Edit code or content locally.
2. Run:

```powershell
npm run dev
```

3. Check the site at `http://localhost:3000`.
4. Run:

```powershell
npm run build
```

5. Commit your changes:

```powershell
git add .
git commit -m "feat: update portfolio content"
```

6. Push:

```powershell
git push
```

7. Vercel will redeploy automatically if the repo is connected.

## QA Checklist

- Hero reads clearly on desktop and mobile
- Resume link works
- Contact links are real
- Placeholder project links are replaced
- Copy matches your real experience level
- Build succeeds with `npm run build`
- No secrets are present in tracked files
