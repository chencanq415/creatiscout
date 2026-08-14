"use client";
import { campaigns as initialCampaigns } from "@/lib/mock/campaigns";
import type { Campaign, ChatMessage } from "@/lib/types";
import { create } from "zustand";

interface UIState {
  // Sidebar collapse
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Campaign info panel collapse (within campaign detail page)
  campaignInfoCollapsed: boolean;
  toggleCampaignInfo: () => void;

  // Share submission dialog
  shareOpen: boolean;
  shareTarget: { kind: "batch" | "submission"; id: string; label?: string } | null;
  openShare: (target: NonNullable<UIState["shareTarget"]>) => void;
  closeShare: () => void;

  // New Email drawer
  mailOpen: boolean;
  mailContext: { batchId?: string; influencerCount?: number; defaultGroupName?: string } | null;
  openMail: (ctx: NonNullable<UIState["mailContext"]>) => void;
  closeMail: () => void;

  // New Task Chat drawer
  chatOpen: boolean;
  chatPanelWidth: number;
  setChatPanelWidth: (w: number) => void;
  activeEmployeeId: string;
  messages: ChatMessage[];
  chatCampaignContext: { id: string; name: string } | null;
  openChat: (employeeId?: string, campaign?: { id: string; name: string }) => void;
  closeChat: () => void;
  setActiveEmployee: (id: string) => void;
  pushMessage: (msg: ChatMessage) => void;
  resetChat: () => void;

  // Campaign detail drawer
  activeCampaignId: string | null;
  openCampaign: (id: string) => void;
  closeCampaign: () => void;

  // Live campaigns list (mutable for shimmer demo)
  campaigns: Campaign[];
  addCampaign: (c: Campaign) => void;
  updateCampaign: (id: string, patch: Partial<Campaign>) => void;
  shimmerIds: Set<string>;
  markShimmer: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  campaignInfoCollapsed: false,
  toggleCampaignInfo: () => set((s) => ({ campaignInfoCollapsed: !s.campaignInfoCollapsed })),

  shareOpen: false,
  shareTarget: null,
  openShare: (target) => set({ shareOpen: true, shareTarget: target }),
  closeShare: () => set({ shareOpen: false, shareTarget: null }),

  mailOpen: false,
  mailContext: null,
  openMail: (ctx) => set({ mailOpen: true, mailContext: ctx }),
  closeMail: () => set({ mailOpen: false, mailContext: null }),

  chatOpen: false,
  chatPanelWidth: 420,
  setChatPanelWidth: (w) => set({ chatPanelWidth: Math.min(720, Math.max(340, w)) }),
  activeEmployeeId: "lucy",
  messages: [],
  chatCampaignContext: null,
  openChat: (employeeId, campaign) =>
    set((s) => ({
      chatOpen: true,
      activeEmployeeId: employeeId ?? s.activeEmployeeId,
      chatCampaignContext: campaign ?? null,
      // Reset messages when entering with a new campaign context to seed properly
      messages: campaign ? [] : s.messages,
    })),
  closeChat: () => set({ chatOpen: false, chatCampaignContext: null }),
  setActiveEmployee: (id) => set({ activeEmployeeId: id }),
  pushMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  resetChat: () => set({ messages: [] }),

  activeCampaignId: null,
  openCampaign: (id) => set({ activeCampaignId: id }),
  closeCampaign: () => set({ activeCampaignId: null }),

  campaigns: initialCampaigns,
  addCampaign: (c) =>
    set((s) => {
      const next = new Set(s.shimmerIds);
      next.add(c.id);
      return { campaigns: [c, ...s.campaigns], shimmerIds: next };
    }),
  updateCampaign: (id, patch) =>
    set((s) => ({
      campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
  shimmerIds: new Set<string>(),
  markShimmer: (id) =>
    set((s) => {
      const next = new Set(s.shimmerIds);
      next.add(id);
      setTimeout(() => {
        const after = new Set(get().shimmerIds);
        after.delete(id);
        set({ shimmerIds: after });
      }, 3000);
      return { shimmerIds: next };
    }),
}));
