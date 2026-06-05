const fs = require('fs');
const path = require('path');
const os = require('os');

async function summarize(diff, existingContext) {
  let apiKey = process.env.RECALLD_API_KEY || process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    try {
      const configPath = path.join(os.homedir(), '.recalld', 'config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        apiKey = config.apiKey || config.RECALLD_API_KEY || config.GEMINI_API_KEY;
      }
    } catch (e) {
      // Ignore config read errors
    }
  }

  if (!apiKey) {
    throw new Error("API Key not configured. Please set RECALLD_API_KEY environment variable.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `You are a developer's AI context manager. 
Your job is to maintain a concise, accurate .context.md file for their project.

EXISTING CONTEXT (may be empty for first run):
${existingContext || 'None yet.'}

LATEST GIT DIFF:
${diff}

Update the context file based on this commit. The output must follow this exact format:

## Project: [project name]
Stack: [detected stack — be specific, e.g. "Next.js 14, Supabase, Stripe, Tailwind"]

## Current Focus
[1-2 sentences on what the developer is actively building right now]

## Active Problems
[bullet list of known bugs or blockers. Max 4. Remove resolved ones.]

## Recent Decisions
[bullet list of architectural or approach decisions made. Max 4. Keep the most recent.]

## Last Commit Summary
[1-2 sentences describing what this commit actually changed]

Rules:
- Be specific and technical. Not generic.
- Remove outdated information. This is not an append-only log.
- Keep the whole file under 300 words.
- Never include meta-commentary. Just the context.
- Output ONLY the markdown content. No preamble. No explanation.`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `API error: ${response.status}`);
  }

  const responseData = await response.json();
  if (
    responseData.candidates &&
    responseData.candidates[0] &&
    responseData.candidates[0].content &&
    responseData.candidates[0].content.parts &&
    responseData.candidates[0].content.parts[0]
  ) {
    return responseData.candidates[0].content.parts[0].text;
  }

  throw new Error("Invalid response format from Gemini API");
}

module.exports = { summarize };
