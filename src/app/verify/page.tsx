"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAuthentication } from "@simplewebauthn/browser";
import { Key, Loader2, ShieldCheck } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setVerifying(true);
    setError(null);
    try {
      // 1. Get authentication options from server
      const optRes = await fetch("/api/passkeys/auth-options", { method: "POST" });
      if (!optRes.ok) throw new Error((await optRes.json()).error);
      const options = await optRes.json();

      // 2. Browser prompts for biometric/PIN
      const authResponse = await startAuthentication(options);

      // 3. Verify on server — sets x-tfa cookie on success
      const verRes = await fetch("/api/passkeys/auth-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: authResponse }),
      });
      if (!verRes.ok) throw new Error((await verRes.json()).error);

      // Redirect to home (or wherever the user was going — relative paths only)
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("from") ?? "/";
      const to = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
      router.push(to);
      router.refresh();
    } catch (e) {
      const msg = (e as Error).message;
      if (!msg.toLowerCase().includes("cancel") && !msg.toLowerCase().includes("abort")) {
        setError(msg);
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <ShieldCheck size={36} className="text-violet-400" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-3">
            Two-factor verification
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Your account is protected by a passkey.
            <br />
            Verify your identity to continue.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={verifying}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:scale-100"
        >
          {verifying ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Key size={16} />
          )}
          {verifying ? "Verifying…" : "Verify with passkey"}
        </button>

        <p className="text-center text-xs text-zinc-600 mt-4">
          Uses your device fingerprint, face ID, or PIN
        </p>
      </div>
    </div>
  );
}
