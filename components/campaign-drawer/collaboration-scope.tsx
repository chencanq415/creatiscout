"use client";

import { createContext, type ReactNode, useContext } from "react";

type CollaborationScope = {
  campaignId?: string;
  embedded: boolean;
};

const CollaborationScopeContext = createContext<CollaborationScope>({ embedded: false });

export function CampaignCollaborationScope({
  campaignId,
  children,
}: {
  campaignId: string;
  children: ReactNode;
}) {
  return (
    <CollaborationScopeContext.Provider value={{ campaignId, embedded: true }}>
      {children}
    </CollaborationScopeContext.Provider>
  );
}

export function useCampaignCollaborationScope() {
  return useContext(CollaborationScopeContext);
}
