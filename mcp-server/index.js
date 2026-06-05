import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';

// Create server instance
const server = new Server(
  {
    name: 'recalld-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

// Find .context.md recursively upwards from cwd
function findContextFile(startDir) {
  let currentDir = startDir;
  while (true) {
    const contextPath = path.join(currentDir, '.context.md');
    if (fs.existsSync(contextPath)) {
      return contextPath;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break; // reached root
    }
    currentDir = parentDir;
  }
  return null;
}

// List resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const contextPath = findContextFile(process.cwd());
  if (!contextPath) return { resources: [] };
  
  return {
    resources: [
      {
        uri: 'recalld://context',
        name: 'Recalld AI Context',
        description: 'Auto-updated developer context from git commits',
        mimeType: 'text/markdown',
      }
    ]
  };
});

// Read resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri !== 'recalld://context') {
    throw new Error(`Unknown resource URI: ${request.params.uri}`);
  }

  const contextPath = findContextFile(process.cwd());
  if (!contextPath) {
    throw new Error('.context.md not found in the current workspace.');
  }

  const content = fs.readFileSync(contextPath, 'utf-8');
  return {
    contents: [
      {
        uri: request.params.uri,
        mimeType: 'text/markdown',
        text: content,
      }
    ]
  };
});

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_recalld_context',
        description: 'Get the content of the Recalld AI context file (.context.md)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'update_recalld_focus',
        description: 'Update the active focus and problems list in the context file',
        inputSchema: {
          type: 'object',
          properties: {
            focus: {
              type: 'string',
              description: '1-2 sentences summarizing what the developer is actively building right now',
            },
            problems: {
              type: 'array',
              items: { type: 'string' },
              description: 'Bullet list of active bugs or blockers (max 4)',
            },
          },
          required: ['focus'],
        },
      },
    ],
  };
});

// Call tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const contextPath = findContextFile(process.cwd());

  if (!contextPath) {
    throw new Error('.context.md not found in the current workspace.');
  }

  if (name === 'get_recalld_context') {
    const content = fs.readFileSync(contextPath, 'utf-8');
    return {
      content: [
        {
          type: 'text',
          text: content,
        },
      ],
    };
  }

  if (name === 'update_recalld_focus') {
    let content = fs.readFileSync(contextPath, 'utf-8');
    const { focus, problems } = args;

    // Replace "## Current Focus" section
    const focusRegex = /(## Current Focus\n)([\s\S]*?)(?=\n##|$)/;
    content = content.replace(focusRegex, `$1${focus}\n\n`);

    if (problems) {
      const problemList = problems.map(p => `- ${p}`).join('\n');
      const problemsRegex = /(## Active Problems\n)([\s\S]*?)(?=\n##|$)/;
      content = content.replace(problemsRegex, `$1${problemList}\n\n`);
    }

    fs.writeFileSync(contextPath, content, 'utf-8');

    return {
      content: [
        {
          type: 'text',
          text: `Successfully updated .context.md with new focus:\n"${focus}"`,
        },
      ],
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

// List prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'initialize_recalld',
        description: 'Initialize a chat session using the Recalld context',
      },
    ],
  };
});

// Get prompt
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== 'initialize_recalld') {
    throw new Error(`Prompt not found: ${request.params.name}`);
  }

  const contextPath = findContextFile(process.cwd());
  let contextContent = 'No context file found.';
  if (contextPath) {
    contextContent = fs.readFileSync(contextPath, 'utf-8');
  }

  return {
    description: 'Initializes a session with the developer\'s git commit context.',
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Please read our project context and match your assistance accordingly:\n\n${contextContent}`,
        },
      },
    ],
  };
});

// Run server using Stdio transport
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Recalld MCP Server running on stdio');
}

run().catch(console.error);
