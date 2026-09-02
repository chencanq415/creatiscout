import ClientPage from "./client-page";

export function generateStaticParams() {
  return ["offer", "draft", "payment", "ai"].map((id) => ({ id }));
}

export default function Page() { return <ClientPage />; }
