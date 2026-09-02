import ClientPage from "./client-page";

export function generateStaticParams() {
  return ["candy", "ourdream", "polybuzz", "glow", "lumio"].map((id) => ({ id }));
}

export default function Page() { return <ClientPage />; }
