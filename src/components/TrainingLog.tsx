import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { LogOut, Plus, MapPin, Users, Clock, Snowflake, Trash2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { SessionForm } from "@/components/SessionForm";

type Row = Tables<"training_sessions">;
export const DISCIPLINES = ["Slalom", "Gigante", "Super-G", "Discesa", "Tecnica libera", "Atletica"] as const;

export function TrainingLog({ session }: { session: Session }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("Tutte");
  const [mineOnly, setMineOnly] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("training_sessions")
      .select("*")
      .order("session_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) toast.error("Impossibile caricare le sessioni");
    setRows(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const visible = useMemo(
    () => rows.filter((r) => (filter === "Tutte" || r.discipline === filter) && (!mineOnly || r.user_id === session.user.id)),
    [rows, filter, mineOnly, session.user.id],
  );

  const stats = useMemo(() => {
    const now = new Date();
    const month = rows.filter((r) => {
      const d = new Date(r.session_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const hours = month.reduce((s, r) => s + r.duration_min, 0) / 60;
    return { count: month.length, hours: Math.round(hours * 10) / 10, total: rows.length };
  }, [rows]);

  async function remove(id: string) {
    if (!confirm("Eliminare questa sessione?")) return;
    const { error } = await supabase.from("training_sessions").delete().eq("id", id);
    if (error) { toast.error("Eliminazione non riuscita"); return; }
    setRows((r) => r.filter((x) => x.id !== id));
  }

  return (
    <div className="min-h-screen pb-28">
      <header className="bg-glacier-gradient text-glacier-foreground">
        <div className="h-1.5 gate-stripe" />
        <div className="max-w-3xl mx-auto px-5 pt-6 pb-8">
          <div className="flex items-center justify-between">
            <p className="font-display uppercase tracking-[0.25em] text-xs text-primary">Sci Club Liberi Tutti</p>
            <button onClick={() => supabase.auth.signOut()} className="text-glacier-foreground/70 hover:text-glacier-foreground" aria-label="Esci">
              <LogOut className="size-5" />
            </button>
          </div>
          <h1 className="font-display text-4xl font-extrabold uppercase mt-2">Registro allenamenti</h1>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Stat label="Sessioni mese" value={stats.count} />
            <Stat label="Ore mese" value={stats.hours} />
            <Stat label="Totale" value={stats.total} />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 -mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
          {["Tutte", ...DISCIPLINES].map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
                filter === d ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <input type="checkbox" checked={mineOnly} onChange={(e) => setMineOnly(e.target.checked)} className="accent-primary" />
          Solo le mie sessioni
        </label>

        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="text-muted-foreground text-center py-12">Caricamento…</p>
          ) : visible.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed">
              <Snowflake className="size-8 mx-auto text-muted-foreground" />
              <p className="mt-3 font-medium">Nessuna sessione</p>
              <p className="text-sm text-muted-foreground">Aggiungi il primo allenamento.</p>
            </div>
          ) : (
            visible.map((r) => (
              <article key={r.id} className="rounded-2xl bg-card shadow-card p-4 flex gap-4">
                <div className="text-center w-12 shrink-0">
                  <div className="font-display text-3xl font-extrabold leading-none">{new Date(r.session_date).getDate()}</div>
                  <div className="text-xs uppercase text-muted-foreground">
                    {new Date(r.session_date).toLocaleDateString("it-IT", { month: "short" })}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block rounded bg-accent text-accent-foreground text-xs font-semibold uppercase px-2 py-0.5">{r.discipline}</span>
                      <h3 className="font-display text-xl font-bold mt-1 leading-tight">{r.focus || r.group_name || "Allenamento"}</h3>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`size-3.5 ${i < r.rating ? "fill-primary text-primary" : "text-border"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                    {r.location && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{r.location}</span>}
                    {r.group_name && <span className="flex items-center gap-1"><Users className="size-3.5" />{r.group_name}{r.athletes ? ` · ${r.athletes}` : ""}</span>}
                    <span className="flex items-center gap-1"><Clock className="size-3.5" />{r.duration_min} min</span>
                    {r.snow && <span className="flex items-center gap-1"><Snowflake className="size-3.5" />{r.snow}</span>}
                  </div>
                  {r.notes && <p className="text-sm mt-2 whitespace-pre-line">{r.notes}</p>}
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span>{r.coach_name}</span>
                    {r.user_id === session.user.id && (
                      <button onClick={() => remove(r.id)} aria-label="Elimina" className="hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <Button onClick={() => setOpen(true)} className="w-full max-w-3xl mx-auto flex h-12 text-base font-semibold shadow-card">
          <Plus className="size-5" /> Nuova sessione
        </Button>
      </div>

      <SessionForm
        open={open}
        onOpenChange={setOpen}
        coachName={(session.user.user_metadata?.["full_name"] as string) || session.user.email || ""}
        onSaved={(row) => setRows((r) => [row, ...r].sort((a, b) => b.session_date.localeCompare(a.session_date)))}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-glacier-foreground/10 px-3 py-2.5">
      <div className="font-display text-3xl font-extrabold leading-none">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-glacier-foreground/70 mt-1">{label}</div>
    </div>
  );
}
