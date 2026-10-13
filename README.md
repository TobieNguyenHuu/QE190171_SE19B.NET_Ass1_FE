# TaskTrack Web (PRN232 – Assignment 1, frontend)

Next.js 14 (App Router, TypeScript) + Tailwind CSS. Every page is public; all data comes from the TaskTrack API.

```
app/          routes (pages)
components/   badges, tables, modal/confirm/toast, forms
lib/          api client, types, constants, helpers
```

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Welcome, counts, task-status bar, active project cards |
| `/departments`, `/departments/[id]` | Departments, and one department with its projects |
| `/projects/[id]` | Project details + task list (status/priority badges, tags, due date) |
| `/tasks/[id]` | Every field of one task, including tags |
| `/search` | Filter tasks by title, status, priority, project, tag (updates as you type) |
| `/departments/manage`, `/projects/manage`, `/tasks/manage`, `/tags/manage` | Public CRUD tables with modal forms and delete confirmation |

## Run locally

```bash
cp .env.example .env.local      # set NEXT_PUBLIC_API_URL (http://localhost:5000 for a local API)
npm install
npm run dev                     # http://localhost:3000
```

Other scripts: `npm run lint`, `npm run build`.

## Deploy on Vercel

1. Push this folder to its own public GitHub repo.
2. Vercel → Add New → Project → import the repo (framework: Next.js, defaults are fine).
3. Environment Variables: `NEXT_PUBLIC_API_URL` = your Render backend URL (no trailing slash).
4. Deploy, then add the Vercel URL to `CORS_ALLOWED_ORIGINS` on the Render service and redeploy it.

> Render's free tier sleeps when idle, so the first request can take up to a minute. The UI shows a spinner, and an error panel with **Try again** if the API is still waking up.

## Assignment 2 – Authentication

New pages: `/login`, `/register`, `/admin` (dashboard), `/admin/departments`, `/admin/projects`, `/admin/tasks`, `/admin/tags`, `/admin/accounts` (Admin only). The old `/…/manage` pages were moved under `/admin`.

- JWT is stored in `localStorage` (`tasktrack.token`) and sent as `Authorization: Bearer <token>` on every create/update/delete call and on `/api/accounts`.
- `/admin/*` is guarded in `app/admin/layout.tsx`: no valid (unexpired) token → redirect to `/login`.
- Token expiry: the `exp` claim is checked on load and a timer logs the user out when it expires; any `401` from a protected call clears the session and redirects to `/login?expired=1`.
- Navbar shows the user's name + Logout when logged in, and Login / Register otherwise. Logout clears the token and returns to the home page.
