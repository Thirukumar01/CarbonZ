"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Mail, MessageSquare, Send, CheckCircle2, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Breadcrumbs items={[{ label: "Contact & Support" }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
          Contact CarbonZ Support & Bureau
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
          Have inquiries regarding methodology verification, reviewer accreditation, or enterprise API access? Reach out to our technical governance team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-navy-950">Inquiry Received</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you for contacting CarbonZ. A technical verification officer will review your dispatch and respond shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-lg"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Elena Rostova"
                  className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="elena@organization.org"
                  className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="general">General Platform Inquiry</option>
                  <option value="developer">Project Developer Onboarding</option>
                  <option value="reviewer">Reviewer Accreditation & Audit Standards</option>
                  <option value="dispute">Methodology or Score Appeal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry or question..."
                  className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-forest-700 hover:bg-forest-800 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Inquiry
              </button>
            </form>
          )}
        </div>

        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <h3 className="font-bold text-navy-950 text-sm">Governance Desk</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official communication channels for methodological audit disputes and reviewer governance:
            </p>
            <div className="pt-2 space-y-2 text-xs font-mono text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-forest-700 shrink-0" />
                <span>support@carbonz.org</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0" />
                <span>governance@carbonz.org</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
