import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { logRendered } = vi.hoisted(() => ({ logRendered: vi.fn() }));
vi.mock("@/components/TrainingLog", () => ({
  TrainingLog: () => { logRendered(); return null; },
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { get auth() { throw new Error("Public entry must not request authentication"); } },
}));
import { Route } from "@/routes/index";

describe("Public register access", () => {
  it("opens the log without requesting a session or credentials", async () => {
    const Home = Route.options.component;
    if (!Home) throw new Error("Missing home page");
    render(<Home />);
    await waitFor(() => expect(logRendered).toHaveBeenCalledOnce());
  });
});