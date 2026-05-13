import { HttpApi, HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/unstable/httpapi"
import { Schema } from "effect"

// ── Schemas ──────────────────────────────────────────────────────────────────

export class User extends Schema.Class<User>("User")({
  id: Schema.Number,
  name: Schema.String
}) {}

export const CreateUserPayload = Schema.Struct({
  name: Schema.String
})

export const UpdateUserPayload = Schema.Struct({
  name: Schema.String
})

export const NotFoundError = Schema.Struct({
  _tag: Schema.Literal("NotFound"),
  message: Schema.String
}).pipe(HttpApiSchema.status(404))

// ── API Definition ───────────────────────────────────────────────────────────

export class Api extends HttpApi.make("app")
  .add(
    HttpApiGroup.make("users")
      .add(
        HttpApiEndpoint.get("listUsers", "/users", {
          success: Schema.Array(User)
        })
      )
      .add(
        HttpApiEndpoint.get("getUser", "/users/:id", {
          params: Schema.Struct({ id: Schema.NumberFromString }),
          success: User,
          error: NotFoundError
        })
      )
      .add(
        HttpApiEndpoint.post("createUser", "/users", {
          payload: CreateUserPayload,
          success: User
        })
      )
      .add(
        HttpApiEndpoint.patch("updateUser", "/users/:id", {
          params: Schema.Struct({ id: Schema.NumberFromString }),
          payload: UpdateUserPayload,
          success: User,
          error: NotFoundError
        })
      )
      .add(
        HttpApiEndpoint.delete("deleteUser", "/users/:id", {
          params: Schema.Struct({ id: Schema.NumberFromString }),
          success: Schema.Struct({ ok: Schema.Boolean }),
          error: NotFoundError
        })
      )
  )
  .add(
    HttpApiGroup.make("system")
      .add(
        HttpApiEndpoint.get("health", "/health", {
          success: Schema.Struct({ status: Schema.Literal("ok") })
        })
      )
  ) {}