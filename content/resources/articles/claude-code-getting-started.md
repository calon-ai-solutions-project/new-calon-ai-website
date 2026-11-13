---
title: Getting Started with Claude Code: Install, First Task and Best Practices
seoTitle: Claude Code Tutorial: Install & First Project (2026 Guide) | Calon AI
description: Install Claude Code on Mac, Windows or Linux, run your first task, set up CLAUDE.md and work safely with an AI coding agent. Commands from the official docs.
category: ai-development
kind: Tutorial
tags: [Claude Code, AI coding, Anthropic, Developers, Tutorial]
date: 2026-11-13
author: calon-team
trending: true
coverAlt: A terminal window running Claude Code with a plan, file edits and a passing test run
related: [how-to-use-claude, claude-errors-fixes, connect-business-apps]
takeaways:
  - Install with one command. Use curl on macOS, Linux and WSL, or irm in Windows PowerShell. Homebrew and WinGet also work.
  - Run claude inside a project folder. It asks you to log in with a Claude subscription or Anthropic Console account.
  - Add a CLAUDE.md file with your project's commands, conventions and rules. Claude Code reads it at the start of every session.
  - Work in small, reviewable steps, keep everything in git and read the diffs before you accept them.
sources:
  - Claude Code documentation: Overview | https://code.claude.com/docs/en/overview
  - Claude Code documentation: Quickstart | https://code.claude.com/docs/en/quickstart
  - Claude Code documentation: Memory and CLAUDE.md | https://code.claude.com/docs/en/memory
  - Claude Code documentation: Troubleshoot installation | https://code.claude.com/docs/en/troubleshoot-install
  - Claude plans and pricing | https://claude.com/pricing
faq:
  - q: Is Claude Code free?
    a: Claude Code needs a Claude subscription that includes it (Pro and above) or an Anthropic Console account billed for API usage. Most surfaces, including the desktop app, require a paid plan. Check claude.com/pricing for current plans.
  - q: Do I need to be a developer to use Claude Code?
    a: It helps a great deal. Claude Code edits files and runs commands in your project, so you need to understand enough to review what it changes. Non-developers can learn with it, but should work on copies of projects, in git, and never on live systems.
  - q: What does "claude command not found" mean after installing?
    a: The install directory is not on your PATH yet. Open a new terminal window first. If it still fails, follow the "Fix your PATH" steps in Anthropic's installation troubleshooting guide.
  - q: Does Claude Code work in VS Code?
    a: Yes. There is an official extension for VS Code (and Cursor) with inline diffs and plan review, and a plugin for JetBrains IDEs. Claude Code is also available in a desktop app and on the web at claude.ai/code.
---

> **Quick answer:** On macOS, Linux or WSL run `curl -fsSL https://claude.ai/install.sh | bash`. On Windows PowerShell run `irm https://claude.ai/install.ps1 | iex`. Then `cd` into your project and type `claude`. Log in when prompted, ask it to explain the codebase, and add a `CLAUDE.md` file with your project's rules.

Claude Code is Anthropic's agentic coding tool. Unlike a chat window that suggests snippets, it reads your codebase, edits files, runs commands and tests, and works with git. It runs in the terminal, as a VS Code or JetBrains extension, in the Claude desktop app and in the browser. This tutorial uses the commands from the [official documentation](https://code.claude.com/docs/en/overview) as of November 2026.

## Before you start

