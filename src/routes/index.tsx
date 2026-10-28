import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthScreen } from "@/components/AuthScreen";
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
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (!ready) return <div className="min-h-screen bg-glacier-gradient" />;
  return session ? <TrainingLog session={session} /> : <AuthScreen />;
}
