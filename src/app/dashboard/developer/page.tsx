import { getCurrentUser } from "@/lib/auth";
import { getProjects } from "@/lib/projects";
import { DeveloperDashboardClient } from "./DeveloperDashboardClient";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = {
  title: "Developer Portal | CarbonZ",
  description: "Manage project submissions, upload evidence files, and track reviewer decisions.",
};

export default async function DeveloperDashboardPage() {
  const session = await getCurrentUser();
  const { projects, isDemoData } = await getProjects({ page: 1, page_size: 20 });

  return (
    <div>
      {isDemoData && <DemoDataBanner />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Developer Portal" },
          ]}
        />

        <DeveloperDashboardClient
          initialProjects={projects}
          userDisplayName={session.profile?.display_name || "Elena Rostova (Demo Developer)"}
        />
      </div>
    </div>
  );
}

