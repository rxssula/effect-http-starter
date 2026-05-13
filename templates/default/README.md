# Effect HTTP Starter

A production-ready HTTP server template built with [Effect](https://effect.website/) and the schema-first `HttpApi` pattern.

## Quick Start

```bash
bun install
bun dev
```

The server starts at `http://localhost:3000` (configurable via `.env`).

## Available Routes

| Method | Endpoint      | Description         |
|--------|---------------|---------------------|
| GET    | `/health`     | Health check        |
| GET    | `/users`      | List all users      |
| GET    | `/users/:id`  | Get user by ID      |
| POST   | `/users`      | Create a user       |
| PATCH  | `/users/:id`  | Update a user       |
| DELETE  | `/users/:id`  | Delete a user       |

## API Documentation

Scalar API docs are available at `http://localhost:3000/docs`

OpenAPI spec is available at `http://localhost:3000/openapi.json`

## Project Structure

```
├── src/
│   ├── Api.ts                 # API schema & endpoint definitions
│   ├── Server.ts              # Server wiring & launch
│   ├── users/
│   │   └── Handlers.ts        # User CRUD handlers & repo
│   └── system/
│     └── Handlers.ts          # Health check handler
├── index.ts                   # Entry point
├── package.json
├── tsconfig.json
└── .env                       # Environment variables
```

## Scripts

- `bun dev` — Start dev server with hot reload
- `bun start` — Start production server
- `bun prepare` — Set up Effect language service for IDE support

## Adding a New API Group

1. Define your group in `src/Api.ts`:

```ts
.add(
  HttpApiGroup.make("todos")
    .add(HttpApiEndpoint.get("listTodos", "/todos", {
      success: Schema.Array(Todo)
    }))
)
```

2. Create `src/todos/Handlers.ts`:

```ts
export const TodosApiHandlers = HttpApiBuilder.group(
  Api,
  "todos",
  (handlers) =>
    handlers.handle("listTodos", () => /* ... */)
)
```

3. Wire it up in `src/Server.ts`:

```ts
Layer.provide(TodosApiHandlers),
```

## Technology

- **[Effect](https://effect.website/)** — Type-safe, composable async programming
- **[Effect HTTP](https://effect.website/docs/http)** — Schema-first HTTP API with OpenAPI generation
- **[Bun](https://bun.sh/)** — Fast JavaScript runtime