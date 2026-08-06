import {
	getBundledModelCapabilitiesSnapshot,
	getModelCapabilities as getModelCapabilitiesFromCore,
} from "@oh-my-opencode/model-core"
import type { GetModelCapabilitiesInput, ModelCapabilities } from "@oh-my-opencode/model-core"
import * as connectedProvidersCache from "../connected-providers-cache"
import bundledModelCapabilitiesSnapshotJson from "../../generated/model-capabilities.generated.json"

let cachedRuntimeSnapshot: ReturnType<typeof getBundledModelCapabilitiesSnapshot> | undefined
export function getBundledModelCapabilitiesSnapshotForRuntime() {
	cachedRuntimeSnapshot ??= getBundledModelCapabilitiesSnapshot(bundledModelCapabilitiesSnapshotJson)
	return cachedRuntimeSnapshot
}

export function getBundledModelCapabilitiesSnapshotForShared(): ReturnType<typeof getBundledModelCapabilitiesSnapshotForRuntime> {
	return getBundledModelCapabilitiesSnapshotForRuntime()
}

export { getBundledModelCapabilitiesSnapshotForShared as getBundledModelCapabilitiesSnapshot }

export function getModelCapabilities(input: GetModelCapabilitiesInput): ModelCapabilities {
  return getModelCapabilitiesFromCore({
    ...input,
    bundledSnapshot: input.bundledSnapshot ?? getBundledModelCapabilitiesSnapshotForRuntime(),
    providerCache: input.providerCache ?? connectedProvidersCache,
  })
}
export type {
  GetModelCapabilitiesInput,
  ModelCapabilities,
  ModelCapabilitiesDiagnostics,
  ModelCapabilitiesSnapshot,
  ModelCapabilitiesSnapshotEntry,
} from "@oh-my-opencode/model-core"
