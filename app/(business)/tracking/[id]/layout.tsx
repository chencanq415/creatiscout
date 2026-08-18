import { trackings } from "@/lib/mock/trackings";

export const dynamicParams = false;

export function generateStaticParams() {
  return trackings.map((tracking) => ({ id: tracking.id }));
}

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
