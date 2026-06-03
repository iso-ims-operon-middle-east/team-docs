'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="bg-emerald-900 text-white">
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/operon-logo-white.png" alt="Operon" className="w-10 h-10 object-contain" />
            <div>
              <div className="font-bold text-lg leading-tight">ISO IMS Portal</div>
              <div className="text-xs text-emerald-300">Operon Middle East</div>
            </div>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">

        {/* Hero */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-3xl p-12 text-white mb-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img src="/operon-logo-grey-landscape.png" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="relative">
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-300 mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>⏤ Operon Middle East ⏤</div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">ISO IMS Portal</h1>
            <p className="text-emerald-100 text-lg leading-relaxed max-w-2xl">
              An integrated management system platform for Operon Middle East — designed to streamline document control, non-conformance tracking, and quality assurance operations.
            </p>
          </div>
        </div>

        {/* Modules */}
        <div className="mb-10">
          <div className="text-xs font-mono text-emerald-700/70 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>MODULES</div>
          <h2 className="text-2xl font-bold text-emerald-950 mb-6">What's inside</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 hover:border-emerald-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-emerald-950 mb-2">Document Library</h3>
              <p className="text-sm text-emerald-700/70 leading-relaxed">Access and manage all ISO IMS documents across 5 tiers — policies, procedures, manuals, work instructions and forms.</p>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 hover:border-emerald-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 className="font-bold text-emerald-950 mb-2">Non-Conformance Reports</h3>
              <p className="text-sm text-emerald-700/70 leading-relaxed">Track, manage and resolve non-conformances across the organization with full audit trail and status tracking.</p>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 hover:border-emerald-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-bold text-emerald-950 mb-2">Quality Assurance</h3>
              <p className="text-sm text-emerald-700/70 leading-relaxed">Organize and share QA documents in private folders with role-based access — view only or edit permissions.</p>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-10">
          <div className="text-xs font-mono text-emerald-700/70 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>STANDARDS</div>
          <h2 className="text-2xl font-bold text-emerald-950 mb-6">ISO Certifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 55001:2014'].map((std) => (
              <div key={std} className="bg-white rounded-xl border border-emerald-100 p-4 text-center hover:border-emerald-300 transition">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                </div>
                <div className="text-xs font-bold text-emerald-950">{std}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Company info */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-8 flex items-center gap-8">
          <img src="/operon-logo-green.png" alt="Operon" className="w-16 h-16 object-contain shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-emerald-950 mb-1">Operon Middle East</h3>
            <p className="text-sm text-emerald-700/70 mb-3">An Edgenta Company — providing integrated facilities management and asset management solutions across the Middle East region.</p>
            <div className="flex items-center gap-4 text-xs text-emerald-700/60">
              <span>🏢 Facilities Management</span>
              <span>🔧 Asset Management</span>
              <span>✅ ISO Certified</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-emerald-700/60 mb-1">Portal Version</div>
            <div className="text-sm font-bold text-emerald-950">v1.0.0</div>
            <div className="text-xs text-emerald-700/60 mt-1">© 2026</div>
          </div>
        </div>

      </div>

      <footer className="border-t border-emerald-100 bg-white px-8 py-4 text-xs text-emerald-700/70 flex items-center justify-between max-w-full">
        <div>© 2026 Operon Middle East — An Edgenta Company</div>
        <Link href="/dashboard" className="text-emerald-700 hover:text-emerald-900 font-medium transition">Back to Dashboard →</Link>
      </footer>
    </div>
  )
}
