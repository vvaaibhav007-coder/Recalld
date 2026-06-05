# Recalld MCP Server

This MCP (Model Context Protocol) server exposes your auto-generated git commit context (`.context.md`) directly to AI clients. It allows Cursor, Claude Desktop, and Claude Code to read your project state, understand your active tasks, and programmatically update your current focus area.

## Features

- **Resource (`recalld://context`)**: Exposes `.context.md` for read access by the AI client.
- **Tool (`get_recalld_context`)**: Fetches the structured markdown contents of `.context.md`.
- **Tool (`update_recalld_focus`)**: Allows the AI agent to update your "Current Focus" and "Active Problems" automatically when goals are achieved or blockers arise.
- **Prompt (`initialize_recalld`)**: Loads a template message to bootstrap the AI agent's session with the latest commit summaries.

## Client Configuration

### 1. Cursor
Go to **Settings > Features > MCP**, click **+ Add New MCP Server**, and fill in:
- **Name**: `recalld`
- **Type**: `command`
- **Command**: `node /absolute/path/to/recalld/mcp-server/index.js`

### 2. Claude Desktop
Add this to your Claude Desktop configuration file (typically `C:\Users\<username>\AppData\Roaming\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "recalld": {
      "command": "node",
      "args": ["/absolute/path/to/recalld/mcp-server/index.js"]
    }
  }
}
```

### 3. Claude Code
Initialize connection using the cli:
```bash
claude mcp add recalld node /absolute/path/to/recalld/mcp-server/index.js
```
