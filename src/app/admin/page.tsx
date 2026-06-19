"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getBrowserSupabase, supabaseConfigured } from "@/lib/supabase";
import { adminListAll, adminDelete, adminLeads, adminMarkLead, triggerRevalidate, type LeadRow } from "@/lib/admin";
import { VERTICAL_BY_DB } from "@/lib/site";
import type { Listing } from "@/lib/types";
import ListingForm from "@/components/admin/ListingForm";
import SettingsTab from "@/components/admin/SettingsTab";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) { setReady(true); return; }
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured) return <SetupNotice />;
  if (!ready) return <Centered>Loading…</Centered>;
  if (!session) return <Login />;
  return <Dashboard email={session.user.email ?? ""} />;
}

/* ───────────────────────── Setup notice ───────────────────────── */
function SetupNotice() {
  return (
    <Centered>
      <div className="max-w-md rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-8 text-center shadow-[var(--shadow-soft)]">
        <h1 className="text-xl font-bold text-[var(--color-ink)]">Admin not connected yet</h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Add your Supabase project URL and anon key to <code className="rounded bg-[var(--color-surface)] px-1">.env.local</code>,
          run <code className="rounded bg-[var(--color-surface)] px-1">supabase-schema.sql</code>, create a public
          <code className="rounded bg-[var(--color-surface)] px-1"> listings</code> Storage bucket, and add an owner user in
          Supabase Auth. Then this panel goes live.
        </p>
      </div>
    </Centered>
  );
}

/* ───────────────────────── Login ───────────────────────── */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const sb = getBrowserSupabase()!;
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
    setBusy(false);
  }

  return (
    <Centered>
      <form onSubmit={submit} className="w-full max-w-sm rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-8 shadow-[var(--shadow-soft)]">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">Allan Admin</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Sign in to manage listings &amp; leads.</p>
        {err && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{err}</p>}
        <div className="mt-5 flex flex-col gap-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={fieldCls} />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={fieldCls} />
          <button disabled={busy} className="rounded-xl bg-[var(--color-sky)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-sky-hover)] disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </Centered>
  );
}