- **An account:** a Claude subscription that includes Claude Code, or an Anthropic Console account billed for API usage. See [claude.com/pricing](https://claude.com/pricing).
- **A project in git.** Claude Code changes files. Version control lets you review and undo everything.
- **On native Windows:** Git for Windows is recommended so Claude Code can use Bash. Without it, Claude Code uses PowerShell instead. WSL setups do not need it.

## Step 1: Install Claude Code

The native installer is recommended and updates itself in the background.

**macOS, Linux or WSL:**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell** (your prompt starts with `PS C:\`):

```powershell
irm https://claude.ai/install.ps1 | iex
```

**Windows Command Prompt:**

```batch
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

**Package managers** (these do not auto-update, so upgrade them periodically):

```bash
brew install --cask claude-code
winget install Anthropic.ClaudeCode
```

Open a **new** terminal window and check it worked:

```bash
claude --version
```

If you see "command not found" or "not recognized", the install folder is not on your PATH yet. Follow the **Fix your PATH** steps in the [installation troubleshooting guide](https://code.claude.com/docs/en/troubleshoot-install).

## Step 2: Start it in your project

```bash
cd your-project
claude
```

The first time, Claude Code asks you to log in. Follow the browser prompt to connect your Claude account. If you have set the `ANTHROPIC_API_KEY` environment variable and approve it when asked, it uses that instead.

## Step 3: Get oriented

Start by asking questions rather than making changes. It is the fastest way to see how Claude Code thinks about your project.

```text
> explain what this project does and how it is structured
> how do I run the tests and start the app locally?
> where is the code that handles user sign-up?
```

## Step 4: Give it a small, real task

Pick something contained with a clear way to check it worked:

```text
> the date on the invoice page shows in US format. change it to
  UK format (13 November 2026), add a test, and run the tests.
```

Claude Code will typically propose a plan, edit files, run commands and show you diffs. **Read the diffs.** You stay responsible for what goes into your codebase.

When you are happy:

```text
> commit these changes with a clear message
```

## Step 5: Add a CLAUDE.md file

`CLAUDE.md` is a Markdown file in your project root that Claude Code reads at the start of every session. It is the single most useful thing you can set up. Run `/init` to have Claude Code draft one from your codebase, then edit it.

A good `CLAUDE.md` is short and specific:

```markdown
# Project notes for Claude

## Commands
- Install: npm install
- Test: npm test
- Lint: npm run lint (must pass before committing)

## Conventions
- TypeScript strict mode. No `any`.
- UK English in all user-facing text.
- Dates are stored in UTC, displayed in Europe/London.

## Rules
- Never edit files in /migrations by hand.
- Ask before adding a new dependency.
```

If your repository already has an `AGENTS.md` for other coding agents, Claude Code can read that instead.

## Useful commands to know

| Command | What it does |
|---|---|
| `/init` | Drafts a CLAUDE.md for your project |
| `/help` | Lists available commands |
| `claude -p "..."` | Runs a one-off request without the interactive session, useful in scripts and CI |
| `/schedule` | Sets up a scheduled task that runs in the cloud |
| `claude --version` | Shows the installed version |

## Best practices from real projects

1. **Small steps beat big asks.** "Build the whole billing system" produces a large change that is hard to review. Break work into tasks you can check in a few minutes.
2. **Give it a way to verify.** Tests, a linter, a type checker or a script that reproduces the bug let Claude Code check its own work.
3. **Ask for a plan first** on anything non-trivial, and correct the plan before any code is written.
4. **Keep secrets out.** Never paste production credentials into a session. Use environment variables and keep `.env` files out of git.
5. **Review like a pull request from a colleague.** Fast, capable and occasionally confidently wrong.
6. **Put recurring guidance in CLAUDE.md**, not in every prompt.

## Going further

- **IDE extensions:** inline diffs and plan review in VS Code, Cursor and JetBrains.
- **MCP (Model Context Protocol):** connect Claude Code to tools such as issue trackers, design docs and databases.
- **Subagents and parallel sessions:** split larger work across several agents.
- **GitHub Actions and GitLab CI/CD:** automate code review and issue triage.

## When to bring in help

Claude Code makes experienced developers dramatically faster, and it is a great way to learn. For business-critical systems, such as anything handling customer data, payments or compliance, you still need sound architecture, security review and someone accountable when it breaks. Calon AI builds operational software and AI systems for UK businesses using these tools every day. See [the 7-screen MVP we delivered in three weeks](/work/smart-security-mvp), or [talk to our engineers](/contact).
