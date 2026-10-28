import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type OriginalSession = {
  id: string; data: string; coach: string; cat: string; loc: string; locx: string;
  tipo: string[]; det: Record<string, unknown>; presenti: string[]; cond: string; note: string;
};
const PREFIX = "LT_ORIGINAL_V1\n";

export function decodeSession(row: Tables<"training_sessions">): OriginalSession {
  if (row.notes.startsWith(PREFIX)) {
    try {
      const value = JSON.parse(row.notes.slice(PREFIX.length));
      if (Array.isArray(value.tipo) && Array.isArray(value.presenti)) {
        return { ...value, id: row.id, coach: row.coach_name, data: row.session_date };
      }
    } catch { /* Older sessions remain readable below. */ }
  }
  return { id: row.id, data: row.session_date, coach: row.coach_name, cat: row.group_name,
    loc: row.location, locx: "", tipo: [row.discipline], det: {}, presenti: [], cond: row.snow, note: row.notes };
}

export const originalRegister = {
  async list() {
    const { data, error } = await supabase.from("training_sessions").select("*").order("session_date", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(decodeSession);
  },
  async add(session: OriginalSession) {
    const { data, error } = await supabase.from("training_sessions").insert({
      session_date: session.data, coach_name: session.coach.trim(), group_name: session.cat,
      discipline: session.tipo.join(", "), location: session.loc === "Altro" ? session.locx : session.loc,
      snow: session.cond, athletes: session.presenti.length,
      notes: PREFIX + JSON.stringify(session),
    }).select().single();
    if (error || !data) throw error ?? new Error("Session not saved");
    return decodeSession(data);
  },
};