# SOMNYX

## TODO

- [ ] Issue with signing up not redirecting... stuck on clerk page
- [ ] change relatvie date to actual date (in dream card)
- [ ] Sorting dreams by date the dream happened - Recent Dreams + Journal
- [ ] Journal Page
  - [x] pagination
  - [ ] search
  - [ ] filters
- [ ] (Paid) - Edit Dream + New Analysis
- [x] Delete Account and related data (settings page)
  - [ ] Feedback for reason on deleting account
- [ ] Update the share link to use the new domain - look into using a service
- [x] Deep Analysis Feature
  - [ ] add loading states and placeholder for when insight hasn't been generated yet
- [ ] Error + 404 pages
- [ ] PWA setup and notifications
- [ ] Favicon, logo
- [ ] Metadata + SEO
- [ ] Landing Page
- [ ] Legal Pages
- [ ] Contact + Support Page
- [x] Domain Purchase
- [ ] Analytics (posthog, plausible)
- [ ] Error Management? (Sentry)
- [ ] Deploy to production (convex, clerk)
- [ ] Create blog posts
- [x] Make it deploy
- [ ] ? Allow users to log that they did not dream - don't execute analysis
- [ ] (backlog) Consider adding a themes table, store id of theme on dream table. Do lookup on themes table before inserting new themes in db. Add it if it doesn't exist yet.

## Getting Started

Copy the `.env.example` file to `.env` and obtain the values.

```bash
cp .env.example .env
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [https://localhost:3000](https://localhost:3000) with your browser to see the result.

## 🗄️ Project Structure

Most of the code lives in the `src` folder and looks something like this:

```sh
.vscode              # VSCode configurations
|
convex               # Convex db - contains schema, functions, etc.
|
public               # static assets
|
src
|
+-- app               # application layer containing:
|   +-- routes        # folder based routing
|   |   |
|   |   page.tsx      # page components
|   layout.tsx        # main application layout
|
+-- components        # shared components used across the entire application
|
+-- config            # global configurations, exported env variables etc.
|
+-- context           # global contexts, exported context hooks etc.
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # shared libraries used across the entire application
|
+-- providers         # global providers, exported provider hooks etc.
|
+-- styles            # global styles
|
+-- test              # test utilities and mocks
|
+-- types             # shared types used across the application
|
+-- utils             # shared utility functions
|
middleware.ts     # Next.js middleware
```
