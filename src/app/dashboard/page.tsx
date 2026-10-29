import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getProjects } from "@/lib/projects";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProjectCard } from "@/components/ProjectCard";
import {
  User,
  Bookmark,
  Building2,
  ShieldCheck,
  Compass,
  ArrowRight,
  Layers,
  Settings,
} from "lucide-react";

export const metadata = {
  title: "User Dashboard | CarbonZ",
  description: "Manage your profile, bookmarked carbon projects, and verified activity.",
};

export default async function UserDashboardPage() {
  const session = await getCurrentUser();
  const { projects, isDemoData } = await getProjects({ page: 1, page_size: 3 });

  return (
    <div>
      {isDemoData && <DemoDataBanner />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: "User Dashboard" }]} />

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-forest-800 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              {session.profile?.display_name?.charAt(0) || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-navy-950">
                  {session.profile?.display_name || "Guest Observer"}
                </h1>
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-forest-50 text-forest-800 border border-forest-200 font-bold">
                  {session.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {session.user?.email || "Unauthenticated Session"}
                {session.profile?.organization && ` • ${session.profile.organization}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              Explore Projects
            </Link>
            <Link
              href="/compare"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              Compare
            </Link>
          </div>
        </div>

        {/* Quick Portal Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/developer"
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-forest-400 hover:shadow-xs transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-forest-700 uppercase tracking-wide">
                Developer Portal
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-forest-700 transition-colors" />
            </div>
            <h3 className="text-base font-bold text-navy-950">Submit Projects & Evidence</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create draft project dossiers, upload telemetry reports, and track reviewer decisions.
            </p>
          </Link>

          <Link
            href="/dashboard/reviewer"
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-forest-400 hover:shadow-xs transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">
                Reviewer Bureau
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
            </div>
            <h3 className="text-base font-bold text-navy-950">Audit Technical Claims</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review submitted dossiers, cross-reference GIS data, and assign Trust Score components.
            </p>
          </Link>

          <Link
            href="/dashboard/admin"
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-forest-400 hover:shadow-xs transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-navy-700 uppercase tracking-wide">
                Governance Console
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-navy-700 transition-colors" />
            </div>
            <h3 className="text-base font-bold text-navy-950">Admin & User Oversight</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Manage platform role allocations, inspect security audit logs, and oversee publications.
            </p>
          </Link>
        </div>

        {/* Bookmarked / Saved Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-forest-700" />
              <h2 className="text-lg font-bold text-navy-950">
                Bookmarked Carbon Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-forest-700 hover:text-forest-800"
            >
              Browse more projects →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

