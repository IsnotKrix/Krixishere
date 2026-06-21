import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service — Krix",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-3">Legal</p>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground text-sm mt-2 font-mono">Last updated: June 14, 2026</p>
        </div>

        <div className="space-y-8 text-[15px] text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">1. Acceptance of Terms</h2>
            <p>
              By accessing and using krixishere.org (the "Service"), you agree to be bound
              by these Terms of Service. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">2. Eligibility</h2>
            <p>
              You must be at least 13 years of age to use this Service. By using the Service,
              you represent and warrant that you meet this requirement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">3. Use of the Service</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground pl-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Transmit any harmful, offensive, or disruptive content</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">4. Intellectual Property</h2>
            <p>
              All content, code, design, and materials on this Service are the property of
              Krix (krixishere.org) unless otherwise noted. You may not reproduce, distribute,
              or create derivative works without explicit written permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">5. Third-Party Services</h2>
            <p>
              The Service uses Discord for authentication. Your use of Discord is governed
              by Discord's own Terms of Service and Privacy Policy, which are separate from
              these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">6. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" without warranties of any kind, either express
              or implied. We do not guarantee that the Service will be uninterrupted, error-free,
              or secure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, Krix shall not be liable for
              any indirect, incidental, special, or consequential damages arising from your use
              of the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">8. Modifications</h2>
            <p>
              We reserve the right to modify or discontinue the Service at any time without
              prior notice. We may also update these Terms at any time; continued use of the
              Service constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">9. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the
              Republic of Poland. Any disputes shall be subject to the exclusive jurisdiction
              of the courts of Poland.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground font-semibold text-lg">10. Contact</h2>
            <p>
              For any questions regarding these Terms, please contact us through krixishere.org.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex gap-4">
          <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono">
            Privacy Policy →
          </a>
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
