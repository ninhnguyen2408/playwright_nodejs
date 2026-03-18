const path = require('path');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

async function main() {
  const serverPath = path.join(__dirname, 'server.js');
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
    cwd: path.resolve(__dirname, '..'),
    stderr: 'pipe',
  });

  if (transport.stderr) {
    transport.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      if (text.trim()) {
        process.stderr.write(text);
      }
    });
  }

  const client = new Client(
    {
      name: 'local-smoke-test',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);

  const tools = await client.listTools();
  const resources = await client.listResources();

  console.log('Initialize OK:', client.getServerVersion()?.name);
  console.log('Tool count:', tools.tools.length);
  console.log('Resource count:', resources.resources.length);

  await client.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
