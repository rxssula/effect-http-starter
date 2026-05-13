import { Effect } from "effect"
import { HttpApiBuilder } from "effect/unstable/httpapi"
import { Api } from "../Api"

export const SystemApiHandlers = HttpApiBuilder.group(
  Api,
  "system",
  (handlers) =>
    handlers.handle("health", () =>
      Effect.succeed({ status: "ok" as const })
    )
)