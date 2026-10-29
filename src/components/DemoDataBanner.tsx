import { AlertTriangle, Info } from "lucide-react";

export function DemoDataBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-amber-900 gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong className="font-semibold uppercase tracking-wider">Demonstration Mode:</strong> You are currently exploring illustrative demonstration projects and simulated audit records. Real-world verification claims require active Supabase database connectivity.
          </span>
        </div>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-mono font-medium border border-amber-300 shrink-0">
          DEMO DATA
        </span>
      </div>
    </div>
  );
}
