import { TrendingUp, TrendingDown } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <header className="mb-8">
        <div className="text-xs font-medium uppercase tracking-wider text-cyan-300">
          PostHog · last 7 days
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
          What Phantom learned this week
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          The agent reads these funnels via HogQL each morning and rewrites its
          prompt template. The diff is in{" "}
          <a href="/prompts" className="text-cyan-300 hover:text-cyan-200">
            Prompts
          </a>
          .
        </p>
      </header>

      {/* Top hooks */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">
          Hook performance (10s retention)
        </h2>
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-xs uppercase tracking-wider text-zinc-500">
                <th className="px-5 py-3 font-medium">Hook type</th>
                <th className="px-5 py-3 font-medium">Videos</th>
                <th className="px-5 py-3 font-medium">10s retention</th>
                <th className="px-5 py-3 font-medium">vs baseline</th>
                <th className="px-5 py-3 font-medium">Agent's call</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              <HookRow
                hook="“You're using X wrong”"
                count={4}
                retention="78%"
                lift="+310%"
                lifted
                verdict="promote"
              />
              <HookRow
                hook="“The truth about Y”"
                count={3}
                retention="61%"
                lift="+130%"
                lifted
                verdict="keep"
              />
              <HookRow
                hook="“I tried Z so you don't have to”"
                count={2}
                retention="42%"
                lift="+60%"
                lifted
                verdict="keep"
              />
              <HookRow
                hook="“In this video we'll cover…”"
                count={1}
                retention="18%"
                lift="-31%"
                verdict="kill"
              />
              <HookRow
                hook="“Top 5 ways to…”"
                count={2}
                retention="22%"
                lift="-22%"
                verdict="kill"
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* Thumbnail A/B */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">
          Thumbnail A/B test winners (CTR)
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { v: "A", ctr: "8.4%", win: true, style: "Close-up + arrow + bold" },
            { v: "B", ctr: "3.1%", style: "Wide shot + plain text" },
            { v: "C", ctr: "5.7%", style: "Three-panel split" },
            { v: "D", ctr: "2.2%", style: "Logo + tagline" },
          ].map((t) => (
            <div
              key={t.v}
              className={`relative rounded-xl border ${
                t.win
                  ? "border-cyan-500/40 bg-cyan-500/5"
                  : "border-zinc-800 bg-zinc-900/40"
              } p-4`}
            >
              {t.win && (
                <span className="absolute -top-2 left-3 rounded-full bg-cyan-500 px-2 py-0.5 text-[10px] font-medium text-zinc-950">
                  WINNER
                </span>
              )}
              <div className="aspect-video rounded bg-gradient-to-br from-zinc-700 to-zinc-900 mb-3" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500">
                  Variant {t.v}
                </span>
                <span
                  className={`text-sm font-medium tabular-nums ${
                    t.win ? "text-cyan-300" : "text-zinc-400"
                  }`}
                >
                  {t.ctr}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-zinc-500">{t.style}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Watch curve */}
      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">
          Audience retention curve · this morning's video
        </h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex items-end gap-1 h-32">
            {[
              100, 96, 92, 88, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 66, 64,
              62, 60, 58, 56, 54, 52, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41,
              40, 40, 39, 39, 38, 38, 37, 37,
            ].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-cyan-500/20 to-cyan-400/80"
                style={{ height: `${h}%` }}
                title={`${i * 2.25}s · ${h}%`}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
            <span>0:00</span>
            <span>0:45</span>
            <span>1:30</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-zinc-500 text-xs">Avg view duration</div>
              <div className="font-medium text-zinc-100 mt-0.5">3:42</div>
            </div>
            <div>
              <div className="text-zinc-500 text-xs">10s retention</div>
              <div className="font-medium text-cyan-300 mt-0.5">86%</div>
            </div>
            <div>
              <div className="text-zinc-500 text-xs">CTR (overall)</div>
              <div className="font-medium text-emerald-300 mt-0.5">8.4%</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HookRow({
  hook,
  count,
  retention,
  lift,
  lifted,
  verdict,
}: {
  hook: string;
  count: number;
  retention: string;
  lift: string;
  lifted?: boolean;
  verdict: "promote" | "keep" | "kill";
}) {
  const verdictStyles = {
    promote: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/20",
    keep: "bg-zinc-50/5 text-zinc-300 ring-zinc-700",
    kill: "bg-red-400/10 text-red-300 ring-red-400/20",
  };
  return (
    <tr className="hover:bg-zinc-900/40">
      <td className="px-5 py-3.5 text-zinc-200">{hook}</td>
      <td className="px-5 py-3.5 text-zinc-400 tabular-nums">{count}</td>
      <td className="px-5 py-3.5 font-medium text-zinc-100 tabular-nums">
        {retention}
      </td>
      <td className="px-5 py-3.5">
        <span
          className={`inline-flex items-center gap-1 tabular-nums ${
            lifted ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {lifted ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {lift}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ${verdictStyles[verdict]}`}
        >
          {verdict}
        </span>
      </td>
    </tr>
  );
}
