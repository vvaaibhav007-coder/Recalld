"use client";

import React, { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleScrollToWaitlist = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById("waitlist");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary selection:bg-accent-green/20 selection:text-accent-green antialiased">
      {/* SECTION 1 — Navbar */}
      <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-bg-border/60">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display font-bold text-xl tracking-tight text-text-primary hover:text-accent-green transition-colors cursor-pointer select-none">
            RECALLD
          </span>
          <button
            onClick={handleScrollToWaitlist}
            className="font-display font-semibold text-xs tracking-wider uppercase bg-accent-green text-bg-primary px-5 py-2.5 rounded-[6px] hover:bg-accent-green-dim active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Join Waitlist
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {/* SECTION 2 — Hero */}
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center overflow-hidden border-b border-bg-border/40 py-20">
          {/* Ambient Background Grid Image */}
          <div className="absolute inset-0 bg-[url('/hero_bg.png')] bg-cover bg-center opacity-[0.12] mix-blend-screen pointer-events-none"></div>
          {/* Fading Mask */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/70 to-bg-primary pointer-events-none"></div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl tracking-tighter leading-[1.1] max-w-4xl mx-auto mb-6 text-wrap-balance">
              Your AI remembers what you built last night.
            </h1>
            <p className="font-body text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-wrap-pretty">
              Recalld auto-captures your project context on every git commit. Open Cursor tomorrow — AI already knows your stack, your decisions, and what broke.
            </p>
            <div className="mb-4">
              <button
                onClick={handleScrollToWaitlist}
                className="font-display font-semibold text-sm tracking-wider uppercase bg-accent-green text-bg-primary px-8 py-4 rounded-[6px] hover:bg-accent-green-dim active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-accent-green/10"
              >
                Join the Waitlist
              </button>
            </div>
            <p className="font-body text-xs text-text-muted mb-16">
              No credit card. Just your email.
            </p>

            {/* Terminal Snippet */}
            <div className="max-w-xl mx-auto bg-code-bg/90 backdrop-blur border border-bg-border rounded-[6px] p-6 text-left shadow-2xl relative group hover:border-accent-green/30 transition-all duration-300">
              <div className="absolute top-3 right-4 flex space-x-1.5 opacity-60">
                <span className="w-2.5 h-2.5 rounded-full bg-bg-border"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-bg-border"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-bg-border"></span>
              </div>
              <pre className="font-mono text-sm leading-relaxed text-text-primary overflow-x-auto whitespace-pre">
                <span className="text-text-muted">$</span> git commit -m "added auth flow"{"\n"}
                <span className="text-accent-green">  ✓</span> recalld synced context  [12ms]{"\n"}
                <span className="text-accent-green">  ✓</span> .context.md updated
              </pre>
            </div>
          </div>
        </section>

        {/* SECTION 3 — How It Works (Bento Grid) */}
        <section className="border-t border-bg-border/40 bg-bg-primary relative py-28">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-display font-bold text-3xl mb-12 text-text-primary tracking-tight">
              How Recalld works
            </h2>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1 - You commit code (Col-span 2 on desktop) */}
              <div className="md:col-span-2 bg-bg-surface border border-bg-border rounded-[6px] p-8 flex flex-col justify-between hover:border-accent-green/20 hover:scale-[1.005] hover:shadow-xl transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-xs tracking-widest text-accent-green bg-accent-green-glow px-2.5 py-0.5 rounded border border-accent-green/20">
                    STEP 01
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                  <div className="md:col-span-3">
                    <h3 className="font-display font-bold text-xl mb-3 text-text-primary">
                      You commit code
                    </h3>
                    <p className="font-body text-text-secondary text-sm leading-relaxed">
                      Run git commit like you always have. Recalld's hook fires automatically in the background.
                    </p>
                  </div>
                  {/* Visual element */}
                  <div className="md:col-span-2 bg-code-bg/60 border border-bg-border/60 rounded p-4 font-mono text-[11px] text-text-muted leading-tight overflow-x-auto select-none group-hover:border-accent-green/10 transition-colors">
                    $ git add .{"\n"}
                    $ git commit -m "feat: init schema"
                  </div>
                </div>
              </div>

              {/* Card 2 - Context is captured (Col-span 1) */}
              <div className="bg-bg-surface border border-bg-border rounded-[6px] p-8 flex flex-col justify-between hover:border-accent-green/20 hover:scale-[1.005] hover:shadow-xl transition-all duration-300 group">
                <div className="flex justify-between items-start mb-8">
                  <span className="font-mono text-xs tracking-widest text-accent-green bg-accent-green-glow px-2.5 py-0.5 rounded border border-accent-green/20">
                    STEP 02
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl mb-3 text-text-primary">
                    Context is captured
                  </h3>
                  <p className="font-body text-text-secondary text-sm leading-relaxed">
                    The diff is summarized by AI and written to .context.md in your project root. Takes under 5 seconds.
                  </p>
                </div>
              </div>

              {/* Card 3 - AI starts informed (Col-span 3 on desktop) */}
              <div className="md:col-span-3 bg-bg-surface border border-bg-border rounded-[6px] p-8 flex flex-col justify-between hover:border-accent-green/20 hover:scale-[1.005] hover:shadow-xl transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-xs tracking-widest text-accent-green bg-accent-green-glow px-2.5 py-0.5 rounded border border-accent-green/20">
                    STEP 03
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                  <div className="md:col-span-3">
                    <h3 className="font-display font-bold text-xl mb-3 text-text-primary">
                      AI starts informed
                    </h3>
                    <p className="font-body text-text-secondary text-sm leading-relaxed">
                      Next time you open Cursor or Claude Code, the MCP server injects your full context automatically. No re-explaining.
                    </p>
                  </div>
                  {/* Visual MCP Settings Mockup */}
                  <div className="md:col-span-2 bg-code-bg/60 border border-bg-border/60 rounded p-4 font-mono text-[11px] text-text-muted leading-tight overflow-x-auto select-none group-hover:border-accent-green/10 transition-colors">
                    <span className="text-accent-green">recalld://context</span> loaded{"\n"}
                    injecting workspace logs...
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 4 — vs Relay Comparison */}
        <section className="border-t border-bg-border/40 bg-bg-primary py-28">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-display font-bold text-3xl mb-3 text-text-primary tracking-tight">
              Why not Relay?
            </h2>
            <p className="font-body text-text-secondary text-base mb-12 max-w-2xl leading-relaxed text-wrap-pretty">
              Relay ships a Chrome extension that saves what you tell it to. Recalld saves what you actually did.
            </p>

            <div className="overflow-x-auto border border-bg-border rounded-[6px] bg-bg-surface/50 backdrop-blur-sm">
              <table className="w-full text-left border-collapse table-fixed min-w-[640px]">
                <thead>
                  <tr className="border-b border-bg-border bg-bg-surface/90 text-sm">
                    <th className="py-5 px-6 font-display font-semibold text-text-muted w-1/3"></th>
                    <th className="py-5 px-6 font-display font-semibold text-text-secondary w-1/3 border-r border-bg-border">Relay</th>
                    <th className="py-5 px-6 font-display font-semibold text-accent-green bg-accent-green-glow w-1/3">Recalld</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-border text-sm font-body">
                  <tr className="hover:bg-bg-elevated/40 transition-colors">
                    <td className="py-5 px-6 font-display font-medium text-text-primary">How context is saved</td>
                    <td className="py-5 px-6 text-text-secondary border-r border-bg-border">You manually save it</td>
                    <td className="py-5 px-6 text-text-primary bg-accent-green-glow/30 border-l-2 border-accent-green">Auto-saves on every commit</td>
                  </tr>
                  <tr className="hover:bg-bg-elevated/40 transition-colors">
                    <td className="py-5 px-6 font-display font-medium text-text-primary">What it knows</td>
                    <td className="py-5 px-6 text-text-secondary border-r border-bg-border">What you typed</td>
                    <td className="py-5 px-6 text-text-primary bg-accent-green-glow/30 border-l-2 border-accent-green">What you built</td>
                  </tr>
                  <tr className="hover:bg-bg-elevated/40 transition-colors">
                    <td className="py-5 px-6 font-display font-medium text-text-primary">Install</td>
                    <td className="py-5 px-6 text-text-secondary border-r border-bg-border">Chrome extension</td>
                    <td className="py-5 px-6 text-text-primary bg-accent-green-glow/30 border-l-2 border-accent-green"><code className="font-mono text-xs text-accent-green">npx recalld init</code></td>
                  </tr>
                  <tr className="hover:bg-bg-elevated/40 transition-colors">
                    <td className="py-5 px-6 font-display font-medium text-text-primary">IDE depth</td>
                    <td className="py-5 px-6 text-text-secondary border-r border-bg-border">Shallow text injection</td>
                    <td className="py-5 px-6 text-text-primary bg-accent-green-glow/30 border-l-2 border-accent-green">Git-aware, branch-aware</td>
                  </tr>
                  <tr className="hover:bg-bg-elevated/40 transition-colors">
                    <td className="py-5 px-6 font-display font-medium text-text-primary">Works offline</td>
                    <td className="py-5 px-6 text-text-secondary border-r border-bg-border">No</td>
                    <td className="py-5 px-6 text-text-primary bg-accent-green-glow/30 border-l-2 border-accent-green">Yes — local file</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 5 — Waitlist (email capture) */}
        <section id="waitlist" className="border-t border-bg-border/40 bg-bg-surface/40 relative overflow-hidden py-32">
          {/* Bottom ambient glow */}
          <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-accent-green/5 blur-[120px] pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-display font-bold text-3xl mb-3 text-text-primary tracking-tight">
              Be first when we launch
            </h2>
            <p className="font-body text-text-secondary text-base mb-10 leading-relaxed">
              We're shipping this weekend. Drop your email and we'll send you the install command the moment it's live.
            </p>

            {status === "success" ? (
              <div className="bg-accent-green-glow border border-accent-green/20 text-accent-green font-display font-medium py-5 px-6 rounded-[6px] text-center max-w-md mx-auto">
                You're in. We'll reach out when Recalld is live. ✓
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-5">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="flex-grow font-body text-sm text-text-primary px-4 py-3.5 bg-bg-elevated border border-bg-border rounded-[6px] focus:outline-none focus:border-accent-green/80 disabled:opacity-60 placeholder:text-text-muted transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="font-display font-semibold text-xs tracking-wider uppercase bg-accent-green text-bg-primary px-7 py-3.5 rounded-[6px] hover:bg-accent-green-dim active:scale-[0.98] transition-all duration-200 disabled:opacity-60 cursor-pointer whitespace-nowrap"
                >
                  {status === "loading" ? "Submitting..." : "Notify me"}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="text-brand-red text-sm font-body mb-5">{errorMessage}</p>
            )}

            <p className="font-body text-xs text-text-muted leading-relaxed">
              No spam. One email when we launch. That's it.
            </p>
          </div>
        </section>
      </main>

      {/* SECTION 6 — Footer */}
      <footer className="border-t border-bg-border/40 bg-bg-primary">
        <div className="max-w-5xl mx-auto px-6 py-10 text-center text-xs font-body text-text-muted tracking-widest uppercase select-none">
          RECALLD &middot; Built by a solo dev &middot; 2026
        </div>
      </footer>
    </div>
  );
}
