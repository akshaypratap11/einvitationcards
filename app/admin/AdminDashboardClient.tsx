"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CardRequestRecord, CardRecord, RequestStatus } from "@/types/card";
import { formatDisplayDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/browser";

interface AdminDashboardClientProps {
  initialRequests: CardRequestRecord[];
  initialCards: CardRecord[];
}

export default function AdminDashboardClient({
  initialRequests,
  initialCards,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "requests" | "cards" | "stats") || "requests";

  const [activeTab, setActiveTab] = useState<"requests" | "cards" | "stats">(initialTab);
  const [requests, setRequests] = useState<CardRequestRecord[]>(initialRequests);
  const [cards, setCards] = useState<CardRecord[]>(initialCards);

  // Filters & Search
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>("all");
  const [requestTypeFilter, setRequestTypeFilter] = useState<string>("all");
  const [requestSearch, setRequestSearch] = useState("");

  const [cardTypeFilter, setCardTypeFilter] = useState<string>("all");
  const [cardSearch, setCardSearch] = useState("");

  // Drawer / Modal for selected request
  const [selectedRequest, setSelectedRequest] = useState<CardRequestRecord | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Notifications
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Sync state if URL tab changes
  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "requests" || t === "cards" || t === "stats") {
      setActiveTab(t);
    }
  }, [searchParams]);

  // Count new requests for badge
  const newRequestsCount = useMemo(() => {
    return requests.filter((r) => r.status === "new").length;
  }, [requests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (requestStatusFilter !== "all" && r.status !== requestStatusFilter) {
        return false;
      }
      if (requestTypeFilter !== "all" && r.type !== requestTypeFilter) {
        return false;
      }
      if (requestSearch.trim()) {
        const s = requestSearch.toLowerCase().trim();
        const matchesName = r.name.toLowerCase().includes(s);
        const matchesPhone = r.phone.toLowerCase().includes(s);
        const matchesCity = (r.city || "").toLowerCase().includes(s);
        if (!matchesName && !matchesPhone && !matchesCity) return false;
      }
      return true;
    });
  }, [requests, requestStatusFilter, requestTypeFilter, requestSearch]);

  // Filtered cards
  const filteredCards = useMemo(() => {
    return cards.filter((c) => {
      if (cardTypeFilter !== "all" && c.type !== cardTypeFilter) {
        return false;
      }
      if (cardSearch.trim()) {
        const s = cardSearch.toLowerCase().trim();
        const cust = (c.customer_name || "").toLowerCase();
        const slug = (c.slug || "").toLowerCase();
        const title = (
          c.data?.groomName ||
          c.data?.personName ||
          c.data?.familyName ||
          ""
        ).toLowerCase();
        if (!cust.includes(s) && !slug.includes(s) && !title.includes(s)) {
          return false;
        }
      }
      return true;
    });
  }, [cards, cardTypeFilter, cardSearch]);

  const checkUnauthorized = (res: Response) => {
    if (res.status === 401) {
      showToast("Session expired, please log in again");
      setTimeout(() => {
        router.push("/admin/login");
      }, 1000);
      return true;
    }
    return false;
  };

  // Refresh data from server
  const refreshRequests = async () => {
    try {
      const res = await fetch("/api/requests");
      if (checkUnauthorized(res)) return;
      const json = await res.json();
      if (res.ok && json.requests) {
        setRequests(json.requests);
      }
    } catch {
      // Ignore
    }
  };

  const refreshCards = async () => {
    try {
      const res = await fetch("/api/cards");
      if (checkUnauthorized(res)) return;
      const json = await res.json();
      if (res.ok && json.cards) {
        setCards(json.cards);
      }
    } catch {
      // Ignore
    }
  };

  // Open drawer
  const handleOpenRequest = (req: CardRequestRecord) => {
    setSelectedRequest(req);
    setAdminNoteInput(req.admin_note || "");
  };

  // Update request status
  const handleUpdateStatus = async (id: string, newStatus: RequestStatus) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (checkUnauthorized(res)) return;
      if (res.ok) {
        await res.json();
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast(`Status updated to '${newStatus}'`);
      }
    } catch {
      showToast("Failed to update status.");
    }
  };

  // Save admin note
  const handleSaveAdminNote = async (id: string) => {
    setIsSavingNote(true);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_note: adminNoteInput }),
      });
      if (checkUnauthorized(res)) return;
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, admin_note: adminNoteInput } : r))
        );
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest((prev) => (prev ? { ...prev, admin_note: adminNoteInput } : null));
        }
        showToast("Admin note saved.");
      }
    } catch {
      showToast("Failed to save note.");
    } finally {
      setIsSavingNote(false);
    }
  };

  // Delete request
  const handleDeleteRequest = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer request?")) {
      return;
    }
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "DELETE",
      });
      if (checkUnauthorized(res)) return;
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        if (selectedRequest?.id === id) {
          setSelectedRequest(null);
        }
        showToast("Request deleted.");
      }
    } catch {
      showToast("Failed to delete request.");
    }
  };

  // Duplicate card
  const handleDuplicateCard = async (slug: string) => {
    try {
      const res = await fetch(`/api/cards/${slug}?action=duplicate`, {
        method: "POST",
      });
      if (checkUnauthorized(res)) return;
      const json = await res.json();
      if (res.ok && json.card) {
        showToast("Card duplicated successfully!");
        refreshCards();
      } else {
        showToast(json.error || "Failed to duplicate card.");
      }
    } catch {
      showToast("Error duplicating card.");
    }
  };

  // Toggle publish
  const handleTogglePublish = async (slug: string, currentPublished: boolean) => {
    const nextState = !currentPublished;
    try {
      const res = await fetch(`/api/cards/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: nextState }),
      });
      if (checkUnauthorized(res)) return;
      if (res.ok) {
        setCards((prev) =>
          prev.map((c) =>
            c.slug === slug ? { ...c, is_published: nextState } : c
          )
        );
        showToast(nextState ? "Card published!" : "Card unpublished.");
      }
    } catch {
      showToast("Failed to change publish status.");
    }
  };

  // Delete card
  const handleDeleteCard = async (slug: string) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete card '${slug}'? All associated uploaded photos will also be deleted from storage.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/cards/${slug}`, {
        method: "DELETE",
      });
      if (checkUnauthorized(res)) return;
      if (res.ok) {
        setCards((prev) => prev.filter((c) => c.slug !== slug));
        showToast("Card and storage photos deleted.");
      } else {
        const json = await res.json();
        showToast(json.error || "Failed to delete card.");
      }
    } catch {
      showToast("Failed to delete card.");
    }
  };

  // Copy link
  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`);
    } catch {
      showToast("Could not copy to clipboard.");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const getCleanPhone = (p: string) => {
    let clean = p.replace(/\D/g, "");
    if (!clean.startsWith("91") && clean.length === 10) {
      clean = "91" + clean;
    }
    return clean;
  };

  // Approximate storage calculation
  const totalPhotosUploaded = useMemo(() => {
    let count = 0;
    cards.forEach((c) => {
      const d = c.data;
      if (d) {
        if (d.heroPhoto) count++;
        if (d.groomPhoto) count++;
        if (d.bridePhoto) count++;
        if (Array.isArray(d.gallery)) count += d.gallery.length;
        if (Array.isArray(d.events)) {
          d.events.forEach((e) => {
            if (e.photo) count++;
          });
        }
      }
    });
    return count;
  }, [cards]);

  const approxStorageMB = (totalPhotosUploaded * 0.35).toFixed(1);

  return (
    <div className="min-h-screen bg-festive-wine text-festive-cream font-sans pb-20">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] px-5 py-3 rounded-2xl bg-festive-gold text-festive-wine font-bold text-xs sm:text-sm shadow-gold-glow animate-bounce">
          {toast}
        </div>
      )}

      {/* ADMIN TOP NAV */}
      <header className="sticky top-0 z-40 bg-festive-maroonDark/90 backdrop-blur-md border-b border-festive-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-festive-wine border border-festive-gold/60 flex items-center justify-center text-xl shadow-inner">
              🪔
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg sm:text-xl text-festive-goldLight">
                  निमंत्रण Admin
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/30">
                  Console
                </span>
              </div>
              <p className="text-[11px] text-festive-cream/60">
                Celebration Management & Creation Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-festive-gold/30 text-xs text-festive-goldLight hover:bg-festive-wine transition-colors"
            >
              <span>👁️</span>
              <span>View Public Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg bg-festive-wine/80 hover:bg-red-900/60 border border-festive-gold/30 text-xs text-festive-cream/80 hover:text-red-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-6 border-t border-festive-gold/10">
          <button
            onClick={() => setActiveTab("requests")}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "requests"
                ? "border-festive-gold text-festive-goldLight"
                : "border-transparent text-festive-cream/70 hover:text-festive-gold"
            }`}
          >
            <span>📥 Requests</span>
            {newRequestsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] animate-pulse">
                {newRequestsCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("cards")}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "cards"
                ? "border-festive-gold text-festive-goldLight"
                : "border-transparent text-festive-cream/70 hover:text-festive-gold"
            }`}
          >
            <span>📜 Cards</span>
            <span className="px-2 py-0.5 rounded-full bg-festive-maroon border border-festive-gold/40 text-festive-goldLight text-[10px]">
              {cards.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "stats"
                ? "border-festive-gold text-festive-goldLight"
                : "border-transparent text-festive-cream/70 hover:text-festive-gold"
            }`}
          >
            <span>📊 Stats</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ================= TAB 1: REQUESTS ================= */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            {/* Header + Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-festive-maroon/60 border border-festive-gold/30 p-4 sm:p-6 rounded-2xl">
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-festive-cream">
                  Customer Inquiries & Applications
                </h1>
                <p className="text-xs text-festive-cream/70 mt-0.5">
                  Click any request to view answers, open WhatsApp, or generate an invitation card.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search name, phone, city..."
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-festive-wine/90 border border-festive-gold/30 text-xs text-festive-cream placeholder-festive-cream/40 focus:outline-none focus:border-festive-gold"
                />

                <select
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-festive-wine/90 border border-festive-gold/30 text-xs text-festive-cream focus:outline-none focus:border-festive-gold"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New ({newRequestsCount})</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={requestTypeFilter}
                  onChange={(e) => setRequestTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-festive-wine/90 border border-festive-gold/30 text-xs text-festive-cream focus:outline-none focus:border-festive-gold"
                >
                  <option value="all">All Types</option>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="ghar">Griha Pravesh</option>
                </select>

                <button
                  onClick={refreshRequests}
                  title="Refresh list"
                  className="p-2 rounded-xl bg-festive-wine border border-festive-gold/30 text-festive-gold hover:bg-festive-maroon transition-colors"
                >
                  🔄
                </button>
              </div>
            </div>

            {/* Requests Table / List */}
            {filteredRequests.length === 0 ? (
              <div className="text-center py-16 bg-festive-maroon/30 border border-festive-gold/20 rounded-2xl p-8">
                <span className="text-4xl">📭</span>
                <h3 className="font-serif text-lg font-bold text-festive-goldLight mt-3">
                  No requests found
                </h3>
                <p className="text-xs text-festive-cream/60 mt-1">
                  Try clearing filters or submit a test request via the public /apply form.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-festive-gold/30 bg-festive-maroon/50 shadow-md">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-festive-gold/30 bg-festive-maroon/80 text-[11px] uppercase tracking-wider text-festive-goldLight">
                      <th className="py-3.5 px-4 font-semibold">Applicant</th>
                      <th className="py-3.5 px-4 font-semibold">Type</th>
                      <th className="py-3.5 px-4 font-semibold">Event Date</th>
                      <th className="py-3.5 px-4 font-semibold">City</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold">Received</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-festive-gold/15">
                    {filteredRequests.map((req) => {
                      const isNew = req.status === "new";
                      return (
                        <tr
                          key={req.id}
                          onClick={() => handleOpenRequest(req)}
                          className={`hover:bg-festive-gold/10 cursor-pointer transition-colors ${
                            isNew ? "bg-festive-gold/5 font-medium" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              {isNew && (
                                <span
                                  className="w-2 h-2 rounded-full bg-red-500 animate-ping"
                                  title="New Inquiry"
                                />
                              )}
                              <span className="font-semibold text-festive-cream">
                                {req.name}
                              </span>
                            </div>
                            <span className="text-[11px] text-festive-cream/60 block font-mono">
                              +91 {req.phone}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                req.type === "wedding"
                                  ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                                  : req.type === "birthday"
                                  ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                                  : "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                              }`}
                            >
                              {req.type}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-festive-cream/80">
                            {req.event_date ? req.event_date : "—"}
                          </td>

                          <td className="py-3.5 px-4 text-festive-cream/80">
                            {req.city || "—"}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                req.status === "new"
                                  ? "bg-red-900/80 text-red-200 border border-red-500"
                                  : req.status === "in_progress"
                                  ? "bg-blue-900/80 text-blue-200 border border-blue-500"
                                  : req.status === "done"
                                  ? "bg-emerald-900/80 text-emerald-200 border border-emerald-500"
                                  : "bg-gray-800 text-gray-300 border border-gray-600"
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-xs text-festive-cream/60">
                            {new Date(req.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenRequest(req);
                                }}
                                className="px-3 py-1 rounded-lg bg-festive-wine border border-festive-gold/40 text-festive-goldLight hover:bg-festive-gold hover:text-festive-wine text-xs font-semibold transition-all"
                              >
                                Review →
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteRequest(req.id);
                                }}
                                className="px-2.5 py-1 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/20 hover:text-red-200 text-xs font-semibold transition-all flex items-center gap-1"
                                title="Delete request"
                              >
                                <span>🗑️</span>
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: CARDS ================= */}
        {activeTab === "cards" && (
          <div className="space-y-6">
            {/* Header + Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-festive-maroon/60 border border-festive-gold/30 p-4 sm:p-6 rounded-2xl">
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-festive-cream">
                  All Published & Draft Invitations
                </h1>
                <p className="text-xs text-festive-cream/70 mt-0.5">
                  Manage active celebration cards, share on WhatsApp, edit, duplicate, or delete.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search customer, slug, title..."
                  value={cardSearch}
                  onChange={(e) => setCardSearch(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-festive-wine/90 border border-festive-gold/30 text-xs text-festive-cream placeholder-festive-cream/40 focus:outline-none focus:border-festive-gold"
                />

                <select
                  value={cardTypeFilter}
                  onChange={(e) => setCardTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-festive-wine/90 border border-festive-gold/30 text-xs text-festive-cream focus:outline-none focus:border-festive-gold"
                >
                  <option value="all">All Types</option>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="ghar">Griha Pravesh</option>
                </select>

                <button
                  onClick={refreshCards}
                  title="Refresh cards"
                  className="p-2 rounded-xl bg-festive-wine border border-festive-gold/30 text-festive-gold hover:bg-festive-maroon transition-colors"
                >
                  🔄
                </button>

                <Link
                  href="/create"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-festive-gold via-amber-400 to-festive-goldDark text-festive-wine font-bold text-xs shadow-gold-glow hover:brightness-105 transition-all flex items-center gap-1.5"
                >
                  <span>+</span>
                  <span>Create New Card</span>
                </Link>
              </div>
            </div>

            {/* Cards Grid */}
            {filteredCards.length === 0 ? (
              <div className="text-center py-16 bg-festive-maroon/30 border border-festive-gold/20 rounded-2xl p-8">
                <span className="text-4xl">📜</span>
                <h3 className="font-serif text-lg font-bold text-festive-goldLight mt-3">
                  No cards found
                </h3>
                <p className="text-xs text-festive-cream/60 mt-1 mb-4">
                  Create your first invitation card or filter differently.
                </p>
                <Link
                  href="/create"
                  className="px-5 py-2.5 rounded-xl bg-festive-gold text-festive-wine font-bold text-xs shadow-md"
                >
                  Create Card Now →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCards.map((card) => {
                  const title =
                    card.type === "wedding"
                      ? `${card.data?.groomName || "Groom"} & ${card.data?.brideName || "Bride"}`
                      : card.type === "birthday"
                      ? `${card.data?.personName || "Birthday"}'s Celebration`
                      : `${card.data?.functionName || "Griha Pravesh"} – ${card.data?.familyName || "Family"}`;

                  const cardUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/c/${card.slug}`;
                  const isPublished = card.is_published !== false;

                  return (
                    <div
                      key={card.id || card.slug}
                      className="rounded-2xl bg-festive-maroon/70 border border-festive-gold/30 p-5 shadow-lg flex flex-col justify-between hover:border-festive-gold/60 transition-all"
                    >
                      <div>
                        {/* Header: Customer Name & Status */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              card.type === "wedding"
                                ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                                : card.type === "birthday"
                                ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                                : "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                            }`}
                          >
                            {card.type}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isPublished
                                ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40"
                                : "bg-gray-800 text-gray-400 border border-gray-600"
                            }`}
                          >
                            {isPublished ? "● Published" : "○ Draft / Paused"}
                          </span>
                        </div>

                        {/* Title & Customer Reference */}
                        <h3 className="font-serif text-lg font-bold text-festive-goldLight leading-snug">
                          {title}
                        </h3>

                        {card.customer_name && (
                          <p className="text-xs text-festive-cream/80 mt-1">
                            <span className="text-festive-gold font-medium">Customer: </span>
                            {card.customer_name}
                          </p>
                        )}

                        <p className="text-[11px] text-festive-cream/60 font-mono mt-1">
                          /c/{card.slug}
                        </p>

                        {/* Event Date & Venue */}
                        <div className="mt-3 pt-3 border-t border-festive-gold/15 text-xs text-festive-cream/75 space-y-1">
                          {card.data?.mainDate && (
                            <p>
                              🗓️ {formatDisplayDate(card.data.mainDate, "en")}
                            </p>
                          )}
                          {card.data?.venueName && (
                            <p className="truncate">
                              📍 {card.data.venueName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="mt-5 pt-3 border-t border-festive-gold/20 space-y-2">
                        {/* Primary Row: View & Copy & WhatsApp */}
                        <div className="grid grid-cols-3 gap-1.5 text-xs">
                          <Link
                            href={`/c/${card.slug}`}
                            target="_blank"
                            className="py-1.5 px-2 rounded-lg bg-festive-wine border border-festive-gold/40 text-festive-goldLight text-center hover:bg-festive-gold hover:text-festive-wine font-medium transition-colors"
                          >
                            View 👁️
                          </Link>

                          <button
                            onClick={() => handleCopy(cardUrl, "Card link")}
                            className="py-1.5 px-2 rounded-lg bg-festive-wine border border-festive-gold/40 text-festive-goldLight text-center hover:bg-festive-gold hover:text-festive-wine font-medium transition-colors"
                          >
                            Copy 🔗
                          </button>

                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              `Aapka digital invitation card: ${cardUrl}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-2 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-center hover:bg-emerald-800 font-medium transition-colors"
                          >
                            Share 💬
                          </a>
                        </div>

                        {/* Secondary Row: Edit, Duplicate, Publish, Delete */}
                        <div className="flex items-center justify-between text-[11px] pt-1 text-festive-cream/70">
                          <Link
                            href={`/edit/${card.slug}`}
                            className="hover:text-festive-gold transition-colors underline"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDuplicateCard(card.slug)}
                            className="hover:text-festive-gold transition-colors"
                          >
                            Duplicate
                          </button>

                          <button
                            onClick={() => handleTogglePublish(card.slug, isPublished)}
                            className={`transition-colors ${
                              isPublished ? "hover:text-amber-300" : "hover:text-emerald-300"
                            }`}
                          >
                            {isPublished ? "Unpublish" : "Publish"}
                          </button>

                          <button
                            onClick={() => handleDeleteCard(card.slug)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: STATS ================= */}
        {activeTab === "stats" && (
          <div className="space-y-8">
            <div>
              <h1 className="font-serif text-2xl font-bold text-festive-cream">
                Platform Statistics & Storage
              </h1>
              <p className="text-xs text-festive-cream/70 mt-1">
                Real-time overview of customer requests, generated invitations, and storage utilization.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-festive-maroon/70 border border-festive-gold/30">
                <span className="text-xs uppercase tracking-wider text-festive-goldLight font-medium block">
                  Total Requests
                </span>
                <span className="text-3xl font-serif font-bold text-festive-cream mt-2 block">
                  {requests.length}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-red-950/40 border border-red-500/40">
                <span className="text-xs uppercase tracking-wider text-red-300 font-medium block">
                  New Inquiries
                </span>
                <span className="text-3xl font-serif font-bold text-red-400 mt-2 block">
                  {newRequestsCount}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-festive-maroon/70 border border-festive-gold/30">
                <span className="text-xs uppercase tracking-wider text-festive-goldLight font-medium block">
                  Cards Created
                </span>
                <span className="text-3xl font-serif font-bold text-festive-cream mt-2 block">
                  {cards.length}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-festive-maroon/70 border border-festive-gold/30">
                <span className="text-xs uppercase tracking-wider text-festive-goldLight font-medium block">
                  Storage Used
                </span>
                <span className="text-3xl font-serif font-bold text-festive-cream mt-2 block">
                  ~{approxStorageMB} <span className="text-sm font-normal text-festive-cream/60">MB</span>
                </span>
                <span className="text-[10px] text-festive-cream/50 block mt-0.5">
                  ({totalPhotosUploaded} photos in bucket)
                </span>
              </div>
            </div>

            {/* Breakdown by Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-festive-maroon/50 border border-festive-gold/20">
                <h3 className="font-serif text-base font-bold text-festive-goldLight mb-4">
                  Requests by Occasion
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span>💍 Wedding Inquiries</span>
                    <span className="font-bold font-mono">
                      {requests.filter((r) => r.type === "wedding").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>🎂 Birthday Inquiries</span>
                    <span className="font-bold font-mono">
                      {requests.filter((r) => r.type === "birthday").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>🪔 Griha Pravesh Inquiries</span>
                    <span className="font-bold font-mono">
                      {requests.filter((r) => r.type === "ghar").length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-festive-maroon/50 border border-festive-gold/20">
                <h3 className="font-serif text-base font-bold text-festive-goldLight mb-4">
                  Cards Published Status
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span>🟢 Active Published Cards</span>
                    <span className="font-bold font-mono">
                      {cards.filter((c) => c.is_published !== false).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>⏸️ Paused / Draft Cards</span>
                    <span className="font-bold font-mono">
                      {cards.filter((c) => c.is_published === false).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= DETAIL DRAWER MODAL ================= */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl h-full bg-festive-maroon border-l border-festive-gold/40 shadow-2xl p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-festive-gold/20 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-festive-gold font-mono">
                    #{selectedRequest.id.slice(0, 8)}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-festive-cream mt-0.5">
                    {selectedRequest.name}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="w-8 h-8 rounded-full bg-festive-wine border border-festive-gold/40 flex items-center justify-center text-festive-cream/80 hover:text-festive-gold"
                >
                  ✕
                </button>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl bg-festive-wine/80 border border-festive-gold/30">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-festive-goldLight mb-1">
                    Status
                  </label>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) =>
                      handleUpdateStatus(selectedRequest.id, e.target.value as RequestStatus)
                    }
                    className="px-3 py-1.5 rounded-lg bg-festive-maroon border border-festive-gold/40 text-xs text-festive-cream font-semibold focus:outline-none focus:border-festive-gold"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <a
                    href={`https://wa.me/${getCleanPhone(selectedRequest.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:brightness-110 flex items-center gap-1.5"
                  >
                    <span>💬</span>
                    <span>Open WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${selectedRequest.phone}`}
                    className="px-3 py-1.5 rounded-lg bg-festive-maroon border border-festive-gold/40 text-festive-cream text-xs hover:bg-festive-wine"
                  >
                    Call 📞
                  </a>
                </div>
              </div>

              {/* CREATE CARD ACTION OR LINKED CARD */}
              <div className="mb-6 p-4 rounded-xl bg-festive-gold/15 border-2 border-festive-gold/60 space-y-3">
                {selectedRequest.card_id ? (
                  <div>
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <span>✓</span>
                      <span>Card Created & Linked</span>
                    </span>
                    <p className="text-xs text-festive-cream/80 mt-1">
                      This customer request has already been turned into an invitation card.
                    </p>

                    {/* Find linked card */}
                    {(() => {
                      const linked = cards.find((c) => c.id === selectedRequest.card_id);
                      if (!linked) return null;
                      const cardUrl = `${window.location.origin}/c/${linked.slug}`;
                      return (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link
                            href={`/c/${linked.slug}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-lg bg-festive-gold text-festive-wine font-bold text-xs"
                          >
                            Open Card 👁️
                          </Link>
                          <button
                            onClick={() => handleCopy(cardUrl, "Card link")}
                            className="px-3 py-1.5 rounded-lg bg-festive-wine border border-festive-gold/40 text-festive-goldLight text-xs font-medium"
                          >
                            Copy Link 🔗
                          </button>
                          <a
                            href={`https://wa.me/${getCleanPhone(selectedRequest.phone)}?text=${encodeURIComponent(
                              `Aapka invitation card taiyar hai: ${cardUrl}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold"
                          >
                            Send on WhatsApp 💬
                          </a>
                          <button
                            onClick={() => handleDeleteRequest(selectedRequest.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 hover:bg-red-900 text-xs font-semibold"
                          >
                            Delete Request 🗑️
                          </button>
                        </div>
                      );
                    })()}
                    <div className="mt-3">
                      <button
                        onClick={() => handleDeleteRequest(selectedRequest.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 hover:bg-red-900 text-xs font-semibold"
                      >
                        Delete Completed Request 🗑️
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs uppercase font-bold text-festive-goldLight tracking-wider">
                      Ready to Build?
                    </span>
                    <p className="text-xs text-festive-cream/80 mt-0.5 mb-3">
                      Launch the celebration wizard with all details pre-filled from this request.
                    </p>
                    <Link
                      href={`/create?type=${selectedRequest.type}&requestId=${selectedRequest.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-festive-gold to-festive-goldDark text-festive-wine font-bold text-xs shadow-gold-glow hover:brightness-105 transition-all"
                    >
                      <span>✨</span>
                      <span>Create Card from this Request →</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Submitted Answers Details */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-serif text-sm font-bold text-festive-goldLight mb-2 border-b border-festive-gold/20 pb-1">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-festive-cream/85">
                    <div>
                      <span className="text-festive-cream/50 block">Name:</span>
                      <span className="font-semibold">{selectedRequest.name}</span>
                    </div>
                    <div>
                      <span className="text-festive-cream/50 block">Phone:</span>
                      <span className="font-mono">+91 {selectedRequest.phone}</span>
                    </div>
                    <div>
                      <span className="text-festive-cream/50 block">Email:</span>
                      <span>{selectedRequest.email || "—"}</span>
                    </div>
                    <div>
                      <span className="text-festive-cream/50 block">City:</span>
                      <span>{selectedRequest.city || "—"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-sm font-bold text-festive-goldLight mb-2 border-b border-festive-gold/20 pb-1">
                    Event Details ({selectedRequest.type})
                  </h4>
                  <div className="space-y-2 text-festive-cream/85">
                    <div>
                      <span className="text-festive-cream/50 block">Main Event Date:</span>
                      <span className="font-semibold font-mono">
                        {selectedRequest.event_date || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-festive-cream/50 block">Venue:</span>
                      <span>{selectedRequest.venue || "—"}</span>
                    </div>

                    {/* Wedding extras */}
                    {selectedRequest.type === "wedding" && (
                      <div className="p-3 rounded-xl bg-festive-wine/50 space-y-2 mt-2">
                        <div>
                          <span className="text-festive-gold block">Groom & Bride:</span>
                          <span className="font-semibold">
                            {String(selectedRequest.details?.groomName || "—")} &{" "}
                            {String(selectedRequest.details?.brideName || "—")}
                          </span>
                        </div>
                        <div>
                          <span className="text-festive-gold block">Parents:</span>
                          <span>
                            Groom: {String(selectedRequest.details?.groomParents || "—")} | Bride:{" "}
                            {String(selectedRequest.details?.brideParents || "—")}
                          </span>
                        </div>
                        <div>
                          <span className="text-festive-gold block">Ceremonies Wanted:</span>
                          <span className="text-festive-cream">
                            {Array.isArray(selectedRequest.details?.eventsWanted)
                              ? selectedRequest.details.eventsWanted.join(", ")
                              : "—"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Birthday extras */}
                    {selectedRequest.type === "birthday" && (
                      <div className="p-3 rounded-xl bg-festive-wine/50 space-y-2 mt-2">
                        <div>
                          <span className="text-festive-gold block">Person Name & Age:</span>
                          <span className="font-semibold">
                            {String(selectedRequest.details?.personName || "—")} (Turning{" "}
                            {String(selectedRequest.details?.age || "—")})
                          </span>
                        </div>
                        <div>
                          <span className="text-festive-gold block">Theme:</span>
                          <span className="capitalize">
                            {String(selectedRequest.details?.theme || "kids")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Ghar extras */}
                    {selectedRequest.type === "ghar" && (
                      <div className="p-3 rounded-xl bg-festive-wine/50 space-y-2 mt-2">
                        <div>
                          <span className="text-festive-gold block">Function & Family:</span>
                          <span className="font-semibold">
                            {String(selectedRequest.details?.functionName || "—")} (
                            {String(selectedRequest.details?.familyName || "—")})
                          </span>
                        </div>
                        <div>
                          <span className="text-festive-gold block">Muhurat:</span>
                          <span>{String(selectedRequest.details?.muhurat || "—")}</span>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedRequest.notes && (
                      <div className="pt-2">
                        <span className="text-festive-cream/50 block">Customer Notes:</span>
                        <p className="italic text-festive-cream/90 bg-festive-wine/40 p-2.5 rounded-lg">
                          &ldquo;{selectedRequest.notes}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Note Section */}
                <div className="pt-2">
                  <h4 className="font-serif text-sm font-bold text-festive-goldLight mb-2 border-b border-festive-gold/20 pb-1">
                    Internal Admin Notes
                  </h4>
                  <textarea
                    rows={3}
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="Add your private notes about this client (pricing agreed, photo status, edits requested)..."
                    className="w-full px-3 py-2 rounded-xl bg-festive-wine border border-festive-gold/30 text-xs text-festive-cream placeholder-festive-cream/40 focus:outline-none focus:border-festive-gold"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleSaveAdminNote(selectedRequest.id)}
                      disabled={isSavingNote}
                      className="px-3.5 py-1.5 rounded-lg bg-festive-wine border border-festive-gold/40 text-festive-goldLight hover:bg-festive-gold hover:text-festive-wine text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {isSavingNote ? "Saving..." : "Save Admin Note"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Delete Request */}
            <div className="pt-6 border-t border-festive-gold/20 flex items-center justify-between">
              <button
                onClick={() => handleDeleteRequest(selectedRequest.id)}
                className="px-3.5 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 hover:bg-red-900/80 font-medium transition-colors flex items-center gap-1.5"
              >
                <span>🗑️</span>
                <span>Delete this request</span>
              </button>

              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-xl bg-festive-wine border border-festive-gold/30 text-festive-cream text-xs hover:bg-festive-maroon"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
