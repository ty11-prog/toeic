import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { grammarLessons, words } from "./data";
import { SPEECH_STORAGE_KEY } from "./useSpeech";

const american: SpeechSynthesisVoice = {
  name: "Aria Natural",
  lang: "en-US",
  voiceURI: "aria-english",
  default: true,
  localService: true,
};
const british: SpeechSynthesisVoice = {
  name: "Daniel",
  lang: "en-GB",
  voiceURI: "daniel-british",
  default: false,
  localService: true,
};
class MockUtterance {
  text: string;
  lang = "";
  rate = 1;
  pitch = 1;
  volume = 1;
  voice: SpeechSynthesisVoice | null = null;
  onstart = null;
  onend = null;
  onerror = null;
  constructor(text: string) {
    this.text = text;
  }
}
let speak: ReturnType<typeof vi.fn>;
let cancel: ReturnType<typeof vi.fn>;

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("scrollTo", vi.fn());
  const events = new EventTarget();
  speak = vi.fn();
  cancel = vi.fn();
  vi.stubGlobal("speechSynthesis", {
    getVoices: () => [american, british],
    speak,
    cancel,
    pause: vi.fn(),
    resume: vi.fn(),
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
  });
  vi.stubGlobal("SpeechSynthesisUtterance", MockUtterance);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const bottomNavigation = () =>
  screen.getByRole("navigation", { name: "手機分頁導航" });
const sidebarNavigation = () =>
  screen.getByRole("navigation", { name: "主要導覽" });
const lastUtterance = () =>
  speak.mock.calls.at(-1)![0] as SpeechSynthesisUtterance;

describe("Mobile navigation and sentence speech", () => {
  it("provides five bottom tabs with an active page while preserving the original navigation", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(within(bottomNavigation()).getAllByRole("button")).toHaveLength(5);
    expect(
      within(bottomNavigation()).getByRole("button", { name: "今日" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(sidebarNavigation()).getByRole("button", { name: "我的收藏" }),
    ).toBeInTheDocument();
    await user.click(
      within(bottomNavigation()).getByRole("button", { name: "單字" }),
    );
    expect(
      screen.getByRole("textbox", { name: "搜尋單字或中文意思" }),
    ).toBeInTheDocument();
    expect(
      within(bottomNavigation()).getByRole("button", { name: "單字" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(bottomNavigation()).getByRole("button", { name: "今日" }),
    ).not.toHaveAttribute("aria-current");
    await user.click(
      within(bottomNavigation()).getByRole("button", { name: "足跡" }),
    );
    expect(
      screen.getByRole("button", { name: "匯出進度備份" }),
    ).toBeInTheDocument();
    await user.click(
      within(bottomNavigation()).getByRole("button", { name: "設定" }),
    );
    expect(
      screen.getByRole("heading", { name: "找到聽起來，最自在的英文。" }),
    ).toBeInTheDocument();
    expect(
      within(sidebarNavigation()).getByRole("button", { name: "語音設定" }),
    ).toHaveAttribute("aria-current", "page");
    expect(speak).not.toHaveBeenCalled();
  });

  it("reads the daily English example and stops playback when navigating away", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "朗讀每日例句" }));
    const todayWord = words[Math.floor(Date.now() / 86400000) % words.length];
    expect(lastUtterance()).toMatchObject({
      text: todayWord.example,
      lang: "en-US",
      voice: american,
    });
    expect(
      screen.getByRole("button", { name: "停止朗讀每日例句" }),
    ).toHaveAttribute("aria-pressed", "true");
    cancel.mockClear();
    await user.click(
      within(bottomNavigation()).getByRole("button", { name: "單字" }),
    );
    expect(cancel).toHaveBeenCalled();
  });

  it("reads vocabulary and grammar examples and stops speech when closing their dialogs", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      within(bottomNavigation()).getByRole("button", { name: "單字" }),
    );
    await user.type(
      screen.getByRole("textbox", { name: "搜尋單字或中文意思" }),
      "deadline",
    );
    await user.click(screen.getByRole("button", { name: "單字卡練習" }));
    expect(
      screen.queryByRole("navigation", { name: "手機分頁導航" }),
    ).not.toBeInTheDocument();
    let dialog = screen.getByRole("dialog", { name: "單字卡練習" });
    await user.click(within(dialog).getByRole("button", { name: "看看解答" }));
    await user.click(
      within(dialog).getByRole("button", { name: "朗讀單字例句" }),
    );
    expect(lastUtterance().text).toBe(
      words.find((word) => word.word === "deadline")!.example,
    );
    cancel.mockClear();
    await user.keyboard("{Escape}");
    expect(cancel).toHaveBeenCalled();
    expect(bottomNavigation()).toBeInTheDocument();
    await user.click(
      within(bottomNavigation()).getByRole("button", { name: "文法" }),
    );
    await user.click(
      screen.getByRole("button", { name: new RegExp(grammarLessons[0].title) }),
    );
    dialog = screen.getByRole("dialog", { name: grammarLessons[0].title });
    await user.click(
      within(dialog).getByRole("button", { name: "朗讀文法例句 1" }),
    );
    expect(lastUtterance().text).toBe(grammarLessons[0].examples[0].english);
    cancel.mockClear();
    await user.click(within(dialog).getByRole("button", { name: "關閉視窗" }));
    expect(cancel).toHaveBeenCalled();
  });

  it("applies a chosen voice and speed to preview and examples, and restores settings after reload", async () => {
    const user = userEvent.setup();
    const view = render(<App />);
    await user.click(
      within(bottomNavigation()).getByRole("button", { name: "設定" }),
    );
    const accentSelect = screen
      .getAllByRole("combobox")
      .find((select) =>
        Array.from((select as HTMLSelectElement).options).some(
          (option) => option.value === "en-GB",
        ),
      );
    expect(accentSelect).toBeDefined();
    await user.selectOptions(accentSelect!, "en-GB");
    const voiceSelect = screen
      .getAllByRole("combobox")
      .find((select) =>
        within(select).queryByRole("option", { name: /Daniel/ }),
      );
    expect(voiceSelect).toBeDefined();
    await user.selectOptions(voiceSelect!, british.voiceURI);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "0.8" } });
    await user.click(screen.getByRole("button", { name: /試聽/ }));
    expect(lastUtterance()).toMatchObject({
      lang: "en-GB",
      voice: british,
      rate: 0.8,
    });
    expect(lastUtterance().text.length).toBeGreaterThan(20);
    expect(JSON.parse(localStorage.getItem(SPEECH_STORAGE_KEY)!)).toMatchObject(
      { voiceURI: british.voiceURI, rate: 0.8 },
    );
    await user.click(
      within(bottomNavigation()).getByRole("button", { name: "今日" }),
    );
    await user.click(screen.getByRole("button", { name: "朗讀每日例句" }));
    expect(lastUtterance()).toMatchObject({
      lang: "en-GB",
      voice: british,
      rate: 0.8,
    });
    view.unmount();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "朗讀每日例句" }));
    expect(lastUtterance()).toMatchObject({
      lang: "en-GB",
      voice: british,
      rate: 0.8,
    });
  });
});
