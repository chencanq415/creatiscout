"use client";
import { DedupLibrary } from "@/components/pool/dedup-library";
import { PrivatePoolView } from "@/components/pool/private-pool-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoc } from "@/lib/i18n/use-i18n";
import { ShieldCheck, Users } from "lucide-react";

const L = {
  tabPool: { zh: "私域达人池", en: "Private Pool" },
  tabDedup: { zh: "客户排重达人库", en: "Client Dedup Library" },
} as const;

export default function PoolPage() {
  const l = useLoc();

  return (
    <div className="space-y-5 p-7 lg:p-8">
      <Tabs defaultValue="pool">
        <TabsList>
          <TabsTrigger value="pool">
            <Users className="mr-1 h-3.5 w-3.5" /> {l(L.tabPool)}
          </TabsTrigger>
          <TabsTrigger value="dedup">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" /> {l(L.tabDedup)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pool">
          <PrivatePoolView />
        </TabsContent>
        <TabsContent value="dedup">
          <DedupLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
}
