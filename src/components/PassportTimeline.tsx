import { PassportEventRow } from "@/types/project";
import { CheckCircle2, Clock, FileText, AlertCircle, Award, Flag, ArrowUpRight } from "lucide-react";

interface PassportTimelineProps {
  events: PassportEventRow[] | undefined;
  className?: string;
}

export function PassportTimeline({ events = [], className = "" }: PassportTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className={`p-8 rounded-xl border border-dashed border-slate-300 text-center bg-slate-50 ${className}`}>
        <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-700">No Passport Events Recorded</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Traceability milestones will appear here as the project progresses through verification stages.
        </p>
      </div>
    );
  }

  // Sort events chronologically (oldest to newest for timeline progression)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const getEventIcon = (type: string) => {
    switch (type) {
      case "verification":
        return <Award className="w-4 h-4 text-emerald-600" />;
      case "submission":
      case "resubmission":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "review_started":
        return <Clock className="w-4 h-4 text-teal-600" />;
      case "changes_requested":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case "rejection":
        return <Flag className="w-4 h-4 text-rose-600" />;
      case "creation":
      default:
        return <CheckCircle2 className="w-4 h-4 text-slate-500" />;
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case "verification":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "submission":
      case "resubmission":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "review_started":
        return "bg-teal-50 text-teal-800 border-teal-200";
      case "changes_requested":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "rejection":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Vertical line running down */}
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />

      <div className="space-y-6">
        {sortedEvents.map((evt, idx) => {
          const dateStr = new Date(evt.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          const meta = typeof evt.metadata === "object" && evt.metadata !== null ? evt.metadata : {};

          return (
            <div key={evt.id || idx} className="relative flex items-start space-x-4">
              {/* Event Icon Node */}
              <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-sm shrink-0">
                {getEventIcon(evt.event_type)}
              </div>

              {/* Event Content Card */}
              <div className="flex-1 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getEventBadge(
                      evt.event_type
                    )}`}
                  >
                    {evt.event_type.replace("_", " ")}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{dateStr}</span>
                </div>

                <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                  {evt.public_description}
                </p>

                {/* Safe disclosed public metadata */}
                {Object.keys(meta).length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-500">
                    {Object.entries(meta).map(([k, v]) => (
                      <span
                        key={k}
                        className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-mono"
                      >
                        <strong className="text-slate-600">{k}:</strong> {String(v)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

