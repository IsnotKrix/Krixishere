import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — Krix",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-3">Legal</p>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mt-2 font-mono">Last updated: June 21, 2026</p>
        </div>

        <div className="mb-8 rounded-[var(--radius)] border border-border bg-card px-5 py-4 space-y-2">
          <p className="text-sm font-semibold text-foreground font-mono">We do NOT collect</p>
          <ul className="space-y-1">
            {["Passwords or any credentials", "IP address", "Location data", "Device fingerprints", "Browsing history", "Marketing data"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-muted-foreground/50 text-xs font-mono">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8 text-[15px] text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">1. Data Controller</h2>
            <p>
              The controller of your personal data is Krix, operating krixishere.org, based in
              Poland. For questions or requests regarding your data, contact us through the website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">2. Authentication Provider — Clerk</h2>
            <p>
              Authentication on this Service is handled by{" "}
              <a href="https://clerk.com" target="_blank" rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground underline underline-offset-2 transition-colors">
                Clerk, Inc.
              </a>{" "}
              (clerk.com), a third-party authentication platform. When you sign in with Discord,
              Clerk manages the OAuth flow, stores your session, and provides your identity to this website.
              Clerk's data handling is governed by their{" "}
              <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground underline underline-offset-2 transition-colors">
                Privacy Policy
              </a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">3. What Data We Collect</h2>
            <p>
              When you sign in with Discord via Clerk, we receive and may store the following data:
            </p>
            <ul className="space-y-2 mt-2">
              {[
                { label: "Discord Username", desc: "Your publicly visible Discord display name" },
                { label: "Discord Avatar", desc: "The URL of your Discord profile picture" },
                { label: "Discord User ID", desc: "A unique numeric identifier assigned by Discord" },
                { label: "Clerk User ID", desc: "A unique identifier assigned by Clerk to your account" },
                { label: "Email address (optional)", desc: "Only if provided through the Clerk sign-up flow" },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3 bg-card border border-border rounded-[var(--radius)] px-4 py-3">
                  <span className="text-foreground/50 mt-0.5 font-mono">✓</span>
                  <div>
                    <p className="text-foreground text-sm font-medium">{item.label}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">4. Purpose of Processing</h2>
            <p>
              Your data is processed exclusively for the purpose of authentication —
              verifying your identity to grant access to features of the Service such as the
              admin panel. It is not used for marketing, analytics, profiling, or any other purpose.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">5. Legal Basis (GDPR)</h2>
            <p>
              Processing of your personal data is based on your explicit consent in accordance
              with Article 6(1)(a) of the General Data Protection Regulation (GDPR / RODO).
              You provide this consent by accepting these terms before signing in.
            </p>
            <p>
              You may withdraw your consent at any time by signing out and requesting account
              deletion. Withdrawal does not affect the lawfulness of prior processing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">6. Data Retention</h2>
            <p>
              Your account data is stored by Clerk for as long as your account remains active.
              You may request deletion of your Clerk account and all associated data at any time
              by contacting us. We do not maintain independent user databases beyond what Clerk
              provides.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">7. Data Sharing</h2>
            <p>
              We do not sell, trade, or share your personal data with any third parties for
              commercial purposes. The external services involved in authentication are:
            </p>
            <ul className="space-y-2 mt-2">
              {[
                { name: "Clerk, Inc.", desc: "Authentication platform — stores your session and identity", url: "https://clerk.com/privacy" },
                { name: "Discord", desc: "OAuth identity provider — you sign in using your Discord account", url: "https://discord.com/privacy" },
              ].map((item) => (
                <li key={item.name} className="flex items-start gap-3 bg-card border border-border rounded-[var(--radius)] px-4 py-3">
                  <div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="text-foreground text-sm font-medium underline underline-offset-2 hover:text-foreground/70 transition-colors">
                      {item.name}
                    </a>
                    <p className="text-muted-foreground text-xs mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">8. Your Rights Under GDPR</h2>
            <p>Under the GDPR, you have the right to:</p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground pl-2">
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
            <h2 className="text-foreground font-semibold text-lg">9. Supervisory Authority</h2>
            <p>
              You have the right to lodge a complaint with the Polish supervisory authority
              for personal data protection:
            </p>
            <div className="bg-card border border-border rounded-[var(--radius)] px-4 py-3 mt-2">
              <p className="text-foreground text-sm font-medium">UODO</p>
              <p className="text-muted-foreground text-sm">Urząd Ochrony Danych Osobowych</p>
              <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground text-sm underline underline-offset-2 transition-colors">
                uodo.gov.pl
              </a>
            </div>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex gap-4">
          <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono">
            Terms of Service →
          </a>
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
