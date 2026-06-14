import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — Krix",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="mb-10">
          <p className="text-xs font-medium text-violet-400 uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-zinc-500 text-sm mt-2">Last updated: June 14, 2026</p>
        </div>

        {/* What we do NOT collect — highlighted */}
        <div className="mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4 space-y-2">
          <p className="text-sm font-semibold text-emerald-400">We do NOT collect</p>
          <ul className="space-y-1">
            {["Email address", "IP address", "Password or any credentials", "Location data", "Device information", "Browser fingerprints", "Any other personal data"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="text-red-400 text-xs">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8 text-[15px] text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-white font-semibold text-lg">1. Data Controller</h2>
            <p>
              The controller of your personal data is Krix, operating krixishere.org, based in
              Poland. For any questions or requests regarding your data, please contact us
              through the website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white font-semibold text-lg">2. What Data We Collect</h2>
            <p>
              When you log in with Discord, we receive and process only the following data
              from Discord's OAuth service:
            </p>
            <ul className="space-y-2 mt-2">
              {[
                { label: "Discord Username", desc: "Your publicly visible Discord display name" },
                { label: "Discord Avatar", desc: "The URL of your Discord profile picture" },
                { label: "Discord User ID", desc: "A unique numeric identifier assigned by Discord" },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3 bg-white/[0.02] border border-white/[0.06] rounded-lg px-4 py-3">
                  <span className="text-violet-400 mt-0.5">✓</span>
                  <div>
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white font-semibold text-lg">3. Purpose of Processing</h2>
            <p>
              Your data is processed exclusively for the purpose of authentication —
              verifying your identity to grant access to certain features of the Service
              (e.g. the admin panel). It is not used for marketing, analytics, profiling,
              or any other purpose.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white font-semibold text-lg">4. Legal Basis (GDPR)</h2>
            <p>
              Processing of your personal data is based on your explicit consent in accordance
              with Article 6(1)(a) of the General Data Protection Regulation (GDPR / RODO).
              You provide this consent by accepting these terms before logging in.
            </p>
            <p>
              You may withdraw your consent at any time by logging out. Withdrawal of consent
              does not affect the lawfulness of processing carried out prior to withdrawal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white font-semibold text-lg">5. Data Retention</h2>
            <p>
              Your session data is stored in a secure, encrypted cookie for the duration of
              your session. We do not maintain a persistent database of user accounts or
              profiles. Logging out immediately ends all processing of your data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white font-semibold text-lg">6. Data Sharing</h2>
            <p>
              We do not sell, trade, or share your personal data with any third parties.
              The only external service involved is Discord, through which you authenticate.
              Their data handling is governed by{" "}
              <a
                href="https://discord.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:underline underline-offset-2"
              >
                Discord's Privacy Policy
              </a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white font-semibold text-lg">7. Your Rights Under GDPR</h2>
            <p>Under the GDPR, you have the right to:</p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li>Access the personal data we hold about you</li>
              <li>Rectify inaccurate or incomplete data</li>
              <li>Erase your data ("right to be forgotten")</li>
              <li>Restrict the processing of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us via krixishere.org.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white font-semibold text-lg">8. Supervisory Authority</h2>
            <p>
              You have the right to lodge a complaint with the Polish supervisory authority
              for personal data protection:
            </p>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg px-4 py-3 mt-2">
              <p className="text-white text-sm font-medium">UODO</p>
              <p className="text-zinc-400 text-sm">Urząd Ochrony Danych Osobowych</p>
              <a
                href="https://uodo.gov.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 text-sm hover:underline underline-offset-2"
              >
                uodo.gov.pl
              </a>
            </div>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] flex gap-4">
          <a href="/terms" className="text-sm text-violet-400 hover:underline underline-offset-2">
            Terms of Service →
          </a>
          <a href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
