import type { Creator, CreatorDeal, CreatorProfileData } from "@/lib/types";

export const creators: Creator[] = [
  {
    id: "cr-1",
    name: "Creator One",
    handle: "@creator_one",
    avatar: "https://i.pravatar.cc/64?img=5",
    followers: 320000,
    engagement: 6.4,
    platform: "RedNote",
    fitScore: 92,
    reason: {
      zh: "受众 18-28 女性占 88%，与 brief 完全契合。",
      en: "88% of audience are women aged 18-28 — a perfect match for the brief.",
    },
    averageQuote: 7800,
    collaborations: 3,
  },
  {
    id: "cr-2",
    name: "Nina Chen",
    handle: "@creator_two",
    avatar: "https://i.pravatar.cc/64?img=20",
    followers: 145000,
    engagement: 8.1,
    platform: "TikTok",
    fitScore: 87,
    reason: {
      zh: "北美华人社区核心创作者，3 秒 hook 表现强劲。",
      en: "Core creator in the North American Chinese community with strong 3-second hooks.",
    },
    averageQuote: 9200,
    collaborations: 1,
  },
  {
    id: "cr-3",
    name: "Guozi Sis",
    handle: "@guozi_sis",
    avatar: "https://i.pravatar.cc/64?img=9",
    followers: 510000,
    engagement: 4.2,
    platform: "RedNote",
    fitScore: 79,
    reason: {
      zh: "粉丝量级匹配，需评估调性。",
      en: "Follower scale matches; brand tone needs evaluation.",
    },
    averageQuote: 12000,
    collaborations: 0,
  },
  {
    id: "cr-4",
    name: "Yoga Anna",
    handle: "@yoga_anna",
    avatar: "https://i.pravatar.cc/64?img=28",
    followers: 220000,
    engagement: 7.8,
    platform: "Instagram",
    fitScore: 90,
    reason: {
      zh: "瑜伽垂类头部，过往合作转化稳定。",
      en: "Top yoga-vertical creator with consistently strong past conversions.",
    },
    averageQuote: 8500,
    collaborations: 2,
  },
  {
    id: "cr-5",
    name: "Leo Park",
    handle: "@leoparkco",
    avatar: "https://i.pravatar.cc/64?img=15",
    followers: 88000,
    engagement: 9.6,
    platform: "TikTok",
    fitScore: 84,
    reason: {
      zh: "Micro creator，互动率高，性价比强。",
      en: "Micro creator with high engagement and great cost efficiency.",
    },
    averageQuote: 4200,
    collaborations: 0,
  },
  {
    id: "cr-6",
    name: "Ariana Lin",
    handle: "@ariana_makeup",
    avatar: "https://i.pravatar.cc/64?img=44",
    followers: 215000,
    engagement: 7.2,
    platform: "RedNote",
    fitScore: 88,
    reason: {
      zh: "通勤美妆垂类，沟通积极，已表达意向。",
      en: "Commuter-beauty vertical, responsive, already expressed interest.",
    },
    averageQuote: 6800,
    collaborations: 1,
  },
  {
    id: "cr-7",
    name: "MakeupByJade",
    handle: "@creator_three",
    avatar: "https://i.pravatar.cc/64?img=49",
    followers: 132000,
    engagement: 8.4,
    platform: "TikTok",
    fitScore: 85,
    reason: {
      zh: "北美亚裔美妆，主动询问 brief 与档期。",
      en: "North American Asian beauty creator, proactively asked about the brief and schedule.",
    },
    averageQuote: 5200,
    collaborations: 0,
  },
];

const coreCategories = [
  ["Skincare", "Beauty"],
  ["Beauty", "Lifestyle"],
  ["Beauty", "Fashion"],
  ["Wellness", "Fitness"],
  ["Lifestyle", "UGC"],
  ["Makeup", "Daily routine"],
  ["Beauty", "Tutorial"],
] as const;

