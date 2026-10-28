import { createFileRoute } from "@tanstack/react-router";
import { TrainingLog } from "@/components/TrainingLog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Registro allenamenti – Sci Club Liberi Tutti" },
      { name: "description", content: "Il diario degli allenamenti degli allenatori dello Sci Club Liberi Tutti." },
      { property: "og:title", content: "Registro allenamenti – Sci Club Liberi Tutti" },
      { property: "og:description", content: "Registra sessioni, discipline, neve e note di ogni allenamento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <TrainingLog />;
}
