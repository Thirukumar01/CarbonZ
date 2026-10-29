import { getCurrentUser } from "@/lib/auth";
import { getProjects } from "@/lib/projects";
import { ReviewerDashboardClient } from "./ReviewerDashboardClient";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = {
  title: "Reviewer Bureau | CarbonZ",
  description: "Examine project dossiers, check GIS telemetry, and record verification decisions.",
};

export default async function ReviewerDashboardPage() {
  const session = await getCurrentUser();
  const { projects, isDemoData } = await getProjects({ page: 1, page_size: 20 });

  return (
    <div>
      {isDemoData && <DemoDataBanner />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Reviewer Bureau" },
          ]}
        />

        <ReviewerDashboardClient
          initialProjects={projects}
          reviewerDisplayName={session.profile?.display_name || "Dr. Kwame Mensah (Demo Reviewer)"}
        />
      </div>
    </div>
  );
}