const channelPlatforms = ["RedNote", "TikTok", "Instagram"] as const;

/** Rich, per-creator mock records shaped like the production data model. */
export const creatorProfiles: Record<string, CreatorProfileData> = Object.fromEntries(
  creators.map((creator, index) => {
    const primaryId = `${creator.id}-${creator.platform.toLowerCase()}`;
    const platformList = [creator.platform, ...channelPlatforms.filter((item) => item !== creator.platform)].slice(0, 3) as CreatorProfileData["channels"][number]["platform"][];
    const channels = platformList.map((platform, channelIndex) => {
      const factor = channelIndex === 0 ? 1 : channelIndex === 1 ? 0.46 : 0.2;
      const followerCount = Math.round(creator.followers * factor);
      return {
        channelId: channelIndex === 0 ? primaryId : `${creator.id}-${platform.toLowerCase()}`,
        creatorId: creator.id,
        platform,
        username: creator.handle.replace("@", ""),
        profileUrl: `https://${platform.toLowerCase()}.com/${creator.handle.replace("@", "")}`,
        followerCount,
        avgEngagementRate: Number(Math.max(2.8, creator.engagement - channelIndex * 1.15).toFixed(1)),
        avgViews: Math.round(followerCount * (0.2 + creator.engagement / 100)),
        avgLikes: Math.round(followerCount * (0.038 + creator.engagement / 100)),
        avgComments: Math.round(followerCount * 0.004),
        avgShares: Math.round(followerCount * 0.002),
        channelCategory: coreCategories[index][0],
        isVerified: index % 3 !== 2,
      };
    });
    const makeAudience = (channelId: string) => ({
      channelId,
      geoDistribution: [{ label: "United States", percentage: 62 + (index % 3) * 4 }, { label: "Canada", percentage: 11 }, { label: "United Kingdom", percentage: 8 }],
      genderDistribution: [{ label: "Women", percentage: 72 - index }, { label: "Men", percentage: 26 + index }, { label: "Other", percentage: 2 }],
      ageDistribution: [{ label: "18–24", percentage: 34 }, { label: "25–34", percentage: 42 }, { label: "35–44", percentage: 16 }],
      audienceInterests: [...coreCategories[index], "Product reviews", "Daily routines"],
    });
    const makePerformance = (channel: typeof channels[number]) => ({
      channelId: channel.channelId,
      recentContents: ["Morning routine", "Product review", "Beauty favorites"].map((title, contentIndex) => ({ title, type: contentIndex === 1 ? "Post" : "Video", publishedAt: `${contentIndex + 1}d ago`, views: Math.round(channel.avgViews * (1.1 - contentIndex * 0.12)), engagements: Math.round(channel.avgLikes * (1.08 - contentIndex * 0.1)) })),
      brandMentionPerf: { engagementRate: channel.avgEngagementRate + 0.7, effectiveness: 82 + (index % 8), saturation: 28 + (index % 5) * 6 },
      affiliatePerf: { engagementRate: channel.avgEngagementRate - 0.4, conversionEffectiveness: 74 + (index % 10), saturation: 18 + (index % 5) * 5 },
      publishTimePattern: [{ label: "Mon–Wed", score: 86 }, { label: "Thu–Fri", score: 78 }, { label: "Weekend", score: 69 }],
      peerPercentile: { engagement: 88 - index, likes: 84 - index, comments: 81 - index },
    });
    return [creator.id, {
      main: { creatorId: creator.id, creatorName: creator.name, avatarUrl: creator.avatar, residentCountry: "United States", coreCategories: [...coreCategories[index]], bio: creator.reason.en, authenticityScore: 96 - index, createdAt: "2026-03-12", updatedAt: "Today" },
      channels,
      audienceProfiles: Object.fromEntries(channels.map((channel) => [channel.channelId, makeAudience(channel.channelId)])),
      contentPerformance: Object.fromEntries(channels.map((channel) => [channel.channelId, makePerformance(channel)])),
      commercialInfo: { estimatedPriceRange: `$${Math.max(1800, (creator.averageQuote ?? 6000) - 1200).toLocaleString()}–$${((creator.averageQuote ?? 6000) + 1800).toLocaleString()}`, avgCpe: Number((0.32 + index * 0.04).toFixed(2)), avgCpm: 18 + index * 2, cooperatedBrands: ["SHEIN", "Nike", index % 2 ? "Aesop" : "Glossier"], contactEmail: `partnerships@${creator.handle.replace("@", "")}.com`, contactPhone: "+1 ••• ••• 0482", shippingAddress: { city: "Los Angeles", country: "United States", saved: true } },
      brandSafety: Object.fromEntries(channels.map((channel) => [channel.channelId, { safetyOverview: "Safe", riskDetection: [{ label: "Adult content", level: "low" }, { label: "Restricted goods", level: "low" }, { label: "Violence", level: "low" }], complianceStatus: "Compliant" }])),
      systemManagement: { campaignId: "618 Beauty Collab", groupTag: index < 3 ? "Selected" : "Lookalikes", owner: "Lucy · Content Ops", customRating: 5 - (index % 2), customTags: ["Beauty shortlist", index % 2 ? "Review" : "Priority"], operationLogs: [{ at: "Today, 10:24", operator: "Lucy", type: "Updated shortlist" }, { at: "Yesterday", operator: "System", type: "Refreshed channel data" }] },
    }];
  }),
);

