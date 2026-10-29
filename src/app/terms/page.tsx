import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = {
  title: "Terms and Conditions | CarbonZ",
  description: "Terms of service and platform rules governing the CarbonZ framework.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Breadcrumbs items={[{ label: "Terms of Service" }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Effective Date: October 2025 • Version 1.0
        </p>
      </div>

      <div className="prose prose-slate text-sm space-y-6 leading-relaxed text-slate-700">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-950">1. Acceptance of Terms</h2>
          <p>
            By accessing or submitting carbon projects to the CarbonZ platform, you agree to abide by these Terms of Service and our mathematical integrity policies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-950">2. Developer Warranty & Truthful Evidence</h2>
          <p>
            Carbon project developers warrant that all uploaded baseline surveys, GIS coordinates, and land ownership documents reflect authentic, unmanipulated field data. Submitting fraudulent or fabricated satellite imagery results in permanent platform disqualification and public rejection on the Carbon Passport.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-950">3. Nature of Carbon Trust Scores</h2>
          <p>
            The Carbon Trust Score is an internal data transparency and audit currency indicator. It does not certify legal additionality or environmental permanence under national or international treaty jurisdictions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-950">4. Reviewer Independence</h2>
          <p>
            Reviewers must maintain complete independence and declare any financial, advisory, or familial relationships with submitted project proponents before initiating an audit.
          </p>
        </section>
      </div>
    </div>
  );
}

