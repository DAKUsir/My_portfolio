const foundations = [
  {
    number: "01",
    title: "The portfolio",
    detail: "A clear home for projects, skills, a resume, and contact details.",
    status: "Next phase",
  },
  {
    number: "02",
    title: "The delivery system",
    detail: "Reviewed changes, automated checks, repeatable builds, and releases.",
    status: "Planned",
  },
  {
    number: "03",
    title: "The operations layer",
    detail: "Useful signals for availability, errors, security, and performance.",
    status: "Planned",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-6 sm:px-10 lg:px-12">
      <header className="flex items-center justify-between border-b border-black/10 pb-5 dark:border-white/15">
        <a className="font-mono text-sm font-semibold tracking-tight" href="#top">
          PORTFOLIO<span className="text-emerald-600">OPS</span>
        </a>
        <span className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-600 dark:border-white/15 dark:text-zinc-300">
          Phase 01 · Foundation
        </span>
      </header>

      <section
        id="top"
        className="grid flex-1 gap-12 py-16 sm:py-24 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-20"
      >
        <div>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            Personal portfolio / engineering project
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            A portfolio,
            <br />
            engineered end to end.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            A place to present meaningful work, built with the same care as the
            systems that ship and support it.
          </p>
          <a
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-emerald-200"
            href="#roadmap"
          >
            Explore the project plan <span aria-hidden="true">↓</span>
          </a>
          <div className="mt-12 flex flex-wrap gap-2" aria-label="Current stack">
            {["Next.js", "TypeScript", "Tailwind CSS"].map((tool) => (
              <span
                className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-xs text-zinc-600 dark:border-white/15 dark:text-zinc-300"
                key={tool}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-3xl bg-zinc-950 p-7 text-white dark:bg-zinc-900 sm:p-9">
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-300">
              Build status
            </p>
            <p className="mt-8 text-6xl font-semibold tracking-[-0.06em]">01</p>
            <p className="mt-1 text-sm text-zinc-400">of 10 project phases</p>
            <div
              className="mt-8 h-1.5 overflow-hidden rounded-full bg-white/15"
              role="progressbar"
              aria-label="Project phase progress"
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={1}
            >
              <div className="h-full w-[10%] rounded-full bg-emerald-400" />
            </div>
            <div className="mt-8 border-t border-white/15 pt-5">
              <p className="text-sm font-medium">Project planning and setup</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Establishing the product scope, application foundation, and
                delivery architecture.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section id="roadmap" className="border-t border-black/10 py-10 dark:border-white/15">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
              Project roadmap
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Three connected outcomes</h2>
          </div>
          <p className="font-mono text-[11px] text-zinc-500">
            Scope and architecture are documented in /docs.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {foundations.map((item) => (
            <article
              className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/15 dark:bg-white/[0.03]"
              key={item.number}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-500">{item.number}</span>
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                  {item.status}
                </span>
              </div>
              <h3 className="mt-7 text-lg font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap justify-between gap-2 border-t border-black/10 py-5 font-mono text-[11px] text-zinc-500 dark:border-white/15">
        <span>PortfolioOps · Personal Portfolio</span>
        <span>Built for clarity, shipped with care.</span>
      </footer>
    </main>
  );
}
