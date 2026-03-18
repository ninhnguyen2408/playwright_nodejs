# MCP Server

This folder contains a minimal MCP server for the Playwright repository built with the official `@modelcontextprotocol/sdk`.

## Features

- `list_tests`: list spec files in `tests/`
- `read_project_file`: read an allowed file from the repository
- `run_playwright_test`: run a single Playwright spec file from `tests/`

## Safety Rules

- `.env` is blocked
- paths outside the repository root are blocked
- `run_playwright_test` only executes `.spec.js` files inside `tests/`

## Run

```bash
npm run mcp
```

The server uses the SDK high-level `McpServer` API over `StdioServerTransport`.

## Smoke Test

```bash
npm run mcp:smoke
```

## Example MCP Resources

- `project://package.json`
- `project://playwright.config.js`
- `project://readme`
- `project://env-example`
