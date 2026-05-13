import { Layer } from "effect"
import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { HttpRouter } from "effect/unstable/http"
import { HttpApiBuilder, HttpApiScalar } from "effect/unstable/httpapi"
import { Api } from "./Api"
import { UsersApiHandlers, UserRepoLive } from "./users/Handlers"
import { SystemApiHandlers } from "./system/Handlers"

const ApiRoutes = HttpApiBuilder.layer(Api, {
  openapiPath: "/openapi.json"
}).pipe(
  Layer.provide(UsersApiHandlers),
  Layer.provide(SystemApiHandlers),
  Layer.provide(UserRepoLive)
)

const DocsRoute = HttpApiScalar.layer(Api, { path: "/docs" })

const AllRoutes = Layer.mergeAll(ApiRoutes, DocsRoute)

const HttpServerLive = HttpRouter.serve(AllRoutes).pipe(
  Layer.provide(BunHttpServer.layer({ port: Number(process.env.PORT) || 3000 }))
)

Layer.launch(HttpServerLive).pipe(BunRuntime.runMain)