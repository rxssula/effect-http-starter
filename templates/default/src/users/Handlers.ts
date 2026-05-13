import { Context, Effect, Layer, Ref } from "effect"
import { HttpApiBuilder } from "effect/unstable/httpapi"
import { Api, User } from "../Api"

// ── UserRepo Service ──────────────────────────────────────────────────────────

const notFound = (id: number) =>
  Effect.fail({ _tag: "NotFound" as const, message: `User with id ${id} not found` })

export class UserRepo extends Context.Service<UserRepo>()("app/UserRepo", {
  make: Effect.gen(function*() {
    const nextId = yield* Ref.make(1)
    const users = yield* Ref.make(new Map<number, User>())

    return {
      list: () =>
        Effect.map(Ref.get(users), (map) => Array.from(map.values())),

      findById: (id: number) =>
        Effect.gen(function*() {
          const map = yield* Ref.get(users)
          const user = map.get(id)
          if (user === undefined) return yield* notFound(id)
          return user
        }),

      create: (name: string) =>
        Effect.gen(function*() {
          const id = yield* Ref.modify(nextId, (n) => [n, n + 1] as const)
          const user = new User({ id, name })
          yield* Ref.update(users, (map) => { map.set(id, user); return map })
          return user
        }),

      update: (id: number, name: string) =>
        Effect.gen(function*() {
          const map = yield* Ref.get(users)
          if (!map.has(id)) return yield* notFound(id)
          const user = new User({ id, name })
          yield* Ref.update(users, (map) => { map.set(id, user); return map })
          return user
        }),

      remove: (id: number) =>
        Effect.gen(function*() {
          const map = yield* Ref.get(users)
          if (!map.has(id)) return yield* notFound(id)
          yield* Ref.update(users, (map) => { map.delete(id); return map })
          return { ok: true }
        })
    }
  })
}) {}

export const UserRepoLive = Layer.effect(UserRepo)(UserRepo.make)

// ── Handlers ──────────────────────────────────────────────────────────────────

export const UsersApiHandlers = HttpApiBuilder.group(
  Api,
  "users",
  Effect.fnUntraced(function*(handlers) {
    const repo = yield* UserRepo
    return handlers
      .handle("listUsers", () => repo.list())
      .handle("getUser", ({ params: { id } }) => repo.findById(id))
      .handle("createUser", ({ payload }) => repo.create(payload.name))
      .handle("updateUser", ({ params: { id }, payload }) => repo.update(id, payload.name))
      .handle("deleteUser", ({ params: { id } }) => repo.remove(id))
  })
)