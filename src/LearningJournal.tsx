import { useRef, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  BookOpen,
  Check,
  Flame,
  ShieldCheck,
  Target,
  X,
} from "lucide-react";
import { grammarLessons, questions, words } from "./data";
import { localDate, streak } from "./progress";
import type { Progress } from "./progress";
import "./journal.css";

const MAX_RECORDS = 36_600;
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isDate = (value: unknown): value is string => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const date = new Date(`${value}T12:00:00`);
  return Number.isFinite(date.getTime()) && localDate(date) === value;
};

export function parseProgressBackup(text: string): Progress {
  if (text.length > 2_000_000)
    throw new Error("備份檔案過大，請選擇 daylight. 匯出的 JSON 檔案。");
  const backup: unknown = JSON.parse(text);
  if (
    !isObject(backup) ||
    backup.schemaVersion !== 1 ||
    !isObject(backup.progress)
  )
    throw new Error("這不是支援的 daylight. 進度備份。");
  const progress = backup.progress;
  const list = (key: string, allowed: Set<string>): string[] => {
    const value = progress[key];
    if (
      !Array.isArray(value) ||
      value.length > allowed.size ||
      value.some((id) => typeof id !== "string" || !allowed.has(id)) ||
      new Set(value).size !== value.length
    )
      throw new Error("備份中的學習項目無效，原有進度未變更。");
    return value as string[];
  };
  const wordIds = new Set(words.map((word) => word.id));
  const saved = list("saved", wordIds);
  const learned = list("learned", wordIds);
  const lessons = list(
    "lessons",
    new Set(grammarLessons.map((lesson) => lesson.id)),
  );
  const mistakes = list(
    "mistakes",
    new Set(questions.map((question) => question.id)),
  );
  if (
    !isObject(progress.activity) ||
    Object.keys(progress.activity).length > MAX_RECORDS
  )
    throw new Error("備份中的活動紀錄無效。");
  const entries = Object.entries(progress.activity);
  if (
    entries.some(
      ([date, count]) =>
        !isDate(date) ||
        typeof count !== "number" ||
        !Number.isSafeInteger(count) ||
        count < 0 ||
        count > 1_000_000,
    )
  )
    throw new Error("備份中的日期或練習次數無效。");
  if (
    !Array.isArray(progress.quizResults) ||
    progress.quizResults.length > MAX_RECORDS
  )
    throw new Error("備份中的測驗紀錄無效。");
  const quizResults = progress.quizResults.map((result) => {
    if (
      !isObject(result) ||
      !isDate(result.date) ||
      typeof result.score !== "number" ||
      typeof result.total !== "number" ||
      !Number.isSafeInteger(result.score) ||
      !Number.isSafeInteger(result.total) ||
      result.total < 1 ||
      result.total > questions.length ||
      result.score < 0 ||
      result.score > result.total
    )
      throw new Error("備份中的測驗分數無效。");
    return { date: result.date, score: result.score, total: result.total };
  });
  return {
    saved,
    learned,
    lessons,
    mistakes,
    activity: Object.fromEntries(entries) as Record<string, number>,
    quizResults,
  };
}