/* ───────────────────────── Dashboard ───────────────────────── */
function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<"listings" | "leads" | "settings">("listings");
  async function signOut() { await getBrowserSupabase()!.auth.signOut(); }

  return (
    <div className="min-h-dvh bg-[var(--color-surface)] pt-24 pb-16">
      <div className="container-x">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-ink)]">Dashboard</h1>
            <p className="text-sm text-[var(--color-muted)]">{email}</p>
          </div>
          <button onClick={signOut} className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-pink)] hover:text-[var(--color-pink)]">
            Sign out
          </button>
        </div>

        <div className="mb-6 inline-flex rounded-full border border-[var(--color-line)] bg-white p-1">
          {(["listings", "leads", "settings"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors ${tab === t ? "bg-[var(--color-sky)] text-white" : "text-[var(--color-ink-soft)]"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "listings" ? <ListingsManager /> : tab === "leads" ? <LeadsManager /> : <SettingsTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Listings manager ───────────────────────── */
function ListingsManager() {
  const [items, setItems] = useState<Listing[]>([]);
  const [editing, setEditing] = useState<Listing | "new" | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try { setItems(await adminListAll()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed to load."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function remove(id: string) {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    await adminDelete(id);
    await triggerRevalidate();
    load();
  }

  if (editing) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-ink)]">{editing === "new" ? "New listing" : "Edit listing"}</h2>
        <ListingForm
          initial={editing === "new" ? undefined : editing}
          onSaved={() => { setEditing(null); load(); }}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted)]">{items.length} listings</p>
        <button onClick={() => setEditing("new")} className="rounded-full bg-[var(--color-pink)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-pink)] transition-transform hover:-translate-y-0.5">
          + New listing
        </button>
      </div>
      {err && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{err}</p>}
      {loading ? (
        <Centered>Loading listings…</Centered>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white">
          {items.map((l) => (
            <div key={l.id} className="flex items-center justify-between gap-4 border-b border-[var(--color-line)] px-4 py-3 last:border-0">
              <div className="min-w-0">
                <p className="truncate font-semibold text-[var(--color-ink)]">{l.title}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {VERTICAL_BY_DB[l.vertical]?.short} · {l.location} · {l.price_label} · {l.status}{l.featured ? " · ★" : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => setEditing(l)} className="rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink)] hover:border-[var(--color-sky)]">Edit</button>
                <button onClick={() => remove(l.id)} className="rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-xs font-semibold text-red-500 hover:border-red-400">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="px-4 py-8 text-center text-sm text-[var(--color-muted)]">No listings yet. Add your first one.</p>}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Leads manager ───────────────────────── */
function LeadsManager() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try { setLeads(await adminLeads()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed to load."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function toggle(l: LeadRow) {
    await adminMarkLead(l.kind, l.id, !l.handled);
    load();
  }

  if (loading) return <Centered>Loading leads…</Centered>;
  if (err) return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{err}</p>;

  return (
    <div className="flex flex-col gap-3">
      {leads.map((l) => (
        <div key={l.kind + l.id} className={`rounded-[var(--radius-card)] border bg-white p-4 ${l.handled ? "border-[var(--color-line)] opacity-60" : "border-[color-mix(in_srgb,var(--color-sky)_40%,transparent)] shadow-[var(--shadow-soft)]"}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${LEAD_BADGE[l.kind]}`}>
                {LEAD_LABEL[l.kind]}
              </span>
              {l.kind === "alert" ? (
                <>
                  <p className="mt-2 font-semibold text-[var(--color-ink)]">
                    <a href={l.contact?.includes("@") ? `mailto:${l.contact}` : `tel:${l.contact}`} className="text-[var(--color-sky)]">{l.contact}</a>
                    <span className="text-[var(--color-muted)]"> · via {l.channel}</span>
                  </p>
                  <p className="text-sm text-[var(--color-ink-soft)]">Wants: <b>{l.vertical ?? "any"}</b>{l.location ? <> in <b>{l.location}</b></> : null}{l.max_price ? <> under RWF {Number(l.max_price).toLocaleString()}</> : null}</p>
                </>
              ) : (
                <>
                  <p className="mt-2 font-semibold text-[var(--color-ink)]">{l.name} · <a href={`tel:${l.phone}`} className="text-[var(--color-sky)]">{l.phone}</a></p>
                  <p className="text-sm text-[var(--color-ink-soft)]">{l.listing_title ? <>Re: <b>{l.listing_title}</b>. </> : null}{l.message}</p>
                </>
              )}
              <p className="mt-1 text-xs text-[var(--color-muted)]">{new Date(l.created_at).toLocaleString()}</p>
            </div>
            <button onClick={() => toggle(l)} className="shrink-0 rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink)] hover:border-[var(--color-sky)]">
              {l.handled ? "Reopen" : "Mark done"}
            </button>
          </div>
        </div>
      ))}
      {leads.length === 0 && <Centered>No leads yet.</Centered>}
    </div>
  );
}

/* ───────────────────────── shared ───────────────────────── */
const LEAD_LABEL: Record<LeadRow["kind"], string> = {
  inquiry: "Buyer inquiry",
  video_tour: "Video tour request",
  concierge: "Find-it-for-me",
  alert: "Listing alert",
};
const LEAD_BADGE: Record<LeadRow["kind"], string> = {
  inquiry: "bg-[var(--color-sky-soft)] text-[var(--color-sky-hover)]",
  video_tour: "bg-[var(--color-pink-soft)] text-[var(--color-pink-hover)]",
  concierge: "bg-[#E7F7EF] text-[#1FA971]",
  alert: "bg-[var(--color-surface)] text-[var(--color-ink-soft)]",
};

const fieldCls = "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]";

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-[60vh] place-items-center px-4 pt-24 text-sm text-[var(--color-muted)]">{children}</div>;
}
