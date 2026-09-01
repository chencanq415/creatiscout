"use client";

import CollaborationsPage from "@/app/(business)/collaborations/page";
import { CampaignCollaborationScope } from "./collaboration-scope";
import type { Campaign } from "@/lib/types";

/**
 * The campaign-level view deliberately reuses the same collaboration board as
 * the global workspace, scoped to the campaign currently being viewed.
 * This keeps statuses, row fields, and every operational action identical.
 */
export function CampaignPipeline({ campaign }: { campaign: Campaign }) {
  return <CampaignCollaborationScope campaignId={campaign.id}><CollaborationsPage /></CampaignCollaborationScope>;
}
