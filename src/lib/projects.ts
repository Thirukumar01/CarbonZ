import { isServerSupabaseConfigured, createServerSupabaseClient } from "./supabase/server";
import { DEMO_PROJECTS } from "./demo-data";
import { FullProject, ProjectFilters } from "@/types/project";
import { ProjectType, VerificationStatus } from "@/types/database";

export interface PaginatedProjectsResult {
  projects: FullProject[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isDemoData: boolean;
}

/**
 * Retrieves public/published projects with filters, sorting, and pagination.
 */
export async function getProjects(
  filters: ProjectFilters = {}
): Promise<PaginatedProjectsResult> {
  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.min(50, Math.max(1, filters.page_size || 9));

  // If Supabase is configured, fetch actual database records
  if (isServerSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      let query = supabase
        .from("projects")
        .select(`
          *,
          developer:profiles!projects_developer_id_fkey(id, display_name, organization),
          trust_score:trust_scores(*),
          documents:project_documents(*),
          passport_events:passport_events(*)
        `, { count: "exact" })
        .eq("publication_status", "published");

      if (filters.search && filters.search.trim() !== "") {
        const term = `%${filters.search.trim()}%`;
        query = query.or(`name.ilike.${term},description.ilike.${term},project_code.ilike.${term}`);
      }

      if (filters.project_type && filters.project_type !== "all") {
        query = query.eq("project_type", filters.project_type);
      }

      if (filters.verification_status && filters.verification_status !== "all") {
        query = query.eq("verification_status", filters.verification_status);
      }

      if (filters.country && filters.country !== "all") {
        query = query.eq("country", filters.country);
      }

      // Apply sorting
      switch (filters.sort_by) {
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
        case "reduction_desc":
          query = query.order("estimated_reduction", { ascending: false, nullsFirst: false });
          break;
        case "newest":
        default:
          query = query.order("created_at", { ascending: false });
          break;
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, count, error } = await query.range(from, to);

      if (!error && data) {
        let results = (data as unknown) as FullProject[];

        // In-memory filter for calculated score if needed
        if (filters.min_score !== undefined) {
          results = results.filter(
            (p) => (p.trust_score?.calculated_score ?? 0) >= (filters.min_score || 0)
          );
        }
        if (filters.max_score !== undefined) {
          results = results.filter(
            (p) => (p.trust_score?.calculated_score ?? 0) <= (filters.max_score || 100)
          );
        }

        const total = count ?? results.length;

        return {
          projects: results,
          totalCount: total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize) || 1,
          isDemoData: false,
        };
      }
    } catch (err) {
      console.warn("Supabase query failed, falling back to verified demo dataset:", err);
    }
  }

  // Graceful fallback to verified DEMO projects when credentials are not yet configured
  let filtered = DEMO_PROJECTS.filter((p) => p.publication_status === "published");

  if (filters.search && filters.search.trim() !== "") {
    const term = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.project_code.toLowerCase().includes(term) ||
        p.country.toLowerCase().includes(term)
    );
  }

  if (filters.project_type && filters.project_type !== "all") {
    filtered = filtered.filter((p) => p.project_type === filters.project_type);
  }

  if (filters.verification_status && filters.verification_status !== "all") {
    filtered = filtered.filter((p) => p.verification_status === filters.verification_status);
  }

  if (filters.country && filters.country !== "all") {
    filtered = filtered.filter((p) => p.country.toLowerCase() === filters.country?.toLowerCase());
  }

  if (filters.min_score !== undefined) {
    filtered = filtered.filter(
      (p) => (p.trust_score?.calculated_score ?? 0) >= (filters.min_score || 0)
    );
  }

  if (filters.max_score !== undefined) {
    filtered = filtered.filter(
      (p) => (p.trust_score?.calculated_score ?? 0) <= (filters.max_score || 100)
    );
  }

  // Sort
  if (filters.sort_by === "score_desc") {
    filtered.sort((a, b) => (b.trust_score?.calculated_score ?? 0) - (a.trust_score?.calculated_score ?? 0));
  } else if (filters.sort_by === "score_asc") {
    filtered.sort((a, b) => (a.trust_score?.calculated_score ?? 0) - (b.trust_score?.calculated_score ?? 0));
  } else if (filters.sort_by === "reduction_desc") {
    filtered.sort((a, b) => (b.estimated_reduction ?? 0) - (a.estimated_reduction ?? 0));
  } else if (filters.sort_by === "oldest") {
    filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else {
    // Newest
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return {
    projects: paginated,
    totalCount: total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
    isDemoData: true,
  };
}

/**
 * Retrieves a single project by its unique slug.
 */
export async function getProjectBySlug(slug: string): Promise<{
  project: FullProject | null;
  isDemoData: boolean;
}> {
  if (isServerSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          developer:profiles!projects_developer_id_fkey(id, display_name, organization),
          trust_score:trust_scores(*),
          documents:project_documents(*),
          passport_events:passport_events(*),
          reviews:verification_reviews(*)
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        return {
          project: data as unknown as FullProject,
          isDemoData: false,
        };
      }
    } catch (err) {
      console.warn("Supabase single project lookup failed, falling back to demo data:", err);
    }
  }

  const demoMatch = DEMO_PROJECTS.find((p) => p.slug === slug);
  return {
    project: demoMatch || null,
    isDemoData: true,
  };
}

/**
 * Retrieves multiple projects by IDs for side-by-side comparison.
 */
export async function getProjectsForComparison(ids: string[]): Promise<{
  projects: FullProject[];
  isDemoData: boolean;
}> {
  if (!ids.length) {
    return { projects: [], isDemoData: false };
  }

  if (isServerSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          developer:profiles!projects_developer_id_fkey(id, display_name, organization),
          trust_score:trust_scores(*),
          documents:project_documents(*)
        `)
        .in("id", ids);

      if (!error && data && data.length > 0) {
        return {
          projects: data as unknown as FullProject[],
          isDemoData: false,
        };
      }
    } catch (err) {
      console.warn("Comparison query failed:", err);
    }
  }

  const matches = DEMO_PROJECTS.filter((p) => ids.includes(p.id) || ids.includes(p.slug));
  return {
    projects: matches,
    isDemoData: true,
  };
}

