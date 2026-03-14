# Weeks IT Solutions

A static marketing website for **Weeks IT Solutions** — a web development agency focused on building fast, modern websites that help small businesses grow.

Live site: [https://nullgrimoire.github.io/weeks-it-solutions](https://nullgrimoire.github.io/weeks-it-solutions)

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Home — hero, services overview, portfolio highlights, testimonials, CTA |
| `services.html` | Full services breakdown with pricing indicators |
| `portfolio.html` | Case studies and project showcase |
| `about.html` | Company story, values, and team |
| `contact.html` | Contact form with project intake fields |

## Tech Stack

- **HTML5** — semantic markup
- **Tailwind CSS** (CDN) — utility-first styling
- **Custom CSS** (`assets/css/styles.css`) — design tokens, glassmorphism, animations
- **Vanilla JS** (`assets/js/main.js`) — navbar scroll, mobile menu, particle canvas, scroll reveals, form validation
- **Google Fonts** — Inter + Space Grotesk

## Project Structure

```
weeks-it-solutions/
├── index.html
├── about.html
├── contact.html
├── portfolio.html
├── services.html
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        └── main.js
```

## Getting Started

No build step required — open any `.html` file directly in a browser, or serve with any static file server:

```bash
# With VS Code Live Server, Python, or npx serve:
npx serve .
```

## Deployment

The site is a fully static set of HTML files and can be deployed to any static host:

- **GitHub Pages** — push to `main`, enable Pages in repo settings (root of `main` branch)
- **Netlify / Vercel** — drag-and-drop the folder or connect the repo

## License

© 2026 Weeks IT Solutions. All rights reserved.
