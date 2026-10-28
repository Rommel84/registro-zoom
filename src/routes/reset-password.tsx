import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nuova password – Sci Club Liberi Tutti" },
      { name: "description", content: "Imposta una nuova password per il registro allenamenti." },
      { property: "og:title", content: "Nuova password – Sci Club Liberi Tutti" },
      { property: "og:description", content: "Imposta una nuova password." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { toast.error(error.message); return; }
    toast.success("Password aggiornata");
    navigate({ to: "/" });
  }
  return (
    <div className="min-h-screen bg-glacier-gradient flex items-center px-6">
      <form onSubmit={submit} className="mx-auto w-full max-w-md rounded-2xl bg-card p-6 shadow-card space-y-4">
        <h1 className="font-display text-2xl font-bold uppercase">Nuova password</h1>
        <div className="space-y-1.5">
          <Label htmlFor="pw">Password</Label>
          <Input id="pw" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full h-11">Salva</Button>
      </form>
    </div>
  );
}
