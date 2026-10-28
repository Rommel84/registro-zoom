import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DISCIPLINES = ["Slalom", "Gigante", "Super-G", "Discesa", "Tecnica libera", "Atletica"];
const SNOW = ["Polvere", "Compatta", "Ghiacciata", "Primaverile", "Artificiale"];

export function SessionForm({
  open, onOpenChange, coachName, onSaved,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  coachName: string;
  onSaved: (row: Tables<"training_sessions">) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const empty = { session_date: today, discipline: "Gigante", location: "", group_name: "", athletes: 0, duration_min: 120, snow: "", focus: "", notes: "", rating: 3 };
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.from("training_sessions").insert({ ...f, coach_name: coachName }).select().single();
    setBusy(false);
    if (error || !data) return toast.error("Salvataggio non riuscito");
    toast.success("Sessione salvata");
    onSaved(data);
    setF(empty);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl uppercase">Nuova sessione</SheetTitle>
        </SheetHeader>
        <form onSubmit={save} className="space-y-4 px-4 pb-6 max-w-2xl mx-auto w-full">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data"><Input type="date" required value={f.session_date} onChange={(e) => set("session_date", e.target.value)} /></Field>
            <Field label="Durata (min)"><Input type="number" min={0} value={f.duration_min} onChange={(e) => set("duration_min", Number(e.target.value))} /></Field>
          </div>
          <Field label="Disciplina">
            <div className="flex flex-wrap gap-2">
              {DISCIPLINES.map((d) => (
                <Chip key={d} active={f.discipline === d} onClick={() => set("discipline", d)}>{d}</Chip>
              ))}
            </div>
          </Field>
          <Field label="Obiettivo"><Input placeholder="es. Curve strette, linea alta" value={f.focus} onChange={(e) => set("focus", e.target.value)} /></Field>
          <Field label="Località / pista"><Input placeholder="es. Passo Tonale – Valena" value={f.location} onChange={(e) => set("location", e.target.value)} /></Field>
          <div className="grid grid-cols-[1fr_6rem] gap-3">
            <Field label="Gruppo"><Input placeholder="es. Under 14" value={f.group_name} onChange={(e) => set("group_name", e.target.value)} /></Field>
            <Field label="Atleti"><Input type="number" min={0} value={f.athletes} onChange={(e) => set("athletes", Number(e.target.value))} /></Field>
          </div>
          <Field label="Neve">
            <div className="flex flex-wrap gap-2">
              {SNOW.map((s) => (
                <Chip key={s} active={f.snow === s} onClick={() => set("snow", f.snow === s ? "" : s)}>{s}</Chip>
              ))}
            </div>
          </Field>
          <Field label="Valutazione">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => set("rating", n)} aria-label={`${n} stelle`}>
                  <Star className={`size-7 ${n <= f.rating ? "fill-primary text-primary" : "text-border"}`} />
                </button>
              ))}
            </div>
          </Field>
          <Field label="Note"><Textarea rows={4} placeholder="Esercizi, osservazioni sugli atleti…" value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
          <Button type="submit" disabled={busy} className="w-full h-12 text-base font-semibold">Salva sessione</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm border transition-colors ${active ? "bg-glacier text-glacier-foreground border-glacier" : "bg-card hover:bg-muted"}`}
    >
      {children}
    </button>
  );
}
