import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShieldCheck, Target, Eye, Lock, Award, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "About CarbonZ | Transparency & Integrity in Carbon Projects",
  description: "Learn about the mission, governance, and technology behind the CarbonZ platform.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <Breadcrumbs items={[{ label: "About CarbonZ" }]} />

      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
          Our Mission & Governance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          About CarbonZ
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          CarbonZ was founded to address the critical trust deficit in global voluntary and compliance carbon markets. By combining transparent mathematical scoring, immutable audit event traceability, and independent verification, we enable genuine climate projects to stand out.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-navy-950">100% Transparency</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every score calculation formula is open source and version-controlled. We publish the exact weighted breakdown (0.30D + 0.25V + 0.20E + 0.15H + 0.10T) without hidden pay-to-win proprietary models.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-navy-950">Evidence-Based Integrity</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Claims are verified against physical ecological data: Sentinel/Landsat remote sensing, soil core laboratory spectrometry, and notarized land registry deeds.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-navy-100 text-navy-800 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-navy-950">The Carbon Passport</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Continuous project traceability through milestone events ensures projects cannot silently deviate from their approved methodologies over 20-30 year lifespans.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-navy-950">Conflict of Interest Prevention</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Developers are barred from verifying or approving their own projects. Database-enforced Row Level Security (RLS) ensures non-negotiable separation of duties.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs text-slate-600 leading-relaxed">
        <h3 className="font-bold text-slate-900 text-sm">Regulatory Notice</h3>
        <p>
          CarbonZ is an independent transparency platform. A high CarbonZ Trust Score does not constitute financial investment advice, security rating, or a legal guarantee of additionality. Third-party registry standards (such as Verra, Gold Standard, and Puro.earth) operate independently.
        </p>
      </div>
    </div>
  );
}
