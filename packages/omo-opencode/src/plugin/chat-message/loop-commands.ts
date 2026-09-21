import type { OhMyOpenCodeConfig } from "../../config"

import { AUTO_SLASH_COMMAND_TAG_OPEN } from "../../hooks/auto-slash-command/constants"
import { parseGoalCommand } from "../../hooks/goal/command-arguments"
import { log } from "../../shared"
import { extractPromptText } from "./prompt-text"
import type { ChatMessageHooks, ChatMessageHandlerOutput, ChatMessageInput } from "./types"

export function handleGoalMessage(args: {
  readonly hooks: ChatMessageHooks
  readonly input: ChatMessageInput
  readonly output: ChatMessageHandlerOutput
  readonly isFirstMessage: boolean
  readonly pluginConfig: OhMyOpenCodeConfig
  readonly nativeGoalCommand: boolean
}): void {
  const { hooks, input, output, isFirstMessage, pluginConfig, nativeGoalCommand } = args
  if (!hooks.goal || nativeGoalCommand) {
    return
  }

  const promptText = extractPromptText(output.parts)
  if (promptText.includes(AUTO_SLASH_COMMAND_TAG_OPEN)) {
    return
  }
  const parsed = parseGoalCommand(promptText)

  switch (parsed.kind) {
    case "setObjective":
      if (isFirstMessage && pluginConfig.default_mode?.goal) {
        trySetGoal(hooks, input.sessionID, parsed.objective)
      }
      break
    case "setStatus":
      if (parsed.status === "paused") {
        hooks.goal.pauseGoal(input.sessionID)
        log("[chat-message] Goal paused", { sessionID: input.sessionID })
      } else {
        hooks.goal.resumeGoal(input.sessionID)
        log("[chat-message] Goal resumed", { sessionID: input.sessionID })
      }
      break
    case "clear":
      hooks.goal.clearGoal(input.sessionID)
      log("[chat-message] Goal cleared", { sessionID: input.sessionID })
      break
    case "show":
      // No side effect; the goal is surfaced by TUI mirror and tools.
      break
    default:
      break
  }

  if (
    parsed.kind === "show"
    && isFirstMessage
    && pluginConfig.default_mode?.goal
  ) {
    const objective = promptText.trim()
    if (objective.length > 0) {
      trySetGoal(hooks, input.sessionID, objective)
    }
  }
}

function trySetGoal(hooks: ChatMessageHooks, sessionID: string, objective: string): void {
  if (!hooks.goal) {
    return
  }
  try {
    hooks.goal.setGoal(sessionID, objective)
    log("[chat-message] Goal set", { sessionID, objective })
  } catch (error) {
    // Goal validation errors (e.g. objective > 2000 chars) must not abort chat.message: that surfaces as a native "Failed to send prompt" toast.
    log("[chat-message] Goal set skipped", {
      sessionID,
      reason: error instanceof Error ? error.message : String(error),
    })
  }
}
