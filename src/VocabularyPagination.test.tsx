import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { words } from "./data";

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("scrollTo", vi.fn());
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Expanded vocabulary library", () => {
  it("loads cards in batches and searches all 480 words, including cards not loaded yet", async () => {
    const user = userEvent.setup();
    render(<App />);
    const navigation = screen.getByRole("navigation", { name: "主要導覽" });
    await user.click(
      within(navigation).getByRole("button", { name: "單字學習" }),
    );
    expect(document.querySelectorAll(".word-card")).toHaveLength(24);
    expect(screen.getByText("顯示 24 / 480 個單字")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "載入更多單字" }));
    expect(document.querySelectorAll(".word-card")).toHaveLength(48);
    const lastWord = words.at(-1)!;
    const search = screen.getByRole("textbox", { name: "搜尋單字或中文意思" });
    await user.type(search, lastWord.word);
    expect(
      screen.getByRole("heading", { name: lastWord.word }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "載入更多單字" }),
    ).not.toBeInTheDocument();
    await user.clear(search);
    expect(document.querySelectorAll(".word-card")).toHaveLength(24);
    await user.click(screen.getByRole("button", { name: "旅行與交通" }));
    expect(screen.getByText("顯示 24 / 120 個單字")).toBeInTheDocument();
    await user.type(search, lastWord.word);
    expect(screen.getByText("還沒找到這個單字")).toBeInTheDocument();
  });

  it("combines category, study band and search while resetting the loaded batch", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      within(screen.getByRole("navigation", { name: "主要導覽" })).getByRole(
        "button",
        { name: "單字學習" },
      ),
    );
    await user.click(screen.getByRole("button", { name: "載入更多單字" }));
    expect(document.querySelectorAll(".word-card")).toHaveLength(48);

    const difficulty = screen.getByRole("group", { name: "單字難度" });
    await user.click(
      within(difficulty).getByRole("button", { name: /高分延伸/ }),
    );
    const advanced = words.filter((word) => word.difficulty === "advanced");
    expect(document.querySelectorAll(".word-card")).toHaveLength(
      Math.min(24, advanced.length),
    );
    expect(
      screen.getByText(
        `顯示 ${Math.min(24, advanced.length)} / ${advanced.length} 個單字`,
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "旅行與交通" }));
    const travelAdvanced = advanced.filter(
      (word) => word.category === "travel",
    );
    expect(
      screen.getByText(
        `顯示 ${Math.min(24, travelAdvanced.length)} / ${travelAdvanced.length} 個單字`,
      ),
    ).toBeInTheDocument();
    for (const card of document.querySelectorAll<HTMLElement>(".word-card")) {
      const heading = within(card).getByRole("heading").textContent;
      const word = words.find((item) => item.word === heading)!;
      expect(word.category).toBe("travel");
      expect(word.difficulty).toBe("advanced");
    }

    const target = travelAdvanced.at(-1)!;
    const search = screen.getByRole("textbox", { name: "搜尋單字或中文意思" });
    await user.type(search, target.word);
    expect(
      screen.getByRole("heading", { name: target.word }),
    ).toBeInTheDocument();
    const expected = travelAdvanced.filter((word) =>
      `${word.word} ${word.meaning} ${word.collocation}`
        .toLowerCase()
        .includes(target.word.toLowerCase()),
    );
    expect(document.querySelectorAll(".word-card")).toHaveLength(
      expected.length,
    );

    await user.click(
      within(difficulty).getByRole("button", { name: /基礎鞏固/ }),
    );
    expect(screen.getByText("還沒找到這個單字")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "清除篩選" }));
    expect(search).toHaveValue("");
    expect(document.querySelectorAll(".word-card")).toHaveLength(24);
    expect(screen.getByText("顯示 24 / 480 個單字")).toBeInTheDocument();
  });

  it("starts the daily session with foundations, core and advanced words together", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "開始今日學習" }));
    const counts = { foundation: 0, core: 0, advanced: 0 };
    const categories = new Set<string>();
    const learnedIds = new Set<string>();
    for (let index = 0; index < 10; index++) {
      const dialog = screen.getByRole("dialog", { name: "單字卡練習" });
      const heading = dialog.querySelector(".study-word h2")?.textContent;
      const word = words.find((item) => item.word === heading)!;
      expect(word).toBeDefined();
      counts[word.difficulty]++;
      categories.add(word.category);
      learnedIds.add(word.id);
      await user.click(
        within(dialog).getByRole("button", { name: "看看解答" }),
      );
      await user.click(
        within(dialog).getByRole("button", { name: "還要再練習" }),
      );
    }
    expect(counts).toEqual({ foundation: 3, core: 5, advanced: 2 });
    expect(learnedIds.size).toBe(10);
    expect(categories.size).toBeGreaterThanOrEqual(3);
    expect(
      screen.getByRole("heading", { name: "又為自己，累積了一點。" }),
    ).toBeInTheDocument();
  });
});
