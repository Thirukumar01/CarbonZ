import Link from "next/link";
import { getProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import {
  ShieldCheck,
  Compass,
  FileCheck2,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Search,
  Scale,
  Lock,
  Sparkles,
  BarChart3,
  Award,
} from "lucide-react";

export default async function HomePage() {
  const { projects, isDemoData } = await getProjects({ page: 1, page_size: 3 });

  return (
    <div className="flex flex-col">
      {isDemoData && <DemoDataBanner />}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-forest-950 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/60 border border-forest-700/80 text-forest-300 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Introducing CarbonZ Framework v1.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Verify. Trust. Track. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-400 via-teal-300 to-accent-cyan">
              Honest Carbon Project Transparency.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminating greenwashing with transparent evidence verification, reproducible trust-score breakdowns, and full project lifecycle traceability via the Carbon Passport.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-forest-600 hover:bg-forest-500 text-white font-semibold text-sm shadow-md transition-all duration-150"
            >
              <Compass className="w-4 h-4" />
              Explore Verified Projects
            </Link>

            <Link
              href="/compare"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 backdrop-blur transition-all duration-150"
            >
              <Scale className="w-4 h-4" />
              Compare Project Metrics
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur">
              <span className="block text-2xl font-bold text-white font-mono">100%</span>
              <span className="text-xs text-slate-400 font-medium">Mathematical Formula Transparency</span>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur">
              <span className="block text-2xl font-bold text-forest-300 font-mono">5 Audit</span>
              <span className="text-xs text-slate-400 font-medium">Independent Component Weightings</span>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur">
              <span className="block text-2xl font-bold text-accent-cyan font-mono">Immutable</span>
              <span className="text-xs text-slate-400 font-medium">Carbon Passport Event Trail</span>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur">
              <span className="block text-2xl font-bold text-teal-300 font-mono">Zero</span>
              <span className="text-xs text-slate-400 font-medium">Uncorroborated Marketing Claims</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
                Audited & Published
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
                Featured Carbon Projects
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Explore real ecological evidence, methodology compliance, and calculated Trust Scores.
              </p>
            </div>

            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-800 transition-colors"
            >
              Browse All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* The 3 Core Pillars Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              The CarbonZ Advantage
            </span>
            <h2 className="text-3xl font-extrabold text-navy-950 mt-2">
              Three Pillars of Climate Integrity
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              Moving beyond speculative claims by binding carbon reductions to verifiable ecological data, rigorous third-party review, and transparent scoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Verify */}
            <div className="p-8 rounded-xl border border-slate-200 bg-slate-50 hover:bg-forest-50/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center mb-6">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">1. Verify</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every project must supply verifiable evidence—including baseline ecological studies, GIS shapefiles, remote sensing canopy telemetry, and legal land tenure title.
                </p>
              </div>
              <ul className="mt-6 space-y-2 text-xs text-slate-700 border-t border-slate-200/80 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                  Methodology standards alignment (Verra, Gold Standard, ISO)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                  Independent reviewer audit sign-off
                </li>
              </ul>
            </div>

            {/* Pillar 2: Trust */}
            <div className="p-8 rounded-xl border border-slate-200 bg-slate-50 hover:bg-forest-50/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">2. Trust</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Calculated using an open, transparent formula (0.30D + 0.25V + 0.20E + 0.15H + 0.10T). No hidden proprietary black-box calculations or pay-to-play scores.
                </p>
              </div>
              <ul className="mt-6 space-y-2 text-xs text-slate-700 border-t border-slate-200/80 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                  5 balanced audit components (0 to 100)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                  Transparent calculation audit trail
                </li>
              </ul>
            </div>

            {/* Pillar 3: Track */}
            <div className="p-8 rounded-xl border border-slate-200 bg-slate-50 hover:bg-forest-50/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-navy-100 text-navy-800 flex items-center justify-center mb-6">
                  <GitBranch className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">3. Track</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every project carries a publicly shareable Carbon Passport tracking submission events, review iterations, milestone audits, and monitoring renewals.
                </p>
              </div>
              <ul className="mt-6 space-y-2 text-xs text-slate-700 border-t border-slate-200/80 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                  Permanent lifecycle audit history
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                  Public verification timestamping
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How Trust Score Works Section */}
      <section id="trust-score" className="py-20 bg-slate-50 border-b border-slate-200 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
                Formula Specification v1.0
              </span>
              <h2 className="text-3xl font-extrabold text-navy-950">
                The Carbon Trust Score Formula
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Rather than an arbitrary subjective grade, the CarbonZ Trust Score uses a deterministic, transparent weighted average of five independently scored evidence criteria:
              </p>

              <div className="p-4 rounded-lg bg-navy-900 text-white font-mono text-sm leading-relaxed border border-navy-800 shadow-inner">
                <span className="text-accent-cyan font-bold block mb-1">Carbon Trust Score =</span>
                0.30D + 0.25V + 0.20E + 0.15H + 0.10T
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-forest-700 shrink-0">D (30%):</span>
                  <span><strong>Documentation Completeness:</strong> PDD quality, baseline studies, and legal tenure.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-forest-700 shrink-0">V (25%):</span>
                  <span><strong>Verification Status:</strong> Independent accredited auditor review and currency.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-forest-700 shrink-0">E (20%):</span>
                  <span><strong>Evidence Quality:</strong> GIS boundaries, radar/optical satellite data, and soil cores.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-forest-700 shrink-0">H (15%):</span>
                  <span><strong>History & Traceability:</strong> Milestone track record and review resolution speed.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-forest-700 shrink-0">T (10%):</span>
                  <span><strong>Transparency:</strong> Public access to raw sensor telemetry and audit trails.</span>
                </div>
              </div>
            </div>

            {/* Example Calculation Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-bold text-navy-950 text-base">
                      Benchmark Calculation Example
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standard project audit scenario with verified inputs
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-navy-950 font-mono">77</span>
                    <span className="text-xs text-slate-400">/100</span>
                    <span className="block text-[11px] font-bold text-teal-700">Tier: High</span>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs text-slate-700">
                  <div className="flex justify-between p-2 rounded bg-slate-50">
                    <span>Documentation (D): 80 × 0.30</span>
                    <span className="font-bold text-navy-900">+24.0 pts</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-50">
                    <span>Verification (V): 90 × 0.25</span>
                    <span className="font-bold text-navy-900">+22.5 pts</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-50">
                    <span>Evidence Quality (E): 70 × 0.20</span>
                    <span className="font-bold text-navy-900">+14.0 pts</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-50">
                    <span>History (H): 60 × 0.15</span>
                    <span className="font-bold text-navy-900">+9.0 pts</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-50">
                    <span>Transparency (T): 75 × 0.10</span>
                    <span className="font-bold text-navy-900">+7.5 pts</span>
                  </div>
                  <div className="flex justify-between p-3 rounded bg-forest-50 border border-forest-200 text-forest-950 font-bold text-sm">
                    <span>Calculated Total Score:</span>
                    <span>24 + 22.5 + 14 + 9 + 7.5 = 77 / 100</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <strong className="text-slate-700">Strict Rule:</strong> Missing inputs are never treated as zero. If any input is missing, the platform flags the score as <em>incomplete</em> until audited.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carbon Passport Showcase Section */}
      <section id="carbon-passport" className="py-20 bg-white border-b border-slate-200 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Traceability In Action
            </span>
            <h2 className="text-3xl font-extrabold text-navy-950 mt-2">
              The Carbon Passport
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              Every verified project receives a public, shareable Carbon Passport. Inspect timeline events from draft registration to satellite telemetry updates.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-10 max-w-4xl mx-auto shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-mono text-slate-500">CZ-BRA-2024-001</span>
                <h3 className="text-lg font-bold text-navy-950">
                  Amazon Rainforest Corridor Restoration & Biodiversity Buffer
                </h3>
              </div>
              <Link
                href="/projects/amazon-rainforest-corridor-restoration/passport"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-xs shrink-0 transition-colors"
              >
                View Full Live Passport
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400">Day 1</span>
                  <h4 className="text-sm font-bold text-slate-800">Project Registration & Baseline Intake</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Initial intake by Elena Rostova with baseline ecological survey and Para State land tenure title.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-600">Day 10</span>
                  <h4 className="text-sm font-bold text-slate-800">Submitted for Independent Review</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Dossier submitted under VM0007 methodology. Four technical verification reports attached.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <div>
                  <span className="text-xs font-semibold text-teal-600">Day 20</span>
                  <h4 className="text-sm font-bold text-slate-800">Review Assigned & Remote Sensing Audit</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Assigned to Dr. Kwame Mensah for canopy density audit and Sentinel-2 multi-spectral cross-referencing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                  4
                </div>
                <div>
                  <span className="text-xs font-semibold text-emerald-600">Day 70</span>
                  <h4 className="text-sm font-bold text-slate-800">Verified & Carbon Passport Minted</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Verification approved with Carbon Trust Score 83/100 (Tier: High). Continuous monitoring telemetry active.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-forest-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to bring verifiable transparency to your carbon portfolio?
          </h2>
          <p className="mt-4 text-base text-forest-200 max-w-2xl mx-auto leading-relaxed">
            Join developers, verification reviewers, and corporate carbon buyers using the open CarbonZ standard.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-forest-500 hover:bg-forest-400 text-white font-bold text-sm shadow-md transition-colors"
            >
              Register Developer Account
            </Link>
            <Link
              href="/projects"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-colors"
            >
              Explore Project Database
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
