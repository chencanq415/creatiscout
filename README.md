# CreatiScout App

CreatiScout is a bilingual (English / Chinese) product prototype for running creator marketing campaigns in one workspace. It helps brands set up campaigns, match creators, configure automated collaboration follow-up, and review campaign performance.

> This is a front-end demo built with mock data. Authentication, creator matching, workflow automation, and reporting are presented as interactive product flows and do not connect to production services.

## What you can explore

- **Sign in and sign up** — Brand and Creator roles, mock email verification, Google sign-in entry point, password reset, language switcher, and a one-click Demo entry.
- **Digital employee onboarding** — Choose a Free, Plus, or Pro plan before entering the workspace; Enterprise directs users to a demo request.
- **Campaigns** — Create, view, pause, and manage campaign records with structured campaign details, compensation, creator requirements, and attachments.
- **AI Workflow** — Configure creator matching, collaboration follow-up, templates, pricing negotiation, confirmation messages, and campaign analysis. Each template can be generated with mock AI content.
- **Creators** — Browse Campaign Matching recommendations or the Creator Marketplace.
- **Collaboration** — Track creator relationships from shortlist through outreach, offer, confirmation, draft, publication, payment, and performance tracking.
- **Insights** — Review campaign-level performance data and next-round recommendations.

## Product flow

```text
Sign in / Demo
  → choose a digital employee plan
  → create a campaign
  → configure AI workflow
  → discover and manage creators
  → track collaboration and performance
```

## Run locally

### Requirements

- Node.js 22 or later
- npm

### Start the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Select **Demo** in the top-right corner of the sign-in page to enter the mock-data workspace immediately.

### Other commands

```bash
npm run build        # Production build
npm run start        # Run a production build locally
npm run lint         # Lint the project
npm run format       # Format source files
```

## GitHub Pages deployment

This repository includes a GitHub Actions workflow that deploys every push to `main` to GitHub Pages.

1. Open the repository **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Push to `main`, then wait for the **Deploy to GitHub Pages** workflow to finish.

The published demo URL is expected at:

`https://chencanq415.github.io/creatiscout/`

For a local static-export check, run:

```bash
npm run build:pages
```

## Project structure

```text
app/                    Route pages and layouts
components/             Reusable UI and feature components
components/campaigns/   Campaign creation and AI workflow UI
lib/                    Mock data, types, stores, and i18n helpers
public/                 Brand and sign-in visual assets
docs/                   Product and design references
design.md               Product visual and UX direction
.github/workflows/      GitHub Pages deployment workflow
```

## Notes for production

- Replace mock browser storage with a secure authentication and session service.
- Connect campaign, creator, collaboration, payment, and insight views to real APIs.
- Replace mock AI template generation and matching with guarded production workflows.
- Add backend validation, role permissions, audit history, and payment compliance before handling real campaigns.

## Documentation

- [Design direction](./design.md)
- [Product design notes](./docs/product-design.md)
