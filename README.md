# create-effect-http-starter

Scaffold a new Effect HTTP server project with schema-first API design.

## Usage

```bash
# npm
npm create effect-http-starter@latest -- my-app

# pnpm
pnpm create effect-http-starter my-app

# bun
bun create effect-http-starter my-app

# npx
npx create-effect-http-starter@latest my-app
```

Then:

```bash
cd my-app
bun install   # or pnpm install / npm install
bun dev       # or pnpm dev / npm run dev
```

## Templates

Currently available:

- **default** — Schema-first HTTP API with in-memory CRUD, health check, and Scalar docs

More templates coming soon.

```bash
bun create effect-http-starter my-app --template default
```

## What's Included

The default template provides:

- **Schema-first API** using `HttpApi` + `HttpApiBuilder`
- **Full CRUD** on `/users` with in-memory storage
- **Health check** at `/health`
- **Scalar API docs** at `/docs`
- **OpenAPI spec** at `/openapi.json`
- **Hot reload** via `bun --hot`
- **Effect language service** setup for IDE support
- **Pre-configured `bun.lock`** for reproducible installs

## Project Structure

```
my-app/
├── src/
│   ├── Api.ts              # API schema & endpoint definitions
│   ├── Server.ts           # Server wiring & launch
│   ├── users/
│   │   └── Handlers.ts     # User CRUD handlers & repo
│   └── system/
│     └── Handlers.ts       # Health check handler
├── index.ts
├── package.json
├── tsconfig.json
├── .gitignore
└── .env
```

## License

MIT
