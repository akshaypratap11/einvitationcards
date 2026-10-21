"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { RsvpRecord } from "@/types/card";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function RsvpDashboardPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-festive-wine text-festive-gold flex items-center justify-center font-serif text-xl">
          <div className="flex flex-col items-center gap-3">
            <span className="text-3xl animate-spin">🪔</span>
            <span>Loading guest RSVPs...</span>
          </div>
        </div>
      }
    >
      <RsvpDashboardContent slug={params.slug} />
    </Suspense>
  );
}

function RsvpDashboardContent({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardTitle, setCardTitle] = useState<string>("Invitation");
  const [rsvps, setRsvps] = useState<RsvpRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "attending" | "declined">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/rsvp?slug=${encodeURIComponent(slug)}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to load RSVPs");
        }

        const data = json.card?.data || {};
        const title =
          data.groomName && data.brideName
            ? `${data.groomName} & ${data.brideName}`
            : data.personName
            ? `${data.personName}'s Celebration`
            : data.functionName || "Special Event";

        setCardTitle(title);
        setRsvps(json.rsvps || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load guest list");
      } finally {
        setLoading(false);
      }
    };

    fetchRsvps();
  }, [slug]);

  // Derived statistics
  const stats = useMemo(() => {
    let totalConfirmed = 0;
    let attendingCount = 0;
    let declinedCount = 0;

    for (const r of rsvps) {
      if (r.attending) {
        attendingCount++;
        totalConfirmed += r.guests_count || 1;
      } else {
        declinedCount++;
      }
    }

    return {
      totalResponses: rsvps.length,
      totalConfirmed,
      attendingCount,
      declinedCount,
    };
  }, [rsvps]);

  // Filtered RSVPs
  const filteredRsvps = useMemo(() => {
    return rsvps.filter((r) => {
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "attending"
          ? r.attending
          : !r.attending;

      const matchesSearch =
        !searchTerm.trim() ||
        r.guest_name.toLowerCase().includes(searchTerm.toLowerCase().trim());

      return matchesFilter && matchesSearch;
    });
  }, [rsvps, filter, searchTerm]);

  // Download CSV export
  const downloadCsv = () => {
    if (rsvps.length === 0) return;

    const headers = ["Guest Name", "Status", "Number of Guests", "Date Submitted"];
    const rows = rsvps.map((r) => [
      `"${r.guest_name.replace(/"/g, '""')}"`,
      r.attending ? "Attending" : "Declined",
      r.attending ? r.guests_count || 1 : 0,
      `"${new Date(r.created_at).toLocaleString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rsvps-${slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-festive-wine text-festive-cream p-4 sm:p-8 festive-pattern-bg">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-festive-gold/30">
          <div>
            <Link
              href={`/c/${slug}`}
              className="text-xs text-festive-gold hover:underline flex items-center gap-1.5 mb-1"
            >
              <span>←</span>
              <span>Back to Public Invitation Card</span>
            </Link>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-festive-goldLight">
              RSVP Guest List • {cardTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/edit/${slug}`}
              className="px-3.5 py-2 rounded-xl bg-festive-maroon border border-festive-gold/40 text-xs font-semibold text-festive-goldLight hover:bg-festive-gold hover:text-festive-wine transition-all"
            >
              ✏️ Edit Card
            </Link>
            <Link
              href={`/c/${slug}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-festive-gold text-festive-wine text-xs font-bold shadow-md hover:bg-festive-goldLight transition-all"
            >
              👁️ View Card
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="p-12 text-center rounded-3xl bg-festive-maroon/60 border border-festive-gold/20 space-y-3">
            <div className="w-10 h-10 border-4 border-festive-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-festive-gold">Loading guest RSVPs...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="p-8 text-center rounded-3xl bg-rose-950/60 border border-rose-500/40 space-y-3">
            <span className="text-3xl block">🔒</span>
            <h2 className="text-lg font-bold text-rose-300">Access Restricted</h2>
            <p className="text-xs text-rose-200/80 max-w-md mx-auto">{error}</p>
            <div className="pt-2">
              <Link
                href="/my-cards"
                className="inline-block px-4 py-2 rounded-xl bg-festive-gold text-festive-wine text-xs font-bold"
              >
                Go to My Cards
              </Link>
            </div>
          </div>
        )}

        {/* Loaded Content */}
        {!loading && !error && (
          <>
            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-festive-maroon/70 border border-festive-gold/30">
                <span className="text-xs uppercase tracking-wider text-festive-cream/70 block">
                  Total Responses
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-festive-goldLight block mt-1">
                  {stats.totalResponses}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30">
                <span className="text-xs uppercase tracking-wider text-emerald-300/80 block">
                  Confirmed Guests
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-300 block mt-1">
                  {stats.totalConfirmed}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-festive-maroon/70 border border-festive-gold/30">
                <span className="text-xs uppercase tracking-wider text-festive-cream/70 block">
                  Attending
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-400 block mt-1">
                  {stats.attendingCount}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-festive-maroon/70 border border-festive-gold/30">
                <span className="text-xs uppercase tracking-wider text-festive-cream/70 block">
                  Declined
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-rose-300 block mt-1">
                  {stats.declinedCount}
                </span>
              </div>
            </div>

            {/* Filter, Search & Export Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-festive-maroon/50 border border-festive-gold/20">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-festive-wine/80 p-1 rounded-xl border border-festive-gold/20 text-xs">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filter === "all"
                      ? "bg-festive-gold text-festive-wine font-bold shadow-sm"
                      : "text-festive-cream/70 hover:text-festive-cream"
                  }`}
                >
                  All ({stats.totalResponses})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("attending")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filter === "attending"
                      ? "bg-emerald-500 text-white font-bold shadow-sm"
                      : "text-festive-cream/70 hover:text-festive-cream"
                  }`}
                >
                  Attending ({stats.attendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("declined")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filter === "declined"
                      ? "bg-rose-500 text-white font-bold shadow-sm"
                      : "text-festive-cream/70 hover:text-festive-cream"
                  }`}
                >
                  Declined ({stats.declinedCount})
                </button>
              </div>

              {/* Search & CSV button */}
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <input
                  type="text"
                  placeholder="Search guest name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-festive-wine border border-festive-gold/30 text-xs text-festive-cream focus:outline-none focus:border-festive-gold w-full sm:w-48 placeholder:text-festive-cream/40"
                />

                <button
                  type="button"
                  onClick={downloadCsv}
                  disabled={rsvps.length === 0}
                  className="px-3.5 py-1.5 rounded-xl bg-festive-gold hover:bg-festive-goldLight text-festive-wine text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
                  title="Export guest list to CSV spreadsheet"
                >
                  <span>📥</span>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* RSVP Table */}
            <div className="rounded-2xl border border-festive-gold/30 overflow-hidden bg-festive-maroon/40 shadow-xl">
              {filteredRsvps.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <span className="text-3xl block">💌</span>
                  <p className="font-semibold text-festive-cream">No RSVPs found</p>
                  <p className="text-xs text-festive-cream/60">
                    {rsvps.length === 0
                      ? "Share your digital invitation with guests to start receiving RSVPs!"
                      : "No guests match your current filter or search criteria."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-festive-wine/90 border-b border-festive-gold/30 text-festive-gold font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Guest Name</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Guests Count</th>
                        <th className="py-3 px-4">Date Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-festive-gold/15">
                      {filteredRsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-festive-wine/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-festive-cream">
                            {rsvp.guest_name}
                          </td>
                          <td className="py-3.5 px-4">
                            {rsvp.attending ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-semibold">
                                <span>✓</span>
                                <span>Attending</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-[11px] font-semibold">
                                <span>✕</span>
                                <span>Declined</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-festive-cream/90 font-medium">
                            {rsvp.attending ? `${rsvp.guests_count || 1} guest(s)` : "—"}
                          </td>
                          <td className="py-3.5 px-4 text-festive-cream/60">
                            {new Date(rsvp.created_at).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
