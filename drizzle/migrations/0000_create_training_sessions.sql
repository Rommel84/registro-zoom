CREATE TABLE public.training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  coach_name text NOT NULL DEFAULT '',
  session_date date NOT NULL DEFAULT current_date,
  discipline text NOT NULL DEFAULT 'Gigante',
  location text NOT NULL DEFAULT '',
  group_name text NOT NULL DEFAULT '',
  athletes integer NOT NULL DEFAULT 0,
  duration_min integer NOT NULL DEFAULT 120,
  snow text NOT NULL DEFAULT '',
  focus text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 3 CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_sessions TO authenticated;
GRANT ALL ON public.training_sessions TO service_role;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coaches read club log" ON public.training_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coaches add own sessions" ON public.training_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches edit own sessions" ON public.training_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches delete own sessions" ON public.training_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX ON public.training_sessions (session_date DESC);