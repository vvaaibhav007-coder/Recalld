#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { readContext, writeContext, generateInitialContext } = require('./context');

// Color helpers
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;

function main() {
  const cwd = process.cwd();

  // 1. Check if git repo
  const gitDir = path.join(cwd, '.git');
  if (!fs.existsSync(gitDir) || !fs.statSync(gitDir).isDirectory()) {
    console.error(red('❌ Not a git repo. Run this from inside your project folder.'));
    process.exit(1);
  }

  // 2. Check if Node 18+
  const nodeVersion = process.versions.node;
  const majorVersion = parseInt(nodeVersion.split('.')[0], 10);
  if (majorVersion < 18) {
    console.error(red(`❌ Node.js 18+ is required. Current version is ${nodeVersion}.`));
    process.exit(1);
  }

  // 3. Write post-commit hook
  const gitHooksDir = path.join(gitDir, 'hooks');
  if (!fs.existsSync(gitHooksDir)) {
    fs.mkdirSync(gitHooksDir, { recursive: true });
  }

  const hookPath = path.join(gitHooksDir, 'post-commit');
  // Use absolute path to the installed hook.js using __dirname
  const hookJsPath = path.join(__dirname, 'hook.js').replace(/\\/g, '/');
  
  const hookContent = `#!/bin/sh
node "${hookJsPath}"
`;

  fs.writeFileSync(hookPath, hookContent, { encoding: 'utf-8', mode: 0o755 });

  // 4. chmod +x
  try {
    fs.chmodSync(hookPath, '755');
  } catch (err) {
    // Ignore permission error
  }
  try {
    const { execSync } = require('child_process');
    execSync(`chmod +x "${hookPath}"`, { stdio: 'ignore' });
  } catch (err) {
    // Ignore execution/permission error on Windows
  }

  // 5. Initial .context.md
  if (!readContext()) {
    const projectName = getProjectName(cwd);
    const stack = detectStack(cwd);
    const initialContent = generateInitialContext(projectName, stack);
    writeContext(initialContent);
  }

  // 6. Print instructions
  // Calculate relative or absolute path to mcp-server for convenience
  let mcpServerPath = '/path/to/mcp-server/index.js';
  // Check if we can find mcp-server in the parent or same workspace directory
  const possibleMcpPath = path.join(cwd, 'mcp-server', 'index.js');
  const parentMcpPath = path.join(cwd, '..', 'mcp-server', 'index.js');
  if (fs.existsSync(possibleMcpPath)) {
    mcpServerPath = possibleMcpPath.replace(/\\/g, '/');
  } else if (fs.existsSync(parentMcpPath)) {
    mcpServerPath = parentMcpPath.replace(/\\/g, '/');
  }

  console.log(green('✓ Recalld initialized'));
  console.log('\nEvery git commit will now auto-update your AI context.');
  console.log('\nAdd this to your Cursor MCP settings (.cursor/mcp.json):');
  console.log('─────────────────────────────────────────────');
  console.log(JSON.stringify({
    mcpServers: {
      recalld: {
        command: "node",
        args: [mcpServerPath]
      }
    }
  }, null, 2));
  console.log('─────────────────────────────────────────────');
  console.log('\nYour context file: .context.md');
  console.log('Docs: https://recalld.dev');
}

function getProjectName(cwd) {
  try {
    const pkgPath = path.join(cwd, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.name) return pkg.name;
    }
  } catch (e) {}
  return path.basename(cwd);
}

function detectStack(cwd) {
  const stack = [];
  try {
    const pkgPath = path.join(cwd, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      if (allDeps['next']) stack.push('Next.js');
      else if (allDeps['react']) stack.push('React');
      
      if (allDeps['tailwindcss']) stack.push('Tailwind CSS');
      if (allDeps['typescript']) stack.push('TypeScript');
      if (allDeps['@supabase/supabase-js']) stack.push('Supabase');
      if (allDeps['stripe']) stack.push('Stripe');
      if (allDeps['express']) stack.push('Express');
      if (allDeps['prisma']) stack.push('Prisma');
    }
  } catch (e) {}

  if (stack.length === 0) {
    stack.push('Node.js');
  }
  return stack.join(', ');
}

if (require.main === module) {
  main();
}
