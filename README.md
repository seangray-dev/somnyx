# SOMNYX

## TODO

- [ ] New Dream Form - (places, people, things) - detect missing commas
- [ ] Update mobile header design
- [ ] Refactor to use Preloaded queries
- [ ] Cache the emotions / themes / roles queries
- [x] Delete Dream - on dashboard page
- [ ] Delete Dream - on dream page
- [x] Dream Analysis
- [ ] Edit Dream
- [ ] Prevent unauthenticated users from deleting, or making dreams public/private
- [x] Update the share link to use the new domain
- [x] Make it deploy
- [ ] Journal Page (with pagination, search, and filters)
- [x] Settings / Profile Page
- [ ] Delete Account and related data

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
