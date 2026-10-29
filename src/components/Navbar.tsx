"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, Menu, X, Layers, Compass, BarChart3, User, ChevronDown } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardsOpen, setIsDashboardsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-forest-800 text-white flex items-center justify-center shadow-sm group-hover:bg-forest-900 transition-colors">
              <ShieldCheck className="w-6 h-6 text-accent-cyan" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-navy-900 group-hover:text-forest-800 transition-colors">
                Carbon<span className="text-forest-600">Z</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500 border-l border-slate-300 pl-2">
                Verify. Trust. Track.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7">
            <Link
              href="/projects"
              className="text-sm font-medium text-slate-600 hover:text-forest-700 flex items-center gap-1.5 transition-colors"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              Explorer
            </Link>

            <Link
              href="/compare"
              className="text-sm font-medium text-slate-600 hover:text-forest-700 flex items-center gap-1.5 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-slate-400" />
              Compare
            </Link>

            <Link
              href="/#trust-score"
              className="text-sm font-medium text-slate-600 hover:text-forest-700 transition-colors"
            >
              Trust Score
            </Link>

            <Link
              href="/#carbon-passport"
              className="text-sm font-medium text-slate-600 hover:text-forest-700 transition-colors"
            >
              Carbon Passport
            </Link>

            {/* Dashboards dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDashboardsOpen(!isDashboardsOpen)}
                onBlur={() => setTimeout(() => setIsDashboardsOpen(false), 200)}
                className="text-sm font-medium text-slate-600 hover:text-forest-700 flex items-center gap-1 transition-colors"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                Dashboards
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isDashboardsOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-900"
                  >
                    User Dashboard
                  </Link>
                  <Link
                    href="/dashboard/developer"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-900"
                  >
                    Developer Dashboard
                  </Link>
                  <Link
                    href="/dashboard/reviewer"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-900"
                  >
                    Reviewer Dashboard
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link
                    href="/dashboard/admin"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-900 font-medium"
                  >
                    Admin Console
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Auth CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 hover:text-navy-900 px-3.5 py-2 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-slate-400" />
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-white bg-forest-700 hover:bg-forest-800 px-4 py-2 rounded-md shadow-sm transition-colors"
            >
              Create Account
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/projects"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-forest-700"
          >
            Project Explorer
          </Link>
          <Link
            href="/compare"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-forest-700"
          >
            Compare Projects
          </Link>
          <Link
            href="/#trust-score"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-forest-700"
          >
            Trust Score Formula
          </Link>
          <Link
            href="/#carbon-passport"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-forest-700"
          >
            Carbon Passport
          </Link>
          <div className="border-t border-slate-200 pt-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Dashboards
            </div>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block py-1.5 text-sm text-slate-600 hover:text-forest-700"
            >
              User Dashboard
            </Link>
            <Link
              href="/dashboard/developer"
              onClick={() => setIsOpen(false)}
              className="block py-1.5 text-sm text-slate-600 hover:text-forest-700"
            >
              Developer Portal
            </Link>
            <Link
              href="/dashboard/reviewer"
              onClick={() => setIsOpen(false)}
              className="block py-1.5 text-sm text-slate-600 hover:text-forest-700"
            >
              Reviewer Panel
            </Link>
            <Link
              href="/dashboard/admin"
              onClick={() => setIsOpen(false)}
              className="block py-1.5 text-sm text-slate-600 hover:text-forest-700 font-medium"
            >
              Admin Console
            </Link>
          </div>
          <div className="border-t border-slate-200 pt-4 flex flex-col space-y-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-md"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2 text-sm font-medium text-white bg-forest-700 rounded-md shadow-sm"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
