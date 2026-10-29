"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FullProject } from "@/types/project";
import { ProjectCard } from "@/components/ProjectCard";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Layers,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react";

interface ProjectExplorerClientProps {
  initialProjects: FullProject[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  isDemoData: boolean;
}

export function ProjectExplorerClient({
  initialProjects,
  totalCount,
  currentPage,
  totalPages,
}: ProjectExplorerClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Search and filter states initialized from URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [minScore, setMinScore] = useState(searchParams.get("min_score") || "0");

  // Comparison selection basket
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const applyFilters = (newPage = 1) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (type !== "all") params.set("type", type);
      if (status !== "all") params.set("status", status);
      if (sortBy !== "newest") params.set("sort", sortBy);
      if (Number(minScore) > 0) params.set("min_score", minScore);
      if (newPage > 1) params.set("page", newPage.toString());

      router.push(`/projects?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setSearch("");
    setType("all");
    setStatus("all");
    setSortBy("newest");
    setMinScore("0");
    startTransition(() => {
      router.push("/projects");
    });
  };

  const toggleCompare = (projectId: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(projectId)) {
        return prev.filter((id) => id !== projectId);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 projects simultaneously.");
        return prev;
      }
      return [...prev, projectId];
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters(1)}
              placeholder="Search by project name, code (e.g. CZ-BRA-2024-001), or description..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => applyFilters(1)}
            disabled={isPending}
            className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-lg font-semibold text-sm shadow-xs transition-colors shrink-0"
          >
            {isPending ? "Filtering..." : "Apply Filters"}
          </button>
        </div>

        {/* Filter Selectors Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Project Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Project Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-forest-600"
            >
              <option value="all">All Project Types</option>
              <option value="reforestation">Reforestation / ARR</option>
              <option value="blue_carbon">Blue Carbon / Mangrove</option>
              <option value="methane_capture">Methane Capture</option>
              <option value="direct_air_capture">Direct Air Capture</option>
              <option value="soil_carbon">Soil Carbon</option>
              <option value="renewable_energy">Renewable Energy</option>
              <option value="improved_forest_management">Forest Management</option>
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Verification Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-forest-600"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified Only</option>
              <option value="under_review">Under Review</option>
              <option value="submitted">Submitted</option>
              <option value="changes_requested">Changes Requested</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-forest-600"
            >
              <option value="newest">Newest First</option>
              <option value="score_desc">Highest Trust Score</option>
              <option value="score_asc">Lowest Trust Score</option>
              <option value="reduction_desc">Largest CO2 Reduction</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Min Score Range */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-500">
                Min Trust Score
              </label>
              <span className="text-xs font-bold text-navy-900 font-mono">
                {minScore}+
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="w-full accent-forest-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Reset button if filters active */}
        {(search || type !== "all" || status !== "all" || sortBy !== "newest" || minScore !== "0") && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleReset}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Comparison Floating Sticky Tray */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 bg-navy-950 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-navy-800 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-cyan" />
            <span className="text-xs font-semibold">
              {selectedForCompare.length} {selectedForCompare.length === 1 ? "project" : "projects"} selected for comparison
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedForCompare([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            <button
              onClick={() => router.push(`/compare?ids=${selectedForCompare.join(",")}`)}
              className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-forest-600 hover:bg-forest-500 text-white shadow-xs transition-colors"
            >
              Compare Now
            </button>
          </div>
        </div>
      )}

      {/* Project Grid */}
      {initialProjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Projects Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No projects matched your specific query parameters. Try widening your search or clearing your active filters.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              showCompareToggle={true}
              isCompared={selectedForCompare.includes(project.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-slate-200 text-xs text-slate-600">
          <span>
            Showing page <strong className="text-navy-950">{currentPage}</strong> of{" "}
            <strong className="text-navy-950">{totalPages}</strong> ({totalCount} total projects)
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => applyFilters(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
              className="p-1.5 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => applyFilters(currentPage + 1)}
              disabled={currentPage >= totalPages || isPending}
              className="p-1.5 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

