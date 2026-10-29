import type { Word, VocabularyDifficulty } from "./data";

const tierOrder: VocabularyDifficulty[] = ["foundation", "core", "advanced"];
const pattern: VocabularyDifficulty[] = [
  "core",
  "foundation",
  "core",
  "advanced",
  "core",
  "foundation",
  "core",
  "advanced",
  "core",
  "foundation",
];
const categories = ["work", "travel", "business", "daily"] as const;

function hash(text: string): number {
  let value = 0;
  for (const character of text)
    value = (Math.imul(value, 31) + character.charCodeAt(0)) >>> 0;
  return value;
}

function mixCategories(words: Word[], seed: number): Word[] {
  const queues = categories.map((category, index) => {
    const list = words.filter((word) => word.category === category);
    if (!list.length) return list;
    const start = (seed + index * 17) % list.length;
    return [...list.slice(start), ...list.slice(0, start)];
  });
  const result: Word[] = [];
  while (queues.some((queue) => queue.length)) {
    for (let index = 0; index < categories.length; index++) {
      const word =
        queues[
          (index + (seed % categories.length)) % categories.length
        ].shift();
      if (word) result.push(word);
    }
  }
  return result;
}

/** Balanced new-word practice, with review only when every available word is learned. */
export function buildDailyStudyList(
  words: Word[],
  learnedIds: readonly string[],
  count = 10,
  dayKey = "daily",
): Word[] {
  if (!Number.isFinite(count) || count <= 0) return [];
  const unique = [...new Map(words.map((word) => [word.id, word])).values()];
  const learned = new Set(learnedIds);
  const unlearned = unique.filter((word) => !learned.has(word.id));
  const pool = unlearned.length ? unlearned : unique;
  const target = Math.min(Math.floor(count), pool.length);
  const seed = hash(dayKey);
  const queues = Object.fromEntries(
    tierOrder.map((tier) => [
      tier,
      mixCategories(
        pool.filter((word) => word.difficulty === tier),
        seed,
      ),
    ]),
  ) as Record<VocabularyDifficulty, Word[]>;
  const weights = { foundation: 0.3, core: 0.5, advanced: 0.2 };
  const quotas = Object.fromEntries(
    tierOrder.map((tier) => [tier, Math.floor(target * weights[tier])]),
  ) as Record<VocabularyDifficulty, number>;
  const remainderOrder = [...tierOrder].sort(
    (a, b) => ((target * weights[b]) % 1) - ((target * weights[a]) % 1),
  );
  for (
    let left =
        target - Object.values(quotas).reduce((sum, value) => sum + value, 0),
      index = 0;
    left > 0;
    left--, index++
  )
    quotas[remainderOrder[index % remainderOrder.length]]++;
  const selected = Object.fromEntries(
    tierOrder.map((tier) => [tier, queues[tier].splice(0, quotas[tier])]),
  ) as Record<VocabularyDifficulty, Word[]>;
  let missing =
    target -
    Object.values(selected).reduce((sum, list) => sum + list.length, 0);
  while (missing > 0) {
    for (const tier of ["core", "foundation", "advanced"] as const) {
      if (missing === 0) break;
      const word = queues[tier].shift();
      if (word) {
        selected[tier].push(word);
        missing--;
      }
    }
  }
  const result: Word[] = [];
  while (result.length < target) {
    for (const tier of pattern) {
      const word = selected[tier].shift();
      if (word) result.push(word);
    }
  }
  return result;
}
