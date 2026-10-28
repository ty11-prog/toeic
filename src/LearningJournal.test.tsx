import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LearningJournal, { parseProgressBackup } from "./LearningJournal";
import { grammarLessons, questions, words } from "./data";
import { localDate } from "./progress";
import type { Progress } from "./progress";

function progress(): Progress {
  return {
    saved: [words[0].id],
    learned: [words[1].id],
    lessons: [grammarLessons[0].id],
    mistakes: [questions[0].id],
    activity: { "2024-02-29": 3 },
    quizResults: [{ date: "2024-02-29", score: 2, total: 3 }],
  };
}
const encode = (value: Progress) =>
  JSON.stringify({
    schemaVersion: 1,
    exportedAt: "2024-02-29T12:00:00.000Z",
    progress: value,
  });
function backupFile(text: string) {
  const file = new File([text], "daylight-progress.json", {
    type: "application/json",
  });
  Object.defineProperty(file, "text", { value: async () => text });
  return file;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("progress backup validation", () => {
  it("accepts the exported shape and preserves real learning records", () => {
    expect(parseProgressBackup(encode(progress()))).toEqual(progress());
    const empty: Progress = {
      saved: [],
      learned: [],
      lessons: [],
      mistakes: [],
      activity: {},
      quizResults: [],
    };
    expect(parseProgressBackup(encode(empty))).toEqual(empty);
  });

  it.each([
    "2025-02-29",
    "2024-02-30",
    "2024-13-01",
    "2024-00-10",
    "2024-2-03",
    "not-a-date",
  ])("rejects invalid calendar dates (%s)", (date) => {
    const value = progress();
    value.activity = { [date]: 1 };
    expect(() => parseProgressBackup(encode(value))).toThrow(/日期/);
    value.activity = {};
    value.quizResults[0].date = date;
    expect(() => parseProgressBackup(encode(value))).toThrow(/測驗分數/);
  });

  it.each(["saved", "learned", "lessons", "mistakes"] as const)(
    "rejects unknown or repeated IDs in %s",
    (key) => {
      const value = progress();
      value[key] = ["unknown-id"];
      expect(() => parseProgressBackup(encode(value))).toThrow(/學習項目/);
      const valid = progress();
      valid[key] = [valid[key][0], valid[key][0]];
      expect(() => parseProgressBackup(encode(valid))).toThrow(/學習項目/);
    },
  );

  it.each([
    { score: 4, total: 3 },
    { score: -1, total: 3 },
    { score: 1.5, total: 3 },
    { score: 0, total: 0 },
    { score: 1, total: questions.length + 1 },
  ])("rejects impossible quiz scores: $score / $total", (result) => {
    const value = progress();
    value.quizResults = [{ date: "2024-02-29", ...result }];
    expect(() => parseProgressBackup(encode(value))).toThrow(/測驗分數/);
  });

  it.each([-1, 1.5, 1_000_001])(
    "rejects invalid activity count %s",
    (count) => {
      const value = progress();
      value.activity = { "2024-02-29": count };
      expect(() => parseProgressBackup(encode(value))).toThrow(/練習次數/);
    },
  );

  it("rejects malformed, unsupported, incomplete and oversized backups", () => {
    expect(() => parseProgressBackup("{")).toThrow();
    expect(() =>
      parseProgressBackup(
        JSON.stringify({ schemaVersion: 2, progress: progress() }),
      ),
    ).toThrow(/支援/);
    expect(() =>
      parseProgressBackup(JSON.stringify({ schemaVersion: 1, progress: {} })),
    ).toThrow();
    expect(() => parseProgressBackup(" ".repeat(2_000_001))).toThrow(/過大/);
  });
});

describe("progress backup interface", () => {
  it("previews an import and waits for explicit confirmation before replacing progress", async () => {
    const user = userEvent.setup();
    const onImport = vi.fn(),
      onNotify = vi.fn();
    render(
      <LearningJournal
        progress={progress()}
        onImport={onImport}
        onNotify={onNotify}
      />,
    );
    const incoming = progress();
    incoming.learned = [words[0].id, words[1].id];
    await user.upload(
      screen.getByLabelText("選擇進度備份檔"),
      backupFile(encode(incoming)),
    );
    const preview = await screen.findByRole("region", { name: "匯入備份預覽" });
    expect(preview).toHaveTextContent("已記住 2 個單字");
    expect(preview).toHaveTextContent("取代目前瀏覽器的全部學習進度與收藏");
    expect(onImport).not.toHaveBeenCalled();
    await user.click(
      within(preview).getByRole("button", { name: "確認取代並匯入" }),
    );
    expect(onImport).toHaveBeenCalledExactlyOnceWith(incoming);
    expect(
      screen.queryByRole("region", { name: "匯入備份預覽" }),
    ).not.toBeInTheDocument();
  });

  it("cancels a valid preview without applying it, then rejects invalid files without changing progress", async () => {
    const user = userEvent.setup();
    const onImport = vi.fn(),
      onNotify = vi.fn();
    render(
      <LearningJournal
        progress={progress()}
        onImport={onImport}
        onNotify={onNotify}
      />,
    );
    await user.upload(
      screen.getByLabelText("選擇進度備份檔"),
      backupFile(encode(progress())),
    );
    await user.click(await screen.findByRole("button", { name: "取消匯入" }));
    expect(onImport).not.toHaveBeenCalled();
    await user.upload(
      screen.getByLabelText("選擇進度備份檔"),
      backupFile("{bad json"),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "無法讀取 JSON 格式",
    );
    expect(onImport).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(onNotify).toHaveBeenCalledWith("備份未匯入，原有進度未變更。"),
    );
  });

  it("renders actual daily activities and weighted quiz accuracy", () => {
    const value = progress();
    value.activity = { [localDate()]: 4 };
    value.quizResults = [
      { date: localDate(), score: 1, total: 2 },
      { date: localDate(), score: 3, total: 3 },
    ];
    render(
      <LearningJournal
        progress={value}
        onImport={vi.fn()}
        onNotify={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("img", { name: /最近七天練習次數/ }),
    ).toHaveAccessibleName(/今天 4 次/);
    expect(screen.getByText("80")).toBeInTheDocument();
    expect(screen.getByText("累計 4 次練習")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });
});
