import { describe, expect, test } from "bun:test"

import type { OhMyOpenCodeConfig } from "../../config"
import { InvalidObjectiveError } from "../../hooks/goal/validation"
import { handleGoalMessage } from "./loop-commands"
import type { ChatMessageHandlerOutput, ChatMessageHooks, ChatMessageInput } from "./types"

function makeArgs(promptText: string, setGoal: ChatMessageHooks["goal"]["setGoal"]) {
  const hooks: ChatMessageHooks = {
    goal: {
      setGoal,
      getGoal: () => null,
      pauseGoal: () => null,
      resumeGoal: () => null,
      clearGoal: () => false,
      markComplete: () => null,
    },
  }
  const input: ChatMessageInput = { sessionID: "s1" }
  const output: ChatMessageHandlerOutput = {
    message: {},
    parts: [{ type: "text", text: promptText }],
  }
  return {
    hooks,
    input,
    output,
    isFirstMessage: true,
    pluginConfig: { default_mode: { goal: true } } as OhMyOpenCodeConfig,
    nativeGoalCommand: false,
  }
}

describe("handleGoalMessage", () => {
  test("does not throw when setGoal rejects an over-length objective", () => {
    const longObjective = "x".repeat(2001)
    const setGoal = () => {
      throw new InvalidObjectiveError("Objective exceeds maximum length of 2000 characters")
    }
    expect(() => handleGoalMessage(makeArgs(longObjective, setGoal))).not.toThrow()
  })

  test("sets goal on a valid first message", () => {
    let captured: string | null = null
    const setGoal = (_sessionID: string, objective: string) => {
      captured = objective
      return { objective, status: "active" }
    }
    handleGoalMessage(makeArgs("Ship the dashboard", setGoal))
    expect(captured).toBe("Ship the dashboard")
  })
})
