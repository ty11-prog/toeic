import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { grammarLessons, questions, words } from "./data";
import { STORAGE_KEY, localDate } from "./progress";
import type { Progress } from "./progress";

function savedProgress(): Progress {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)!);
}

async function navigate(
  user: ReturnType<typeof userEvent.setup>,
  label: string,
) {
  await user.click(
    within(screen.getByRole("navigation", { name: "主要導覽" })).getByRole(
      "button",
      { name: new RegExp(label) },
    ),
  );
}

function currentQuestion() {
  const prompt = document.querySelector(".quiz-panel h2")?.textContent;
  const question = questions.find((item) => item.prompt === prompt);
  if (!question) throw new Error(`Unexpected quiz prompt: ${prompt}`);
  return question;
}

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("scrollTo", vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("English learning journeys", () => {
  it("searches vocabulary in English and Chinese, and combines search with category filters", async () => {
    const user = userEvent.setup();
    render(<App />);
    await navigate(user, "單字學習");
    const search = screen.getByPlaceholderText("搜尋單字、中文意思…");
    await user.type(search, "deadline");
    expect(
      screen.getByRole("heading", { name: "deadline" }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll(".word-card")).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "旅行與交通" }));
    expect(screen.getByText("還沒找到這個單字")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "單字卡練習" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "清除篩選" }));
    await user.type(search, "截止期限");
    expect(
      screen.getByRole("heading", { name: "deadline" }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll(".word-card")).toHaveLength(1);
  });

  it("persists bookmarks across remounts and removes words from the collection", async () => {
    const user = userEvent.setup();
    const view = render(<App />);
    await navigate(user, "單字學習");
    await user.click(screen.getByRole("button", { name: "收藏 deadline" }));
    expect(savedProgress().saved).toContain("work-deadline");
    view.unmount();
    render(<App />);
    await navigate(user, "我的收藏");
    expect(
      screen.getByRole("heading", { name: "deadline" }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll(".word-card")).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "取消收藏 deadline" }));
    expect(savedProgress().saved).toEqual([]);
    expect(screen.getByText("給想記住的單字，一個位置。")).toBeInTheDocument();
  });

  it("reveals a flashcard, records mastery once, and restores focus after closing", async () => {
    const user = userEvent.setup();
    render(<App />);
    await navigate(user, "單字學習");
    await user.type(
      screen.getByPlaceholderText("搜尋單字、中文意思…"),
      "deadline",
    );
    const start = screen.getByRole("button", { name: "單字卡練習" });
    await user.click(start);
    let dialog = screen.getByRole("dialog", { name: "單字卡練習" });
    expect(
      within(dialog).queryByText(words[0].definition),
    ).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "看看解答" }));
    expect(within(dialog).getByText(words[0].definition)).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "我記住了" }));
    expect(savedProgress().learned).toEqual(["work-deadline"]);
    expect(savedProgress().activity[localDate()]).toBe(1);
    await user.click(within(dialog).getByRole("button", { name: "完成練習" }));
    expect(start).toHaveFocus();
    await user.click(start);
    dialog = screen.getByRole("dialog", { name: "單字卡練習" });
    await user.click(within(dialog).getByRole("button", { name: "看看解答" }));
    await user.click(within(dialog).getByRole("button", { name: "我記住了" }));
    expect(savedProgress().learned).toEqual(["work-deadline"]);
    expect(savedProgress().activity[localDate()]).toBe(1);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens a complete grammar lesson and records completion", async () => {
    const user = userEvent.setup();
    render(<App />);
    await navigate(user, "文法攻略");
    const lesson = grammarLessons[0];
    await user.click(
      screen.getByRole("button", { name: new RegExp(lesson.title) }),
    );
    const dialog = screen.getByRole("dialog", { name: lesson.title });
    expect(within(dialog).getByText(lesson.rule)).toBeInTheDocument();
    expect(within(dialog).getByText(lesson.structure)).toBeInTheDocument();
    for (const example of lesson.examples) {
      expect(within(dialog).getByText(example.english)).toBeInTheDocument();
      expect(within(dialog).getByText(example.chinese)).toBeInTheDocument();
    }
    await user.click(
      within(dialog).getByRole("button", { name: "我理解了，完成主題" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(savedProgress().lessons).toContain(lesson.id);
    expect(
      screen.getByText(`1 / ${grammarLessons.length} 已完成`),
    ).toBeInTheDocument();
  });

  it("explains an incorrect answer, adds a mistake, and clears it after successful review", async () => {
    const user = userEvent.setup();
    render(<App />);
    await navigate(user, "隨堂測驗");
    await user.click(screen.getByRole("button", { name: /綜合小測驗/ }));
    expect(screen.getByRole("button", { name: "確認答案" })).toBeDisabled();
    const question = currentQuestion();
    const wrongAnswer =
      question.options[(question.answer + 1) % question.options.length];
    await user.click(
      screen.getByRole("button", {
        name: new RegExp(wrongAnswer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      }),
    );
    await user.click(screen.getByRole("button", { name: "確認答案" }));
    expect(screen.getByText(question.explanation)).toBeInTheDocument();
    expect(savedProgress().mistakes).toContain(question.id);
    await user.click(screen.getByRole("button", { name: "下一題" }));
    expect(document.querySelector(".quiz-panel-top")?.textContent).toContain(
      "2 / 10",
    );
    await user.click(screen.getByRole("button", { name: "離開練習" }));
    await user.click(screen.getByRole("button", { name: "複習錯題" }));
    expect(currentQuestion().id).toBe(question.id);
    const options =
      document.querySelectorAll<HTMLButtonElement>(".answer-option");
    await user.click(options[question.answer]);
    await user.click(screen.getByRole("button", { name: "確認答案" }));
    expect(savedProgress().mistakes).not.toContain(question.id);
    await user.click(screen.getByRole("button", { name: "查看學習成果" }));
    expect(savedProgress().quizResults).toEqual([
      { date: localDate(), score: 1, total: 1 },
    ]);
  });

  it("completes ten mixed questions and updates the dashboard accuracy", async () => {
    const user = userEvent.setup();
    render(<App />);
    await navigate(user, "隨堂測驗");
    await user.click(screen.getByRole("button", { name: /綜合小測驗/ }));
    for (let index = 0; index < 10; index++) {
      const question = currentQuestion();
      const options =
        document.querySelectorAll<HTMLButtonElement>(".answer-option");
      await user.click(options[question.answer]);
      await user.click(screen.getByRole("button", { name: "確認答案" }));
      expect(screen.getByText("答對了！")).toBeInTheDocument();
      await user.click(
        screen.getByRole("button", {
          name: index === 9 ? "查看學習成果" : "下一題",
        }),
      );
    }
    expect(
      screen.getByRole("heading", { name: "太棒了，每一題都答對！" }),
    ).toBeInTheDocument();
    expect(savedProgress().quizResults).toEqual([
      { date: localDate(), score: 10, total: 10 },
    ]);
    expect(savedProgress().activity[localDate()]).toBe(10);
    await navigate(user, "學習總覽");
    const stats = screen.getByRole("region", { name: "學習統計" });
    expect(stats).toHaveTextContent("測驗正確率100 %");
    expect(stats).toHaveTextContent("10 / 10 次學習");
  });
});
