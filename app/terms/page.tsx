import Link from "next/link";

export default function TermsAndConditions() {
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
          <Link href="/" className="text-xs text-neutral-400 hover:text-white transition">
            ← Back to App
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-xs text-neutral-500 mb-8">Last updated: February 2026</p>

        <div className="space-y-8 text-neutral-300 text-sm leading-relaxed border-t border-neutral-900 pt-8">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Agreement to Terms</h2>
            <p className="text-neutral-400">
              By accessing or using WriteYourEmail.com, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Description of Service</h2>
            <p className="text-neutral-400">
              WriteYourEmail is an AI-assisted text generation utility. Users provide contextual inputs, and the service generates email drafts. The service is offered under free usage tiers and a paid Pro subscription tier ($9/month).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. User Responsibilities & Acceptable Use</h2>
            <p className="text-neutral-400 mb-2">
              You agree not to use the service to generate:
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-2">
              <li>Unsolicited bulk email (spam), phishing attempts, or deceptive messaging.</li>
              <li>Harassing, defamatory, or unlawful communication.</li>
              <li>Malicious content targeting individuals or organizations.</li>
            </ul>
            <p className="text-neutral-400 mt-2">
              You retain final responsibility for reviewing and verifying all generated email drafts before sending them to any recipient.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Subscriptions, Payments & Cancellations</h2>
            <p className="text-neutral-400">
              Pro subscriptions are billed on a recurring monthly basis ($9.00 USD) processed securely through Lemon Squeezy. You may cancel your subscription at any time via your billing receipt link or customer portal. Cancellations take effect at the end of the current billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Disclaimer of Liability</h2>
            <p className="text-neutral-400">
              WriteYourEmail is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that AI-generated outputs will always be error-free or perfectly suited for every professional situation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Contact Information</h2>
            <p className="text-neutral-400">
              Questions regarding these Terms should be directed to{" "}
              <span className="text-white font-mono">support@writeyouremail.com</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}