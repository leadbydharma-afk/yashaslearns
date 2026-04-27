# YashasLearns — NIOS Class 10 Study Portal

**Live site:** [yashaslearns.com](https://yashaslearns.com)

A personalised NIOS Secondary (Class 10) exam prep portal built for Yashas.

## Subjects
- 📘 Science & Technology (212) — 7 Modules, 22m heaviest
- 🏠 Home Science (216) — 22 Lessons
- 📝 English (202) — Texts + Grammar + Writing + Comprehension
- 🪷 Sanskrit (209) — Textbook + Grammar + Creative Writing
- 🎨 Painting (225) — Indian Art + Western Art + Contemporary

## Features
- Practice papers (3 per chapter) with PYQ questions from 2021–2025
- Chapter summaries with keyword highlights
- Exam date countdown
- Works **offline** via Service Worker
- Installable as an app on Android/iOS
- Volvo Bus World section for Yashas's special interest

## File Structure
```
yashaslearns.com/
├── index.html          ← Main app
├── sw.js               ← Service Worker (offline support)
├── manifest.json       ← PWA manifest (installable app)
├── icons/              ← App icons
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon-maskable.png
└── README.md
```

## Future structure (as QB grows)
```
data/
├── qb_science.js       ← Science QB (300+ questions)
├── qb_hs.js            ← Home Science QB
├── qb_english.js       ← English QB + all comprehension passages
├── qb_sanskrit.js      ← Sanskrit QB + full grammar
└── qb_painting.js      ← Painting QB
```

## Updating content
1. Claude generates updated data file in a session
2. Upload to GitHub
3. Bump `VERSION` in `sw.js` (e.g. v1.0 → v1.1)
4. Push — Yashas gets update banner next time he opens the app on Wi-Fi

## Hosting
- GitHub repository: [github.com/leadbydharma-afk](https://github.com/leadbydharma-afk)
- Custom domain: yashaslearns.com
- GitHub Pages with custom domain configured in repo Settings → Pages
