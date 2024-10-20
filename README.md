# SOMNYX

## TODO

- [x] New Dream Form - (places, people, things) - detect missing commas
- [x] Dream Analysis
- [x] Update nav header design + for mobile (back navigation)
- [x] Refactor to use Preloaded queries
- [x] Prevent unauthenticated users from deleting, or making dreams public/private
- [x] No dreams UI (dashboard, journal) + remove Load More button (journal page)
- [ ] Refactor: Dashboard Header Greeting - if no user first name - don't show 'User' fallback
- [ ] Dashoard Header - loading state...
- [ ] Sorting dreams by date the dream happened - Recent Dreams + Journal
- [x] Remove stats banner on dream/id page when not logged in
- [x] Loading state for analysis generation on dreams/id page
- [ ] Journal Page
  - [x] pagination
  - [ ] search
  - [ ] filters
- [x] Cache the emotions / themes / roles queries in global state?
- [ ] Issue with signing up not redirecting... stuck on clerk page
- [ ] Delete Dream - on dream page
- [ ] (Paid) - Edit Dream + New Analysis
- [x] Delete Account and related data (settings page)
  - [ ] Feedback for reason on deleting account
- [ ] Update the share link to use the new domain - look into using a service
- [x] Stats Feature + Pages (common emotions, themes. Total dreams, Dreams in last month)
- [ ] (Paid - free for first month) Deep Analysis after x amount of dreams (or per month basis)
- [ ] Zodiac Features? (requires onboarding steps, storing additional data ie: birthday, zodiac sign)
- [ ] Error + 404 pages
- [ ] PWA setup and notifications
- [ ] Determine pricing model (credit vs subscription)
- [ ] Stripe Setup
- [ ] Favicon, logo
- [ ] Metadata + SEO
- [ ] Landing Page
- [ ] Legal Pages
- [ ] Contact + Support Page
- [ ] Domain Purchase
- [ ] Analytics (posthog, plausible)
- [ ] Error Management? (Sentry)
- [ ] Deploy to production (convex, clerk)
- [ ] Create blog posts
- [x] Make it deploy

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
