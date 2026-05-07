# Sample QA Project — README

> **Note:** The full ZIP isn't bundled with this static page. This file is a placeholder describing what the sample project contains. The Workspace-Init autopilot prompt knows how to fetch it (it falls back to cloning from `https://github.com/Luna-sa/basgiath-workshop-sample.git` if the zip isn't reachable).

## What's inside

A small **Tasks API + tiny web UI** — intentionally buggy. Designed for QA practice, not production use.

```
sample-project/
├── README.md              # This file (full version)
├── package.json
├── api/
│   ├── server.js          # Express server — has 4 known bugs
│   ├── routes/
│   │   ├── tasks.js       # CRUD on tasks. Off-by-one error on pagination.
│   │   ├── users.js       # Auth flow. Missing input validation on /register.
│   │   └── auth.js        # JWT token. Leaks token in error responses.
│   └── db.js              # SQLite. No SQL injection protection on search.
├── web/
│   ├── index.html
│   ├── app.js             # Tasks UI. XSS in title rendering.
│   └── style.css
├── tests/
│   ├── unit/              # 5 passing tests, 2 missing.
│   └── e2e/               # 1 example Playwright test.
└── docs/
    ├── api-spec.md        # OpenAPI-ish description.
    └── known-good.md      # Happy-path behaviour reference.
```

## The 6 known bugs (don't read until you've tried to find them)

<details>
<summary>Click only after you've explored</summary>

1. **`GET /tasks?page=1&size=10`** returns 0-9 instead of 1-10 (off-by-one).
2. **`POST /register`** accepts empty password.
3. **`/auth/login`** error response leaks the user's hashed password in the message string.
4. **`GET /tasks/search?q=...`** is vulnerable to SQL injection (`q=' OR 1=1 --`).
5. **`web/app.js`** renders task titles via `innerHTML` — XSS via `<img onerror>`.
6. **`DELETE /tasks/:id`** has no auth check — any user can delete any task.

</details>

## Suggested practice flow

1. Open the project in Claude Code: `cd ~/qa-workshop/sample-project && claude`.
2. `/test-cases tasks API pagination` — see what Claude generates.
3. `/review api/routes/auth.js` — let your QA-reviewer agent eat it.
4. `/api-test POST /register` — generate request scenarios + cURL.
5. Use the Playwright MCP: "use playwright to open localhost:3000, log in as user1, try to delete user2's task — report what happens".
6. `/bug-report` for each issue you find. Compare to the list above.

## Running locally

```bash
cd ~/qa-workshop/sample-project
npm install
npm run dev          # API on :3000, web on :5173
npm test             # Unit tests
npm run e2e          # Playwright suite
```

## Why a buggy project?

Because finding bugs in clean code teaches you nothing. The whole workshop premise is: AI doesn't replace your QA judgement, it amplifies it. You still have to *know what good looks like* — the AI just gets you there faster.

---

*Basgiath QA Workshop — sample project*