export default function LearningJournal({
  progress,
  onImport,
  onNotify,
}: {
  progress: Progress;
  onImport: (progress: Progress) => void;
  onNotify: (message: string) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Progress | null>(null);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      key: localDate(date),
      label:
        index === 6
          ? "今天"
          : date.toLocaleDateString("zh-TW", { weekday: "short" }),
      count: progress.activity[localDate(date)] ?? 0,
    };
  });
  const maxCount = Math.max(1, ...days.map((day) => day.count));
  const attempts = progress.quizResults.reduce(
    (sum, result) => sum + result.total,
    0,
  );
  const correct = progress.quizResults.reduce(
    (sum, result) => sum + result.score,
    0,
  );
  const activities = Object.values(progress.activity).reduce(
    (sum, count) => sum + count,
    0,
  );
  const recentResults = progress.quizResults.slice(-5).reverse();

  function download() {
    try {
      const data = JSON.stringify(
        { schemaVersion: 1, exportedAt: new Date().toISOString(), progress },
        null,
        2,
      );
      const url = URL.createObjectURL(
        new Blob([data], { type: "application/json" }),
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `daylight-progress-${localDate()}.json`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      onNotify("已產生進度備份，請確認檔案已下載。");
    } catch {
      onNotify("暫時無法下載備份，請再試一次。");
    }
  }

  async function importFile(file: File | undefined) {
    setPending(null);
    setError("");
    if (!file) return;
    setImporting(true);
    try {
      if (file.size > 2_000_000)
        throw new Error("備份檔案過大，請選擇 daylight. 匯出的 JSON 檔案。");
      setPending(parseProgressBackup(await file.text()));
    } catch (cause) {
      const message =
        cause instanceof SyntaxError
          ? "無法讀取 JSON 格式，請選擇有效的進度備份。"
          : cause instanceof Error
            ? cause.message
            : "無法讀取這份備份。";
      setError(message);
      onNotify("備份未匯入，原有進度未變更。");
    } finally {
      setImporting(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div className="journal-page">
      <div className="journal-stats">
        <article>
          <span className="journal-stat-icon sage">
            <BookOpen size={21} />
          </span>
          <div>
            <strong>
              {progress.learned.length}
              <small> / {words.length}</small>
            </strong>
            <span>已記住的單字</span>
          </div>
        </article>
        <article>
          <span className="journal-stat-icon peach">
            <Flame size={21} />
          </span>
          <div>
            <strong>
              {streak(progress.activity)}
              <small> 天</small>
            </strong>
            <span>連續學習</span>
          </div>
        </article>
        <article>
          <span className="journal-stat-icon lavender">
            <Target size={21} />
          </span>
          <div>
            <strong>
              {attempts ? Math.round((correct / attempts) * 100) : "—"}
              <small>{attempts ? "%" : ""}</small>
            </strong>
            <span>
              {attempts
                ? `已完成測驗的正確率 · ${attempts} 題`
                : "完成第一輪測驗後顯示正確率"}
            </span>
          </div>
        </article>
      </div>
      <div className="journal-main-grid">
        <section className="journal-panel">
          <div className="journal-section-title">
            <div>
              <span className="eyebrow">LITTLE BY LITTLE</span>
              <h2>最近 7 天的累積</h2>
            </div>
            <span className="journal-total">
              <Activity size={15} /> 累計 {activities} 次練習
            </span>
          </div>
          <div
            className="journal-chart"
            role="img"
            aria-label={`最近七天練習次數：${days.map((day) => `${day.label} ${day.count} 次`).join("，")}`}
          >
            {days.map((day, index) => (
              <div
                className={`journal-column ${index === 6 ? "today" : ""}`}
                key={day.key}
              >
                <strong>{day.count}</strong>
                <div className="journal-bar-track">
                  <div
                    className="journal-bar"
                    style={{
                      height: `${(day.count / maxCount) * 100}%`,
                      minHeight: day.count ? 8 : 3,
                    }}
                  />
                </div>
                <span>{day.label}</span>
              </div>
            ))}
          </div>
          <p className="journal-caption">
            完成一張單字卡、一題測驗或一篇文法，即累積一次練習。
          </p>
        </section>
        <section className="journal-panel">
          <div className="journal-section-title">
            <div>
              <span className="eyebrow">A CLEARER PICTURE</span>
              <h2>學習小結</h2>
            </div>
          </div>
          <div className="journal-summary-row">
            <span>完成文法課程</span>
            <strong>
              {progress.lessons.length} / {grammarLessons.length} 篇
            </strong>
          </div>
          <div className="journal-summary-row">
            <span>收藏的單字</span>
            <strong>{progress.saved.length} 個</strong>
          </div>
          <div className="journal-summary-row">
            <span>待加強的錯題</span>
            <strong>{progress.mistakes.length} 題</strong>
          </div>
          <div className="journal-summary-row">
            <span>完成的測驗</span>
            <strong>{progress.quizResults.length} 輪</strong>
          </div>
          <div className="journal-note">
            <Check size={17} />
            <span>不必每天都完美，願意回來就是進步。</span>
          </div>
        </section>
      </div>
      {recentResults.length > 0 && (
        <section className="journal-panel journal-recent">
          <div className="journal-section-title">
            <div>
              <span className="eyebrow">LOOK HOW FAR YOU'VE COME</span>
              <h2>最近的測驗</h2>
            </div>
          </div>
          {recentResults.map((result, index) => (
            <div
              className="journal-summary-row"
              key={`${result.date}-${index}`}
            >
              <span>
                {result.date}{" "}
                <span className="journal-result-label">隨堂測驗</span>
              </span>
              <strong>
                {result.score} / {result.total} 題正確
              </strong>
            </div>
          ))}
        </section>
      )}
      <section className="journal-panel journal-backup">
        <div className="journal-backup-heading">
          <span className="journal-stat-icon sage">
            <ShieldCheck size={23} />
          </span>
          <div>
            <h2>把學習進度，好好收著。</h2>
            <p>
              進度只存在目前的瀏覽器，沒有雲端同步。定期備份，換裝置也能接著學。
            </p>
          </div>
        </div>
        <div className="journal-backup-actions">
          <button className="button outline" onClick={download}>
            <ArrowDownToLine size={17} /> 匯出進度備份
          </button>
          <button
            className="button outline"
            disabled={importing}
            onClick={() => fileInput.current?.click()}
          >
            <ArrowUpFromLine size={17} /> {importing ? "正在讀取…" : "匯入備份"}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            aria-label="選擇進度備份檔"
            className="journal-file-input"
            onChange={(event) => {
              void importFile(event.target.files?.[0]);
            }}
          />
        </div>
        {error && (
          <p className="journal-error" role="alert">
            {error}
          </p>
        )}
        {pending && (
          <div
            className="journal-import-preview"
            role="region"
            aria-label="匯入備份預覽"
          >
            <button
              className="icon-button journal-cancel-import"
              onClick={() => setPending(null)}
              aria-label="取消匯入"
            >
              <X size={18} />
            </button>
            <h3>確認這份備份</h3>
            <p>
              已記住 {pending.learned.length} 個單字 · 完成{" "}
              {pending.lessons.length} 篇文法 · {pending.quizResults.length}{" "}
              輪測驗
            </p>
            <p>
              確認後會<strong>取代目前瀏覽器的全部學習進度與收藏</strong>
              ，無法自動合併。建議先匯出目前進度。
            </p>
            <button
              className="button primary"
              onClick={() => {
                onImport(pending);
                setPending(null);
                onNotify("已套用備份；請留意頁面上的本機儲存狀態。");
              }}
            >
              確認取代並匯入 <Check size={17} />
            </button>
          </div>
        )}
        <p className="journal-caption">
          清除網站資料、使用無痕模式或更換網站網址，可能造成進度遺失。備份包含單字、文法、測驗與收藏。
        </p>
      </section>
    </div>
  );
}
