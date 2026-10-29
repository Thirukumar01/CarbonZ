import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-md bg-forest-800 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-accent-cyan" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Carbon<span className="text-forest-400">Z</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">Verify. Trust. Track.</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Open carbon project transparency and evidence-based trust scoring platform for carbon developers, reviewers, and buyers.
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/projects" className="hover:text-forest-400 transition-colors">
                  Project Explorer
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-forest-400 transition-colors">
                  Project Comparison
                </Link>
              </li>
              <li>
                <Link href="/#trust-score" className="hover:text-forest-400 transition-colors">
                  Trust Score Engine v1.0
                </Link>
              </li>
              <li>
                <Link href="/#carbon-passport" className="hover:text-forest-400 transition-colors">
                  Carbon Passport Traceability
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Workflows & Dashboards */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Dashboards
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-forest-400 transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/developer" className="hover:text-forest-400 transition-colors">
                  Developer Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard/reviewer" className="hover:text-forest-400 transition-colors">
                  Reviewer Bureau
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="hover:text-forest-400 transition-colors">
                  Admin Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Governance */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Governance & Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-forest-400 transition-colors">
                  About CarbonZ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-forest-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-forest-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-forest-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="bg-navy-900/60 rounded-lg p-4 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300 block mb-1">
              Important Transparency & Regulatory Disclaimer:
            </span>
            CarbonZ is an independent transparency, audit evidence, and data integrity platform. A CarbonZ Trust Score reflects documentation completeness, audit currency, and verified evidence quality under the CarbonZ Trust Framework v1.0. A score does NOT constitute legal additionality certification, investment advice, financial rating, or guarantee of real-world carbon removal or permanence. CarbonZ reviews are independent of third-party registry credit issuance.
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} CarbonZ Platform. Built for open climate technology transparency.</p>
            <p className="flex items-center gap-2">
              Formula Version: <span className="font-mono text-slate-400">v1.0 (0.30D + 0.25V + 0.20E + 0.15H + 0.10T)</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

