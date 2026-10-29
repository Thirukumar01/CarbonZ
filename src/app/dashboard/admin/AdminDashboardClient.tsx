"use client";

import { useState } from "react";
import Link from "next/link";
import { FullProject } from "@/types/project";
import { getStatusBadge } from "@/lib/workflow";
import {
  ShieldAlert,
  Users,
  FileCheck2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  History,
  Activity,
} from "lucide-react";

interface AdminDashboardClientProps {
  projects: FullProject[];
  adminDisplayName: string;
}

export function AdminDashboardClient({
  projects,
  adminDisplayName,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"projects" | "users" | "audit">("projects");

  // Sample managed user profiles for demonstration/local administration
  const [users, setUsers] = useState([
    {
      id: "11111111-1111-1111-1111-111111111111",
      display_name: "Elena Rostova (Demo Developer)",
      email: "elena@amazoniaflora.org",
      role: "developer",
      organization: "Amazonia Flora Conservation Org",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      display_name: "Dr. Kwame Mensah (Demo Reviewer)",
      email: "kwame@global-audit.org",
      role: "reviewer",
      organization: "Global Ecological Audit Bureau",
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      display_name: "CarbonZ Lead Administrator (Demo)",
      email: "admin@carbonz.org",
      role: "admin",
      organization: "CarbonZ Governance Committee",
    },
    {
      id: "44444444-4444-4444-4444-444444444444",
      display_name: "Sarah Chen (Demo Developer)",
      email: "sarah@nordicair.is",
      role: "developer",
      organization: "Nordic Air Capture Technologies",
    },
  ]);

  // Sample audit logs for platform visibility
  const auditLogs = [
    {
      id: "log-1",
      action: "project_verified",
      actor: "Dr. Kwame Mensah",
      entity: "CZ-BRA-2024-001",
      timestamp: "2024-08-15 16:00:00 UTC",
      note: "Trust score computed: 83/100 (v1.0)",
    },
    {
      id: "log-2",
      action: "status_transition",
      actor: "Elena Rostova",
      entity: "CZ-IND-2024-003",
      timestamp: "2024-07-01 12:00:00 UTC",
      note: "Transitioned from draft to submitted",
    },
    {
      id: "log-3",
      action: "role_grant",
      actor: "CarbonZ Lead Administrator",
      entity: "Dr. Kwame Mensah",
      timestamp: "2024-05-01 09:30:00 UTC",
      note: "Granted reviewer role after accredited verification bureau onboarding",
    },
  ];

  const handleRoleChange = (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) {
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    alert(`User role updated to ${newRole}.`);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h2 className="text-xl font-bold text-navy-950">
              Governance & Administrative Console
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Administrator: <strong className="text-slate-700">{adminDisplayName}</strong> • Root Privilege Session
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === "projects"
                ? "bg-white text-navy-950 shadow-xs"
                : "text-slate-600 hover:text-navy-950"
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === "users"
                ? "bg-white text-navy-950 shadow-xs"
                : "text-slate-600 hover:text-navy-950"
            }`}
          >
            Users & Roles ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === "audit"
                ? "bg-white text-navy-950 shadow-xs"
                : "text-slate-600 hover:text-navy-950"
            }`}
          >
            Audit Trail
          </button>
        </div>
      </div>

      {/* Tab 1: Project Management */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              All Platform Project Submissions
            </h3>
            <span className="text-xs text-slate-500">
              Verified: {projects.filter((p) => p.verification_status === "verified").length} | In Review: {projects.filter((p) => p.verification_status === "under_review" || p.verification_status === "submitted").length}
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="p-3.5">Code</th>
                    <th className="p-3.5">Project Name</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Verification</th>
                    <th className="p-3.5">Publication</th>
                    <th className="p-3.5">Trust Score</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {projects.map((p) => {
                    const badge = getStatusBadge(p.verification_status);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5 font-mono font-semibold text-slate-600">
                          {p.project_code}
                        </td>
                        <td className="p-3.5 font-bold text-navy-950 max-w-xs truncate">
                          {p.name}
                        </td>
                        <td className="p-3.5 uppercase font-medium">
                          {p.project_type.replace("_", " ")}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.badgeBg} ${badge.badgeColor}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="capitalize font-medium text-slate-600">
                            {p.publication_status}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold">
                          {p.trust_score?.calculated_score
                            ? `${Math.round(p.trust_score.calculated_score)}/100`
                            : "—"}
                        </td>
                        <td className="p-3.5 text-right">
                          <Link
                            href={`/projects/${p.slug}`}
                            className="text-xs font-semibold text-forest-700 hover:text-forest-800"
                          >
                            Inspect Dossier
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Role Governance */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              User & Privilege Management
            </h3>
            <span className="text-xs text-slate-500">
              Least-privilege role model enforced by RLS
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Organization</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5 text-right">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-navy-950">
                        {u.display_name}
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono">
                        {u.email}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {u.organization}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded font-mono font-bold uppercase text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="text-xs py-1 px-2 rounded border border-slate-300 bg-white"
                        >
                          <option value="user">User</option>
                          <option value="developer">Developer</option>
                          <option value="reviewer">Reviewer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Immutable Audit Trail */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              System Audit Event Logs
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Immutable PostgreSQL Table
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-navy-950 uppercase px-2 py-0.5 rounded bg-slate-200 text-[10px]">
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-800">
                      Actor: {log.actor}
                    </span>
                    <span className="text-slate-400">Target: {log.entity}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{log.note}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

