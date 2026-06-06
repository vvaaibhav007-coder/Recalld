(async () => {
  try {
    const { execSync } = require('child_process');
    const { readContext, writeContext } = require('./context');
    const { summarize } = require('./summarize');

    let diff = '';
    try {
      diff = execSync('git diff HEAD~1 HEAD', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    } catch (e) {
      try {
        diff = execSync('git show HEAD', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
      } catch (e2) {
        // Fallback to empty if everything fails
      }
    }

    if (!diff) {
      return;
    }

    if (diff.length > 8000) {
      diff = diff.slice(0, 8000) + '\n[diff truncated for context]';
    }

    const existingContext = readContext();
    const summary = await summarize(diff, existingContext);
    writeContext(summary);

    console.log('  recalld synced context');
  } catch (e) {
    process.exit(0); // silent fail, never interrupt git
  }
})();

