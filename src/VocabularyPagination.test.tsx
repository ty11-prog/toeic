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
  it("loads cards in batches and searches all 320 words, including cards not loaded yet", async () => {
    const user = userEvent.setup();
    render(<App />);
    const navigation = screen.getByRole("navigation", { name: "主要導覽" });
    await user.click(
      within(navigation).getByRole("button", { name: "單字學習" }),
    );
    expect(document.querySelectorAll(".word-card")).toHaveLength(24);
    expect(screen.getByText("顯示 24 / 320 個單字")).toBeInTheDocument();
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
    await user.click(
      screen.getByRole("button", { name: "旅行與交通" }),
    );
    expect(screen.getByText("顯示 24 / 80 個單字")).toBeInTheDocument();
    await user.type(search, lastWord.word);
    expect(screen.getByText("還沒找到這個單字")).toBeInTheDocument();
  });
});
