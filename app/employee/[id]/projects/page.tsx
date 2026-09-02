import ClientPage from "./client-page";

export function generateStaticParams() {
  return ["lucy", "mia", "noah"].map((id) => ({ id }));
}

export default function Page({ params }: { params: Promise<{ id: string }> }) { return <ClientPage params={params} />; }
