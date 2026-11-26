import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const context = { window: { LTConfig: { categories: [] as string[], sections: [] as string[][] } } };
runInNewContext(readFileSync("public/register-config.js", "utf8"), context);

describe("Register choices", () => {
  it("allows only Junior, Team and Rebel categories", () => {
    expect(Array.from(context.window.LTConfig.categories)).toEqual(["Junior", "Team", "Rebel"]);
  });
  it("removes ski maintenance and chrono from the available sections", () => {
    expect(context.window.LTConfig.sections.map((section) => section[0])).toEqual(["cal", "reg"]);
  });
});