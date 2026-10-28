export interface Progress {
  saved: string[];
  learned: string[];
  lessons: string[];
  mistakes: string[];
  activity: Record<string, number>;
  quizResults: { date: string; score: number; total: number }[];
}

export const STORAGE_KEY = "daylight-progress-v1";
export const emptyProgress: Progress = {
  saved: [],
  learned: [],
  lessons: [],
  mistakes: [],
  activity: {},
  quizResults: [],
};
export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function loadProgress(): Progress {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!value || typeof value !== "object") return { ...emptyProgress };
    const stringList = (item: unknown): string[] =>
      Array.isArray(item)
        ? item.filter((v): v is string => typeof v === "string")
        : [];
    return {
      saved: stringList(value.saved),
      learned: stringList(value.learned),
      lessons: stringList(value.lessons),
      mistakes: stringList(value.mistakes),
      activity: Object.fromEntries(
        Object.entries(
          value.activity && typeof value.activity === "object"
            ? value.activity
            : {},
        ).filter(
          (entry): entry is [string, number] =>
            typeof entry[1] === "number" &&
            Number.isFinite(entry[1]) &&
            entry[1] >= 0,
        ),
      ),
      quizResults: Array.isArray(value.quizResults)
        ? value.quizResults.filter(
            (v: unknown): v is Progress["quizResults"][number] =>
              !!v &&
              typeof v === "object" &&
              typeof (v as { date?: unknown }).date === "string" &&
              Number.isInteger((v as { score?: unknown }).score) &&
              Number.isInteger((v as { total?: unknown }).total),
          )
        : [],
    };
  } catch {
    return { ...emptyProgress };
  }
}
export function streak(activity: Record<string, number>): number {
  const date = new Date();
  if (!activity[localDate(date)]) date.setDate(date.getDate() - 1);
  let count = 0;
  while (activity[localDate(date)] > 0 && count < 36600) {
    count++;
    date.setDate(date.getDate() - 1);
  }
  return count;
}
