const fs = require('fs');
const path = require('path');

function getContextPath() {
  return path.join(process.cwd(), '.context.md');
}

function readContext() {
  const p = getContextPath();
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf-8');
}

function writeContext(content) {
  fs.writeFileSync(getContextPath(), content, 'utf-8');
}

function generateInitialContext(projectName, stack) {
  return `## Project: ${projectName}
Stack: ${stack}

## Current Focus
Project just initialized with Recalld. Commit some code to build context.

## Active Problems
None yet.

## Recent Decisions
None yet.

## Last Commit Summary
Initial Recalld setup.
`;
}

module.exports = { readContext, writeContext, generateInitialContext };
