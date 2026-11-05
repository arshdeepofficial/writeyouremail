import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/studio" className="flex items-center gap-3 font-bold text-lg tracking-tight">
            <span className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black text-sm">
              ✉️
            </span>
            WriteYourEmail<span className="text-neutral-500">.com</span>
          </Link>
          <Link href="/studio" className="text-xs text-neutral-400 hover:text-white transition">
            ← Back to App
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-xs text-neutral-500 mb-8">Last updated: February 2026</p>

        <div className="space-y-8 text-neutral-300 text-sm leading-relaxed border-t border-neutral-900 pt-8">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Information We Collect</h2>
            <p className="text-neutral-400 mb-2">
              We collect information to provide better services to our users:
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-2">
              <li><strong className="text-neutral-200">Account Information:</strong> Your email address when you sign up via Supabase.</li>
              <li><strong className="text-neutral-200">Usage Data:</strong> Prompts, email contexts, and metadata generated while using the tool to maintain your email history.</li>
              <li><strong className="text-neutral-200">Payment Data:</strong> Payment details are securely processed directly by our Merchant of Record (Lemon Squeezy / PayPal). We do not store full credit card numbers on our servers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. How We Use Information</h2>
            <p className="text-neutral-400 mb-2">We use the collected data to:</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-2">
              <li>Provide, operate, and maintain the WriteYourEmail service.</li>
              <li>Process AI requests via third-party API providers (Groq/Llama models).</li>
              <li>Track daily usage limits for Free and Pro tiers.</li>
              <li>Send critical account updates or billing receipts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Data Sharing and Third Parties</h2>
            <p className="text-neutral-400">
              We do not sell, trade, or rent your personal information to third parties. Text prompts entered into the generator are transmitted securely to our AI inference partners solely to produce the requested email output.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Data Retention & Security</h2>
            <p className="text-neutral-400">
              Your saved email history remains in your private account until you delete your account or requests are removed. We enforce industry-standard Row Level Security (RLS) via Supabase to ensure only you have access to your saved records.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Contact Us</h2>
            <p className="text-neutral-400">
              If you have any questions regarding this Privacy Policy, please reach out to us at{" "}
              <span className="text-white font-mono">support@writeyouremail.com</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}