// Mock deals reflecting the new business SOP stages.
// Each creator sits in one of: interested / submitted / internal_review / client_review / negotiating / won / handoff
export const deals: CreatorDeal[] = [
  {
    creatorId: "cr-1",
    campaignId: "cmp-618-beauty",
    stage: "won",
    ceiling: 9000,
    finalQuote: 8000,
    rounds: [
      {
        round: 1,
        ourQuote: 6000,
        theirQuote: 9000,
        at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        note: { zh: "首轮报价", en: "First-round quote" },
      },
      {
        round: 2,
        ourQuote: 7500,
        theirQuote: 8000,
        at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        note: { zh: "二轮议价", en: "Second-round negotiation" },
        byHuman: true,
      },
      {
        round: "final",
        ourQuote: 8000,
        theirQuote: 8000,
        at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        note: { zh: "成单", en: "Deal closed" },
        byHuman: true,
      },
    ],
  },
  {
    creatorId: "cr-2",
    campaignId: "cmp-618-beauty",
    stage: "negotiating",
    ceiling: 9000,
    rounds: [
      {
        round: 1,
        ourQuote: 6500,
        theirQuote: 11000,
        at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        note: {
          zh: "对方首轮报价超天花板，转人工议价",
          en: "Their first quote exceeded the ceiling; escalated to human negotiation",
        },
      },
      {
        round: 2,
        ourQuote: 8500,
        at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        note: { zh: "我方二轮 counter，等待回复", en: "Our second-round counter, awaiting reply" },
        byHuman: true,
      },
    ],
  },
  {
    creatorId: "cr-3",
    campaignId: "cmp-618-beauty",
    stage: "client_review",
    ceiling: 9000,
    rounds: [],
  },
  {
    creatorId: "cr-4",
    campaignId: "cmp-618-beauty",
    stage: "internal_review",
    ceiling: 9000,
    rounds: [],
  },
  {
    creatorId: "cr-5",
    campaignId: "cmp-618-beauty",
    stage: "submitted",
    ceiling: 9000,
    rounds: [],
  },
  {
    creatorId: "cr-6",
    campaignId: "cmp-618-beauty",
    stage: "interested",
    ceiling: 9000,
    rounds: [],
  },
  {
    creatorId: "cr-7",
    campaignId: "cmp-618-beauty",
    stage: "interested",
    ceiling: 9000,
    rounds: [],
  },
];
