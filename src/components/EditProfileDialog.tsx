"use client";

import { useEffect, useId, useState } from "react";
import { useSession } from "next-auth/react";
import { startRegistration } from "@simplewebauthn/browser";
import { ImagePlus, Key, Loader2, Plus, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLimit } from "@/components/hooks/use-character-limit";
import { useImageUpload } from "@/components/hooks/use-image-upload";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PasskeyRow {
  id: string;
  device_name: string | null;
  created_at: string;
}

interface ProfileData {
  display_name: string | null;
  bio: string | null;
  website: string | null;
}

// ─── Avatar upload widget ─────────────────────────────────────────────────────

function AvatarWidget({ defaultSrc }: { defaultSrc?: string | null }) {
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } = useImageUpload();
  const current = previewUrl ?? defaultSrc;

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
        {current ? (
          <img src={current} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-500 text-xl font-semibold select-none">
            K
          </div>
        )}
        <button
          type="button"
          onClick={handleThumbnailClick}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-full"
          aria-label="Change avatar"
        >
          <ImagePlus size={16} className="text-white" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </div>
      <div className="text-xs text-zinc-500 leading-relaxed">
        Click to change avatar.<br />
        JPG, PNG or GIF — max 2 MB.
      </div>
    </div>
  );
}

// ─── Profile tab ──────────────────────────────────────────────────────────────

function ProfileTab({ onSaved }: { onSaved: () => void }) {
  const { data: session } = useSession();
  const id = useId();
  const [profile, setProfile] = useState<ProfileData>({ display_name: null, bio: null, website: null });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bioLimit = useCharacterLimit({ maxLength: 180, initialValue: "" });

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data: ProfileData) => {
        setProfile(data);
        if (data.bio) bioLimit.handleChange({ target: { value: data.bio } } as never);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: profile.display_name,
          bio: bioLimit.value,
          website: profile.website,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to save");
      }
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <AvatarWidget defaultSrc={session?.user?.image} />

      <div className="space-y-2">
        <Label htmlFor={`${id}-name`}>Display name</Label>
        <Input
          id={`${id}-name`}
          placeholder={session?.user?.name ?? "Your name"}
          value={profile.display_name ?? ""}
          onChange={(e) => setProfile((p) => ({ ...p, display_name: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${id}-website`}>Website</Label>
        <div className="flex rounded-lg overflow-hidden border border-white/10 focus-within:border-violet-500/60 focus-within:ring-[3px] focus-within:ring-violet-500/20 transition-shadow">
          <span className="inline-flex items-center px-3 text-xs text-zinc-500 bg-white/[0.02] border-r border-white/10 shrink-0">
            https://
          </span>
          <input
            id={`${id}-website`}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
            placeholder="yourwebsite.com"
            value={profile.website?.replace(/^https?:\/\//, "") ?? ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, website: e.target.value ? `https://${e.target.value}` : "" }))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${id}-bio`}>Bio</Label>
        <Textarea
          id={`${id}-bio`}
          placeholder="A few sentences about yourself…"
          value={bioLimit.value}
          maxLength={180}
          onChange={bioLimit.handleChange}
          rows={3}
        />
        <p className="text-right text-xs text-zinc-600" role="status" aria-live="polite">
          <span className="tabular-nums">{bioLimit.maxLength - bioLimit.characterCount}</span> chars left
        </p>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <DialogFooter>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save changes
        </Button>
      </DialogFooter>
    </div>
  );
}

// ─── Passkeys tab ─────────────────────────────────────────────────────────────

function PasskeysTab() {
  const [passkeys, setPasskeys] = useState<PasskeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadPasskeys = async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/passkeys").then((r) => r.json());
      setPasskeys(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load passkeys.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPasskeys(); }, []);

  const handleAdd = async () => {
    setAdding(true);
    setError(null);
    setSuccess(null);
    try {
      // 1. Get registration options from server
      const optRes = await fetch("/api/passkeys/register-options", { method: "POST" });
      if (!optRes.ok) throw new Error((await optRes.json()).error);
      const options = await optRes.json();

      // 2. Browser prompts for biometric/PIN
      const registrationResponse = await startRegistration({ optionsJSON: options });

      // 3. Verify and save on server
      const verRes = await fetch("/api/passkeys/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: registrationResponse,
          deviceName: detectDeviceName(),
        }),
      });
      if (!verRes.ok) throw new Error((await verRes.json()).error);

      setSuccess("Passkey added successfully!");
      await loadPasskeys();
    } catch (e) {
      const msg = (e as Error).message;
      // User cancelled the prompt — don't show as error
      if (!msg.includes("cancelled") && !msg.includes("abort") && !msg.includes("user")) {
        setError(msg);
      }
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch("/api/passkeys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setPasskeys((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-500 leading-relaxed">
        Passkeys let you sign in with your fingerprint, face, or device PIN — no password needed.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 size={14} className="animate-spin" /> Loading…
        </div>
      ) : passkeys.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-6 text-center">
          <Key size={28} className="mx-auto mb-2 text-zinc-600" />
          <p className="text-sm text-zinc-500">No passkeys yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {passkeys.map((pk) => (
            <li
              key={pk.id}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Key size={16} className="text-violet-400 shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">{pk.device_name ?? "Passkey"}</p>
                  <p className="text-xs text-zinc-600">
                    Added {new Date(pk.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(pk.id)}
                disabled={deletingId === pk.id}
                className="rounded-lg p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                aria-label="Delete passkey"
              >
                {deletingId === pk.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
      {success && <p className="text-xs text-violet-400">{success}</p>}

      <Button
        onClick={handleAdd}
        disabled={adding}
        variant="outline"
        className="w-full border-white/10 text-zinc-300 hover:text-white hover:border-white/20"
      >
        {adding ? (
          <Loader2 size={14} className="mr-2 animate-spin" />
        ) : (
          <Plus size={14} className="mr-2" />
        )}
        Add passkey
      </Button>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectDeviceName(): string {
  if (typeof navigator === "undefined") return "Passkey";
  const ua = navigator.userAgent;
  if (/iPhone|iPad/.test(ua)) return "iPhone / iPad";
  if (/Android/.test(ua)) return "Android device";
  if (/Mac/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows PC";
  return "Passkey";
}

// ─── Main dialog ──────────────────────────────────────────────────────────────

const TABS = ["Profile", "Passkeys"] as const;
type Tab = (typeof TABS)[number];

export function EditProfileDialog({
  open,
  onOpenChange,
  initialTab = "Profile",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);

  // Reset to initialTab whenever the dialog opens
  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-md gap-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>Account settings</DialogTitle>
          <DialogDescription className="sr-only">
            Edit your profile and manage passkeys.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b border-white/5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
                tab === t
                  ? "text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-violet-400" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {tab === "Profile" ? (
            <ProfileTab onSaved={() => onOpenChange(false)} />
          ) : (
            <PasskeysTab />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
