import ClientPage from "./client-page";

export function generateStaticParams() {
  return ["cmp-618-beauty", "cmp-520-gift", "cmp-summer-yoga", "cmp-coffee-spring", "cmp-winter-skincare"].map((id) => ({ id }));
}

export default function Page() { return <ClientPage />; }
