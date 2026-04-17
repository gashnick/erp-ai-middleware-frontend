import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-lg font-bold text-white">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CID ERP</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2">
              <span className="text-sm font-semibold text-blue-700">
                AI-Powered ERP Platform
              </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl">
              Enterprise Intelligence
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Unified in One Place
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              CID ERP brings together all your business data—Finance, HR,
              Operations, and Orders—with AI-powered insights and real-time
              dashboards. Ask questions, get answers instantly.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 text-4xl">⚡</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Always in Sync
              </h3>
              <p className="text-gray-600">
                Real-time data from QuickBooks, Odoo, PostgreSQL, MySQL, and
                more. See updates within 60 seconds.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">🤖</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                AI Assistant
              </h3>
              <p className="text-gray-600">
                Chat with your data. Ask questions, get insights, detect
                anomalies. No SQL required.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">🔒</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Enterprise Secure
              </h3>
              <p className="text-gray-600">
                Multi-tenant architecture, RBAC, AES-256 encryption, audit
                trails. Your data, protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            Everything You Need to Run Your Business
          </h2>

          {/* Finance Dashboard */}
          <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-center">
            <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 text-center">
              <div className="text-6xl">💰</div>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Finance Dashboard
              </h3>
              <p className="mb-4 text-gray-600">
                Real-time cash flow, AR/AP aging, revenue by period,
                profitability snapshots, and anomaly detection. Spot trends
                before they become problems.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Cash position and forecasts</li>
                <li>✓ Invoice aging reports</li>
                <li>✓ Revenue and expense breakdowns</li>
                <li>✓ Anomaly alerts</li>
              </ul>
            </div>
          </div>

          {/* HR Dashboard */}
          <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-center md:flex-row-reverse">
            <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-8 text-center">
              <div className="text-6xl">👥</div>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                HR & People Management
              </h3>
              <p className="mb-4 text-gray-600">
                Track headcount, monitor attrition risk, manage leave requests,
                and gain payroll insights. Keep your team organized and
                informed.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Headcount by department</li>
                <li>✓ Attrition risk indicators</li>
                <li>✓ Leave request management</li>
                <li>✓ Payroll insights</li>
              </ul>
            </div>
          </div>

          {/* Operations Dashboard */}
          <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-center">
            <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-8 text-center">
              <div className="text-6xl">📦</div>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Operations & Orders
              </h3>
              <p className="mb-4 text-gray-600">
                Real-time order management, inventory tracking, SLA monitoring,
                and delivery status. See everything at a glance.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Live order dashboards</li>
                <li>✓ Inventory levels</li>
                <li>✓ SLA breach alerts</li>
                <li>✓ Queue time analysis</li>
              </ul>
            </div>
          </div>

          {/* AI Chat */}
          <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-center md:flex-row-reverse">
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-8 text-center">
              <div className="text-6xl">🤖</div>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                AI Chat Assistant
              </h3>
              <p className="mb-4 text-gray-600">
                Ask your data anything. The AI assistant understands your
                business context and provides instant answers, charts, and
                recommendations.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Natural language queries</li>
                <li>✓ Instant insights & anomalies</li>
                <li>✓ Charts and table exports</li>
                <li>✓ Contextual recommendations</li>
              </ul>
            </div>
          </div>

          {/* Data Integration */}
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 text-center">
              <div className="text-6xl">🔗</div>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Smart Data Integration
              </h3>
              <p className="mb-4 text-gray-600">
                Connect your existing systems. Automated ETL with validation,
                deduplication, and error quarantine. Your data stays clean.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ QuickBooks, Odoo connectors</li>
                <li>✓ PostgreSQL, MySQL support</li>
                <li>✓ CSV/XLSX secure upload</li>
                <li>✓ Automated validation & quarantine</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            Getting Started is Easy
          </h2>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mx-auto">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">Sign Up</h4>
              <p className="text-sm text-gray-600">
                Create your account in seconds
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mx-auto">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">Connect Data</h4>
              <p className="text-sm text-gray-600">
                Link your financial and operational systems
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mx-auto">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Sync & Validate
              </h4>
              <p className="text-sm text-gray-600">
                Data is automatically validated and deduplicated
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mx-auto">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">Explore</h4>
              <p className="text-sm text-gray-600">
                Ask questions and discover insights instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            Built for Enterprise
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                <span>🔐</span> Security
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• AES-256 encryption at rest</li>
                <li>• TLS 1.2+ in transit</li>
                <li>• Tenant-specific encryption keys</li>
                <li>• Immutable audit trails</li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                <span>🎯</span> Performance
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 60-second data sync</li>
                <li>• &lt;3s dashboard load times</li>
                <li>• &lt;2s AI chat responses</li>
                <li>• 5,000+ records/min baseline</li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                <span>✅</span> Compliance
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• GDPR alignment</li>
                <li>• ISO 27001 practices</li>
                <li>• Data retention controls</li>
                <li>• Role-based access control</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Ready to Transform Your Business?
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            Join companies using CID ERP to make smarter decisions, faster.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-white/90"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <span className="text-sm font-bold text-white">C</span>
                </div>
                <span className="font-bold text-gray-900">CID ERP</span>
              </div>
              <p className="text-sm text-gray-600">
                AI-powered business intelligence platform
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#features" className="hover:text-blue-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-blue-600">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 CID ERP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
