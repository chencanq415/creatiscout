import ClientPage from "./client-page";

export function generateStaticParams() {
  return ["shein", "nike", "aesop", "oatside", "glossier", "allbirds"].map((brand) => ({ brand }));
}

export default function Page() { return <ClientPage />; }
