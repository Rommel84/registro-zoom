import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "signup" | "reset";

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Controlla la tua email per confermare l'account.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Ti abbiamo inviato il link per reimpostare la password.");
        setMode("login");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error("Accesso con Google non riuscito");
  }

  return (
    <div className="min-h-screen bg-glacier-gradient text-glacier-foreground flex flex-col">
      <div className="h-2 gate-stripe" />
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-md w-full mx-auto">
        <p className="font-display uppercase tracking-[0.3em] text-sm text-primary">Sci Club</p>
        <h1 className="font-display text-6xl font-extrabold uppercase leading-[0.9] mt-2">
          Liberi<br />Tutti
        </h1>
        <p className="mt-4 text-glacier-foreground/70">Registro allenamenti per gli allenatori.</p>

        <form onSubmit={submit} className="mt-10 rounded-2xl bg-card text-card-foreground p-6 shadow-card space-y-4">
          <h2 className="font-display text-2xl font-bold uppercase">
            {mode === "login" ? "Accedi" : mode === "signup" ? "Richiedi accesso" : "Password dimenticata"}
          </h2>
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome e cognome</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {mode !== "reset" && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          )}
          <Button type="submit" className="w-full h-11 font-semibold" disabled={busy}>
            {mode === "login" ? "Accedi" : mode === "signup" ? "Crea account" : "Invia link"}
          </Button>
          {mode !== "reset" && (
            <Button type="button" variant="outline" className="w-full h-11" onClick={google}>
              Continua con Google
            </Button>
          )}
          <div className="flex justify-between text-sm text-muted-foreground pt-1">
            {mode === "login" ? (
              <>
                <button type="button" onClick={() => setMode("signup")} className="hover:text-foreground">Richiedi accesso</button>
                <button type="button" onClick={() => setMode("reset")} className="hover:text-foreground">Password dimenticata?</button>
              </>
            ) : (
              <button type="button" onClick={() => setMode("login")} className="hover:text-foreground">← Torna all'accesso</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
