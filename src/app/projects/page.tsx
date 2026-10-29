import { getProjects } from "@/lib/projects";
import { ProjectExplorerClient } from "./ProjectExplorerClient";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProjectType, VerificationStatus } from "@/types/database";

export const metadata = {
  title: "Project Explorer | CarbonZ",
  description: "Browse, filter, and compare verified carbon projects and their transparent Trust Scores.",
};

interface ProjectsPageProps {
  searchParams: {
    search?: string;
    type?: string;
    status?: string;
    sort?: string;
    min_score?: string;
    page?: string;
  };
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const projectType = searchParams.type as ProjectType | "all" | undefined;
  const verificationStatus = searchParams.status as VerificationStatus | "all" | undefined;
  const minScore = searchParams.min_score ? parseFloat(searchParams.min_score) : undefined;

  const { projects, totalCount, totalPages, isDemoData } = await getProjects({
    search: searchParams.search,
    project_type: projectType,
    verification_status: verificationStatus,
    sort_by: searchParams.sort as any,
    min_score: minScore,
    page,
    page_size: 9,
  });

  return (
    <div>
      {isDemoData && <DemoDataBanner />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: "Projects Explorer" }]} className="mb-6" />

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Carbon Project Explorer
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Inspect audited carbon projects, evaluate evidence dossiers, analyze calculated Trust Score breakdowns, and track project continuity.
          </p>
        </div>

        <ProjectExplorerClient
          initialProjects={projects}
          totalCount={totalCount}
          currentPage={page}
          totalPages={totalPages}
          isDemoData={isDemoData}
        />
      </div>
    </div>
  );
}
