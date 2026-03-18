const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const z = require('zod/v4');

const ROOT_DIR = path.resolve(__dirname, '..');
const SERVER_INFO = {
  name: 'playwright-repo-mcp',
  version: '1.1.0',
};

const RESOURCE_FILE_MAP = {
  'project://package.json': 'package.json',
  'project://playwright.config.js': 'playwright.config.js',
  'project://readme': 'README.md',
  'project://env-example': '.env.example',
};

const ALLOWED_PREFIXES = ['tests/', 'pages/', 'utils/', 'fixtures/'];
const ALLOWED_FILES = new Set([
  'package.json',
  'playwright.config.js',
  'README.md',
  '.env.example',
]);

function normalizeRelativePath(relativePath) {
  if (typeof relativePath !== 'string' || !relativePath.trim()) {
    throw new Error('Path must be a non-empty string.');
  }

  const normalized = relativePath.replace(/\\/g, '/').replace(/^\.?\//, '');

  if (normalized === '.env' || normalized.startsWith('.git/') || normalized.startsWith('node_modules/')) {
    throw new Error('Access to that path is not allowed.');
  }

  const hasAllowedPrefix = ALLOWED_PREFIXES.some((prefix) => normalized.startsWith(prefix));
  if (!hasAllowedPrefix && !ALLOWED_FILES.has(normalized)) {
    throw new Error('Path is outside the allowed project scope.');
  }

  const absolutePath = path.resolve(ROOT_DIR, normalized);
  const relativeFromRoot = path.relative(ROOT_DIR, absolutePath);

  if (relativeFromRoot.startsWith('..') || path.isAbsolute(relativeFromRoot)) {
    throw new Error('Path escapes the repository root.');
  }

  return { normalized, absolutePath };
}

function listSpecFiles() {
  const testsDir = path.join(ROOT_DIR, 'tests');
  if (!fs.existsSync(testsDir)) {
    return [];
  }

  return fs
    .readdirSync(testsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.spec.js'))
    .map((entry) => `tests/${entry.name}`)
    .sort();
}

function makeTextContent(text) {
  return [
    {
      type: 'text',
      text,
    },
  ];
}

async function runPlaywrightSpec(specPath, timeoutMs) {
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const args = ['playwright', 'test', specPath];

  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: ROOT_DIR,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';
    let finished = false;

    const timer = setTimeout(() => {
      if (!finished) {
        child.kill();
      }
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      clearTimeout(timer);
      finished = true;
      resolve({
        command: `npx playwright test ${specPath}`,
        exitCode: 1,
        stdout,
        stderr: `${stderr}\n${error.message}`.trim(),
      });
    });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      finished = true;
      resolve({
        command: `npx playwright test ${specPath}`,
        exitCode: signal ? 1 : code || 0,
        stdout,
        stderr: signal ? `${stderr}\nProcess terminated by signal ${signal}`.trim() : stderr,
      });
    });
  });
}

function createServer() {
  const server = new McpServer(SERVER_INFO);

  server.registerTool(
    'list_tests',
    {
      title: 'List Tests',
      description: 'List Playwright spec files available in the tests directory.',
      annotations: {
        readOnlyHint: true,
      },
      outputSchema: {
        count: z.number(),
        files: z.array(z.string()),
      },
    },
    async () => {
      const files = listSpecFiles();
      const structuredContent = {
        count: files.length,
        files,
      };

      return {
        content: makeTextContent(
          files.length
            ? `Found ${files.length} Playwright spec file(s):\n${files.join('\n')}`
            : 'No Playwright spec files were found in tests/.'
        ),
        structuredContent,
      };
    }
  );

  server.registerTool(
    'read_project_file',
    {
      title: 'Read Project File',
      description: 'Read an allowed repository file such as a spec, page object, config, or README.',
      annotations: {
        readOnlyHint: true,
      },
      inputSchema: {
        path: z.string().describe('Relative path inside the repository.'),
      },
      outputSchema: {
        path: z.string(),
        text: z.string(),
      },
    },
    async ({ path: requestedPath }) => {
      const { normalized, absolutePath } = normalizeRelativePath(requestedPath);
      const text = fs.readFileSync(absolutePath, 'utf8');
      const structuredContent = {
        path: normalized,
        text,
      };

      return {
        content: makeTextContent(`FILE: ${normalized}\n\n${text}`),
        structuredContent,
      };
    }
  );

  server.registerTool(
    'run_playwright_test',
    {
      title: 'Run Playwright Test',
      description: 'Run a single Playwright spec file from the tests directory.',
      inputSchema: {
        path: z.string().describe('Relative path to a .spec.js file inside tests/.'),
        timeoutMs: z.number().int().min(1000).max(600000).optional().describe('Optional timeout in milliseconds.'),
      },
      outputSchema: {
        command: z.string(),
        exitCode: z.number(),
        stdout: z.string(),
        stderr: z.string(),
      },
    },
    async ({ path: requestedPath, timeoutMs }) => {
      const { normalized, absolutePath } = normalizeRelativePath(requestedPath);
      if (!normalized.startsWith('tests/') || !normalized.endsWith('.spec.js')) {
        throw new Error('Only files inside tests/ ending with .spec.js can be executed.');
      }

      if (!fs.existsSync(absolutePath)) {
        throw new Error('Requested spec file does not exist.');
      }

      const result = await runPlaywrightSpec(normalized, timeoutMs ?? 120000);
      const output = [
        `Command: ${result.command}`,
        `Exit code: ${result.exitCode}`,
        '',
        'STDOUT:',
        result.stdout || '(empty)',
        '',
        'STDERR:',
        result.stderr || '(empty)',
      ].join('\n');

      return {
        content: makeTextContent(output),
        structuredContent: result,
      };
    }
  );

  for (const [uri, relativePath] of Object.entries(RESOURCE_FILE_MAP)) {
    const mimeType = relativePath.endsWith('.json') ? 'application/json' : 'text/plain';
    const resourceName = relativePath.replace(/[^\w.-]+/g, '_');

    server.registerResource(
      resourceName,
      uri,
      {
        description: `Project file ${relativePath}`,
        mimeType,
      },
      async () => {
        const text = fs.readFileSync(path.join(ROOT_DIR, relativePath), 'utf8');
        return {
          contents: [
            {
              uri,
              mimeType,
              text,
            },
          ],
        };
      }
    );
  }

  return server;
}

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('MCP server failed to start:', error);
  process.exit(1);
});
