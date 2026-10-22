# Expertise fork of oh-my-openagent (OmO): the `expertise-main` branch

This file is about our fork only. It is not part of upstream oh-my-openagent.

## What `expertise-main` is

`expertise-main` is the official branch of our fork. It plays the same role for us that `dev` plays for upstream (`code-yeongyu/oh-my-openagent`).

- It holds upstream omO plus every change we made on top of it.
- It is the only branch that downstream sessions load.
- It is the only branch that other work is merged into.

The branch is named after its role, not after what it contains. Its content changes with time. Its role does not.

## Remotes

| Remote | URL | Use |
|---|---|---|
| `origin` | `https://github.com/code-yeongyu/oh-my-openagent.git` | Upstream. We only fetch from it. |
| `expertise` | `https://github.com/expertisesolutions/oh-my-openagent.git` | Our fork. We push here. |

`dev` in our fork is a stale mirror of upstream `dev` at the fork point. It is frozen and far behind. Never commit to it and never build from it.

This fork is public. Do not commit host names, IP addresses, credentials, or any private data. Keep deploy details for our own hosts in the private repositories that hold them.

## Rules

1. Every change to OmO that we run ends up in `expertise-main`. A change that is not in `expertise-main` is not part of our OmO.
2. Start new work from `expertise-main`. Use a short-lived branch (for example `fix/goal-nudge`).
3. When the work is done and tested, merge the branch into `expertise-main` and push it to `expertise`.
4. Do not run a session against a feature branch. Downstream loads this repository directly from a local checkout registered as a plugin path. That checkout must stay on `expertise-main`. Switching it to a feature branch changes what every session runs.
5. Do not rewrite the history of `expertise-main` (no force push, no rebase of published commits).
6. OmO ships prebuilt bundles (the codex installer, the senpi plugin bundles). When a change alters bundled artifacts, rebuild the bundles in the same change. Upstream makes QA mandatory for harness-connected components. Treat it the same way.
7. Keep our patches small and separate from upstream code where you can.

## Normal workflow

```sh
git fetch expertise
git switch -c fix/my-change expertise/expertise-main
# work, commit, test, rebuild bundles if touched
git switch expertise-main
git pull --ff-only expertise expertise-main
git merge --no-ff fix/my-change
git push expertise expertise-main
```

## Taking in upstream changes

We follow upstream on purpose, not automatically.

```sh
git fetch origin
git switch -c sync/upstream-<date> expertise-main
git merge origin/dev
# resolve conflicts, rebuild bundles, run QA
git switch expertise-main
git merge --no-ff sync/upstream-<date>
git push expertise expertise-main
```

Merge upstream into our branch. Do not rebase our branch onto upstream.

Upstream moves very fast. The areas we touch are goal continuation, background task cleanup, model fallback, and routing category fallback, plus the rebuilt plugin bundles. Expect conflicts there.

## Where we started

`expertise-main` was created on 2026-10-22 from the branch `fix/model-fallback-connection-refused` (commit `b3762b3e7b`), at the tip of upstream `dev` (`2dd4002e9d`, the v5.0.0-beta.80 source state) plus these six commits:

- `2d64774639` fix(routing): forbid undeclared cross-provider category fallback
- `3aed769ef2` fix(model-fallback): treat connection-refused as retryable
- `f5c2a67696` fix(goal): do not abort chat.message when objective is invalid
- `40c01356f3` fix: extend background task cleanup delay
- `88211a798c` fix(goal): throttle idle continuation nudges per session
- `b3762b3e7b` chore: rebuild codex installer and senpi plugin bundles

The older branch name is kept so old references still work. Do not add new work to it.

## Not included

- `fix/tui-sidebar-roster-snapshot-memo` (`597221b644`): a fix for an idle busy-loop in the roster poll. It is pushed to the fork but not merged and not running.
- `qwen-router-rollout`: superseded. Its routing fix is already in the official line as `2d64774639`.
