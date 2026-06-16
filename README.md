# DevPortal Frontend

Frontend application for **DevPortal**, a technical request management platform (simplified Jira) built with Next.js 14, TypeScript, and Tailwind CSS. It communicates with [devportal-api](https://github.com/joliveira-abaqus/devportal-api) (port 3001) via httpOnly cookies using JWT-based authentication.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Authentication](#authentication)
- [Dark Mode](#dark-mode)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Conventions](#conventions)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User registration and login with credential-based authentication
- Dashboard with overview of technical requests
- Create, view, and track technical requests (bug fixes, features, migrations)
- File upload support for request attachments
- Request timeline with status history
- Dark/light theme toggle via `next-themes`
- Route protection middleware for authenticated pages
- Form validation with Zod schemas

## Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) 5.4+ |
| UI | [React 18](https://react.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 3.4 + [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms) |
| Authentication | [NextAuth.js](https://next-auth.js.org/) (CredentialsProvider + JWT strategy) |
| HTTP Client | [Axios](https://axios-http.com/) (withCredentials) |
| Forms | [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Icons | [lucide-react](https://lucide.dev/) |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) |
| E2E Testing | [Playwright](https://playwright.dev/) |
| Linting | ESLint + Prettier |

## Requirements

- **Node.js** >= 18
- **npm** (ships with Node.js)
- **devportal-api** running on port 3001 (see [devportal-api](https://github.com/joliveira-abaqus/devportal-api))
- **devportal-infra** for backing services — PostgreSQL, Redis, LocalStack (see [devportal-infra](https://github.com/joliveira-abaqus/devportal-infra))

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/joliveira-abaqus/devportal-frontend.git
cd devportal-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local if your backend runs on a different port

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

> **Note:** Make sure [devportal-api](https://github.com/joliveira-abaqus/devportal-api) is running on port 3001 and [devportal-infra](https://github.com/joliveira-abaqus/devportal-infra) services (PostgreSQL, Redis) are up before starting.

## Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Public URL of the backend API | `http://localhost:3001` |
| `NEXTAUTH_SECRET` | Secret used to sign NextAuth.js tokens | *(required)* |
| `NEXTAUTH_URL` | Canonical URL of the frontend app | `http://localhost:3000` |
| `BACKEND_URL` | Backend URL for server-side calls | `http://localhost:3001` |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── api/auth/           # NextAuth.js route handler
│   ├── dashboard/          # Dashboard page
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── requests/           # Request listing
│   │   ├── new/            # Create new request
│   │   └── [id]/           # Request detail (dynamic route)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home / landing page
│   ├── providers.tsx       # Client-side providers (theme, session)
│   └── globals.css         # Global styles
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI primitives
│   ├── Header.tsx          # App header with navigation
│   ├── Sidebar.tsx         # Sidebar navigation
│   ├── RequestForm.tsx     # Request creation/edit form
│   ├── RequestCard.tsx     # Request summary card
│   ├── RequestTimeline.tsx # Status history timeline
│   ├── StatusBadge.tsx     # Status indicator badge
│   ├── FileUpload.tsx      # File upload component
│   └── ThemeToggle.tsx     # Dark/light mode toggle
├── hooks/                  # Custom React hooks
│   ├── useRequest.ts       # Single request data fetching
│   └── useRequests.ts      # Request list data fetching
├── lib/                    # Utilities and configuration
│   ├── api-client.ts       # Axios instance (withCredentials)
│   ├── auth.ts             # NextAuth.js configuration
│   └── utils.ts            # Helper functions
├── types/                  # TypeScript interfaces and types
│   └── index.ts            # Shared type definitions
└── middleware.ts            # Route protection (dashboard, requests)
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npm run format` | Check formatting with Prettier |
| `npm run format:fix` | Auto-fix formatting with Prettier |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:e2e:ui` | Run Playwright tests with interactive UI |

## Authentication

Authentication uses **NextAuth.js** with a `CredentialsProvider` that delegates to the backend API:

1. User submits email/password via the login form
2. Backend sets an httpOnly cookie with a JWT token
3. NextAuth.js creates a client-side session via its own JWT strategy
4. The `middleware.ts` protects `/dashboard` and `/requests/*` routes, redirecting unauthenticated users to `/login`

**Test credentials:**

| Field | Value |
|---|---|
| Email | `dev@devportal.local` |
| Password | `DevPortal123!` |

> These credentials are seeded by [devportal-infra](https://github.com/joliveira-abaqus/devportal-infra) and are only available in local development.

## Dark Mode

Theme switching is handled by `next-themes`. The `ThemeToggle` component allows users to switch between light and dark modes. The theme persists across sessions via `localStorage`. A `mounted` state guard prevents SSR hydration mismatches.

## Testing

End-to-end tests live in the `e2e/` directory and use [Playwright](https://playwright.dev/).

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with interactive UI
npm run test:e2e:ui
```

> **Prerequisites:** The full stack must be running (devportal-infra + devportal-api + devportal-frontend) before executing E2E tests.

## CI/CD

GitHub Actions runs on every pull request:

1. **Lint** — `npm run lint`
2. **Build** — `npm run build`

E2E tests run after the build step with PostgreSQL and Redis services. Playwright artifacts (screenshots, videos) are retained for 7 days.

## Conventions

| Area | Convention |
|---|---|
| Comments & commits | Portuguese (BR) |
| Branch naming | `feature/<scope>` in kebab-case |
| Components | PascalCase |
| Hooks | `use` prefix (e.g., `useRequests`) |
| Form validation | Zod schemas via `@hookform/resolvers` |
| Code style | ESLint + Prettier (semi, singleQuote, trailingComma: all) |

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Make your changes following the [conventions](#conventions)
4. Run lint before committing: `npm run lint`
5. Commit with a descriptive message in Portuguese: `git commit -m 'feat: adicionar nova funcionalidade'`
6. Push to your branch: `git push origin feature/my-feature`
7. Open a Pull Request — CI will run lint and build automatically

## License

This project is proprietary. All rights reserved.

---

Originally written and maintained by contributors and [Devin](https://app.devin.ai), with updates from the core team.
