import { FloatingAsk } from "@/components/floating-ask";
import { NewEmailDrawer } from "@/components/new-email-drawer";
import { NewTaskDrawer } from "@/components/new-task-drawer";
import { PlusTrialInitializer } from "@/components/plus-trial-initializer";
import { ShareSubmissionDialog } from "@/components/share-submission-dialog";
import { BusinessSidebar } from "@/components/sidebar/business-sidebar";
import { Topbar } from "@/components/topbar";

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <BusinessSidebar />
      <div className="flex min-w-0 flex-1 gap-2 py-2 pr-2">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-panel bg-surface shadow-panel">
          <Topbar />
          <main className="min-h-0 flex-1 overflow-y-auto bg-surface">{children}</main>
        </div>
        <NewTaskDrawer />
      </div>
      <NewEmailDrawer />
      <ShareSubmissionDialog />
      <FloatingAsk />
      <PlusTrialInitializer />
    </div>
  );
}
