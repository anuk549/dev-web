/**
 * CompilationOverlay Component
 * Displays a compilation animation while generating the quote
 */

interface CompilationOverlayProps {
  visible: boolean;
  logs: string[];
  progress: number;
}

export function CompilationOverlay({ visible, logs, progress }: CompilationOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-slate-950 p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            Dev+ quote builder
          </span>
        </div>
        <div className="min-h-40 space-y-3 font-mono text-sm text-slate-300">
          {logs.map((log) => (
            <p key={log} className="leading-relaxed">
              <span className="text-teal-300">$</span> {log}
            </p>
          ))}
          <span className="terminal-cursor text-teal-300" />
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            <span>Building request</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-300 via-sky-400 to-amber-300 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}