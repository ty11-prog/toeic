import { describe, expect, it } from "vitest";
import { buildDailyStudyList } from "./vocabularyPlan";
import { words } from "./data";
import type { Word } from "./data";

function makePool(counts: {
  foundation: number;
  core: number;
  advanced: number;
}): Word[] {
  const categories = ["work", "travel", "business", "daily"] as const;
  return (Object.entries(counts) as [Word["difficulty"], number][]).flatMap(
    ([difficulty, count]) =>
      Array.from({ length: count }, (_, index) => ({
        id: `${categories[index % 4]}-${difficulty}-${index}`,
        word: `${difficulty}-word-${index}`,
        phonetic: "/wɝːd/",
        partOfSpeech: "n.",
        meaning: "測試用單字",
        definition: "A word used in a study session.",
        example: "We review useful words every day.",
        translation: "我們每天複習實用單字。",
        category: categories[index % 4],
        collocation: "review words 複習單字",
        level:
          difficulty === "foundation"
            ? "基礎鞏固"
            : difficulty === "core"
              ? "800+核心"
              : "高分延伸",
        difficulty,
      })),
  );
}

describe("Daily vocabulary plan", () => {
  it("balances ten fresh words as three foundation, five core and two advanced across contexts", () => {
    const result = buildDailyStudyList(words, [], 10, "2026-10-29");
    expect(result).toHaveLength(10);
    expect(new Set(result.map((word) => word.id)).size).toBe(10);
    expect(
      new Set(result.map((word) => word.category)).size,
    ).toBeGreaterThanOrEqual(3);
    expect(
      result.filter((word) => word.difficulty === "foundation"),
    ).toHaveLength(3);
    expect(result.filter((word) => word.difficulty === "core")).toHaveLength(5);
    expect(
      result.filter((word) => word.difficulty === "advanced"),
    ).toHaveLength(2);
    expect(
      buildDailyStudyList(words, [], 10, "2026-10-29").map((word) => word.id),
    ).toEqual(result.map((word) => word.id));
  });

  it("avoids learned words and fills a depleted band from remaining unlearned bands", () => {
    const pool = makePool({ foundation: 8, core: 12, advanced: 8 });
    const learned = pool
      .filter((word) => word.difficulty === "foundation")
      .map((word) => word.id);
    learned.push(pool.find((word) => word.difficulty === "core")!.id);
    const result = buildDailyStudyList(pool, learned, 10, "2026-10-29");
    expect(result).toHaveLength(10);
    expect(new Set(result.map((word) => word.id)).size).toBe(10);
    expect(result.every((word) => !learned.includes(word.id))).toBe(true);
    expect(result.some((word) => word.difficulty === "foundation")).toBe(false);
  });

  it("returns the remaining new words without padding the session with learned vocabulary", () => {
    const pool = makePool({ foundation: 8, core: 12, advanced: 8 });
    const remaining = pool.slice(-4);
    const learned = pool.slice(0, -4).map((word) => word.id);
    const result = buildDailyStudyList(pool, learned, 10, "2026-10-29");
    expect(new Set(result.map((word) => word.id))).toEqual(
      new Set(remaining.map((word) => word.id)),
    );
    expect(result).toHaveLength(4);
  });

  it("offers a balanced review after every word has been learned", () => {
    const pool = makePool({ foundation: 8, core: 12, advanced: 8 });
    const result = buildDailyStudyList(
      pool,
      pool.map((word) => word.id),
      10,
      "2026-10-29",
    );
    expect(result).toHaveLength(10);
    expect(new Set(result.map((word) => word.id)).size).toBe(10);
    expect(
      result.filter((word) => word.difficulty === "foundation"),
    ).toHaveLength(3);
    expect(result.filter((word) => word.difficulty === "core")).toHaveLength(5);
    expect(
      result.filter((word) => word.difficulty === "advanced"),
    ).toHaveLength(2);
  });

  it("handles empty and small pools and count limits without duplicates", () => {
    expect(buildDailyStudyList([], [], 10, "2026-10-29")).toEqual([]);
    const pool = makePool({ foundation: 1, core: 2, advanced: 1 });
    expect(buildDailyStudyList(pool, [], 10, "2026-10-29")).toHaveLength(4);
    expect(buildDailyStudyList(pool, [], 0, "2026-10-29")).toEqual([]);
    expect(buildDailyStudyList(pool, [], -1, "2026-10-29")).toEqual([]);
    expect(buildDailyStudyList(pool, [], 2.9, "2026-10-29")).toHaveLength(2);
  });
});
