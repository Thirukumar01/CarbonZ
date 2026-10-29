import { getCurrentUser } from "@/lib/auth";
import { getProjects } from "@/lib/projects";
import { AdminDashboardClient } from "./AdminDashboardClient";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = {
  title: "Admin Console | CarbonZ",
  description: "Governance, user roles management, and security audit trail oversight.",
};

export default async function AdminDashboardPage() {
  const session = await getCurrentUser();
  const { projects, isDemoData } = await getProjects({ page: 1, page_size: 50 });

  return (
    <div>
      {isDemoData && <DemoDataBanner />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Admin Console" },
          ]}
        />

        <AdminDashboardClient
          projects={projects}
          adminDisplayName={session.profile?.display_name || "CarbonZ Lead Administrator (Demo)"}
        />
      </div>
    </div>
  );
}
