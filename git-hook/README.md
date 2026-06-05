# Recalld Git Hook

Recalld is a developer tool that automatically manages your AI coding context. This package installs a git `post-commit` hook that extracts your latest git commit diff, summarizes the change using Gemini 2.5 Flash, and keeps a `.context.md` file in your repository root up to date. This ensures your AI pair programmer (Cursor, Claude Code, etc.) always knows exactly where you left off.

## Installation

Initialize Recalld in your git repository:

```bash
npx recalld init
```

## Requirements

- **Node.js**: Version 18.0.0 or higher
- **Git**: A git repository initialized in your project folder
- **API Key**: Set the `RECALLD_API_KEY` environment variable with your Gemini API key.

## Setting Up Your API Key

You can export the API key directly in your terminal profile or a local environment file:

```bash
export RECALLD_API_KEY=your-gemini-api-key
```

Or you can create a global Recalld config file at `~/.recalld/config.json`:

```json
{
  "RECALLD_API_KEY": "your-gemini-api-key"
}
```

## Context File Schema

The generated `.context.md` file will follow this structured layout:

```markdown
## Project: [project-name]
Stack: Next.js 14, Supabase, Stripe, Tailwind

## Current Focus
Implementing the waiting list sign-up and validation on the landing page.

## Active Problems
- Stripe webhooks failing signature verification on local dev server.

## Recent Decisions
- Swapped default resend waitlist handler to a local json database configuration for now.

## Last Commit Summary
Added email POST submission validation.
```

## Uninstallation

To remove the post-commit hook and context tracking from your repository, run:

```bash
rm .git/hooks/post-commit
rm .context.md
```
