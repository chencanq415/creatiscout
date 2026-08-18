import { campaigns } from "@/lib/mock/campaigns";

export const dynamicParams = false;

export function generateStaticParams() {
  return campaigns.map((campaign) => ({ id: campaign.id }));
}

export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return children;
}
