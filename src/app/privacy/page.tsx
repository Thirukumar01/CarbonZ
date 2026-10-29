import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = {
  title: "Privacy Policy | CarbonZ",
  description: "CarbonZ data protection practices, telemetry handling, and privacy commitments.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Last Updated: October 2025 • Version 1.0
        </p>
      </div>

      <div className="prose prose-slate text-sm space-y-6 leading-relaxed text-slate-700">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-950">1. Information We Collect</h2>
          <p>
            CarbonZ processes account registration information (name, work email, organization, assigned platform role) and carbon project verification dossiers (GIS boundary files, baseline ecological studies, legal land ownership affidavits, and sensor telemetry).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-950">2. How Documents Are Protected</h2>
          <p>
            Private documents uploaded to our Supabase Storage buckets are governed by Row Level Security (RLS) policies. Sensitive files (such as confidential financial additionality models or unredacted land title deeds) are accessible exclusively via short-lived signed URLs granted to authorized developers and accredited verification reviewers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-950">3. Safe Disclosed Metadata</h2>
          <p>
            The Carbon Passport displays public project milestone events and high-level verification indicators. It never reveals personally identifiable developer information, confidential reviewer deliberations, or private credentials.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-950">4. Contacting Data Protection</h2>
          <p>
            For inquiries regarding our cryptographic audit trails or data retention, reach out to our privacy compliance desk at <code>privacy@carbonz.org</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
