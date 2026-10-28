import { describe, expect, it } from "vitest";
import { words, grammarLessons, questions } from "./data";

// Published IDs must remain available for existing progress and backup files.
const legacyIds = {
  words: [
    "work-deadline",
    "work-collaborate",
    "work-efficient",
    "work-assignment",
    "work-prioritize",
    "work-reschedule",
    "work-qualified",
    "work-initiative",
    "travel-itinerary",
    "travel-accommodation",
    "travel-departure",
    "travel-reservation",
    "travel-complimentary",
    "travel-convenient",
    "travel-reimburse",
    "travel-destination",
    "business-revenue",
    "business-negotiate",
    "business-invoice",
    "business-purchase",
    "business-supplier",
    "business-expansion",
    "business-competitive",
    "business-guarantee",
    "daily-perspective",
    "daily-maintain",
    "daily-available",
    "daily-recommend",
    "daily-considerable",
    "daily-alternative",
    "daily-beneficial",
    "daily-consistent",
    "work-agenda",
    "work-colleague",
    "work-accomplish",
    "work-delegate",
    "work-supervise",
    "work-recruit",
    "work-orientation",
    "work-attendance",
    "work-promotion",
    "work-performance",
    "work-procedure",
    "work-confidential",
    "travel-boarding",
    "travel-baggage",
    "travel-cancellation",
    "travel-confirm",
    "travel-transfer",
    "travel-transit",
    "travel-fare",
    "travel-surcharge",
    "travel-refundable",
    "travel-vacancy",
    "travel-shuttle",
    "travel-customs",
    "business-budget",
    "business-estimate",
    "business-proposal",
    "business-contract",
    "business-merchandise",
    "business-inventory",
    "business-shipment",
    "business-retailer",
    "business-wholesale",
    "business-profit",
    "business-discount",
    "business-transaction",
    "daily-appointment",
    "daily-appliance",
    "daily-subscription",
    "daily-renewal",
    "daily-receipt",
    "daily-eligible",
    "daily-requirement",
    "daily-notify",
    "daily-participate",
    "daily-accessible",
    "daily-essential",
    "daily-approximately",
  ],
  grammarLessons: [
    "present-perfect",
    "passive-voice",
    "relative-clauses",
    "conditionals",
    "gerunds-infinitives",
    "conjunctions-prepositions",
    "adjectives-adverbs",
    "subject-verb-agreement",
    "comparatives-superlatives",
    "participles",
    "countable-uncountable",
    "time-prepositions",
  ],
  questions: [
    "q-deadline",
    "q-complimentary",
    "q-reimburse",
    "q-efficient",
    "q-itinerary",
    "q-revenue",
    "q-supplier",
    "q-negotiate",
    "q-perfect",
    "q-passive",
    "q-relative",
    "q-conditional",
    "q-gerund",
    "q-conjunction",
    "q-adverb",
    "q-infinitive",
    "q-agenda",
    "q-confidential",
    "q-orientation",
    "q-delegate",
    "q-refundable",
    "q-shuttle",
    "q-surcharge",
    "q-inventory",
    "q-profit",
    "q-eligible",
    "q-notify",
    "q-receipt",
    "q-adjective",
    "q-agreement-list",
    "q-agreement-each",
    "q-comparative",
    "q-superlative",
    "q-participle-passive",
    "q-participle-active",
    "q-uncountable",
    "q-quantifier",
    "q-time-on",
    "q-time-by",
    "q-preposition-gerund",
  ],
};

describe("Learning content integrity", () => {
  it("provides 320 distinct words and 80 words in each context", () => {
    expect(words).toHaveLength(320);
    expect(new Set(words.map((word) => word.id)).size).toBe(words.length);
    expect(
      new Set(
        words.map((word) =>
          word.word.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase(),
        ),
      ).size,
    ).toBe(words.length);
    for (const category of ["work", "travel", "business", "daily"]) {
      expect(
        words.filter((word) => word.category === category),
        category,
      ).toHaveLength(80);
    }
  });

  it("keeps all existing vocabulary, lesson and question IDs compatible with saved progress", () => {
    expect(words.map((word) => word.id)).toEqual(
      expect.arrayContaining(legacyIds.words),
    );
    expect(grammarLessons.map((lesson) => lesson.id)).toEqual(
      expect.arrayContaining(legacyIds.grammarLessons),
    );
    expect(questions.map((question) => question.id)).toEqual(
      expect.arrayContaining(legacyIds.questions),
    );
  });

  it("contains complete bilingual vocabulary cards with IPA and editorial level labels", () => {
    const required = [
      "id",
      "word",
      "phonetic",
      "partOfSpeech",
      "meaning",
      "definition",
      "example",
      "translation",
      "category",
      "collocation",
      "level",
    ] as const;
    for (const word of words) {
      for (const field of required)
        expect(
          typeof word[field] === "string" && word[field].trim().length > 0,
          word.id + ": " + field,
        ).toBe(true);
      expect(word.id.startsWith(word.category + "-"), word.id).toBe(true);
      expect(word.phonetic, word.id).toMatch(new RegExp("^/[^/]+/$", "u"));
      expect(word.phonetic, word.id).not.toMatch(/[0-9?]/);
      expect(word.meaning, word.id).toMatch(/[㐀-鿿]/u);
      expect(word.translation, word.id).toMatch(/[㐀-鿿]/u);
      expect(word.collocation, word.id).toMatch(/[a-z].*[㐀-鿿]/iu);
      expect(word.level, word.id).toBe("700 分目標詞彙");
      expect(word.example, word.id).not.toMatch(/_{3,}|TODO|TBD|lorem ipsum/i);
    }
  });

  it("contains complete grammar lessons and valid, distinct answer choices", () => {
    expect(grammarLessons).toHaveLength(12);
    expect(questions).toHaveLength(40);
    expect(new Set(grammarLessons.map((lesson) => lesson.id)).size).toBe(
      grammarLessons.length,
    );
    expect(new Set(questions.map((question) => question.id)).size).toBe(
      questions.length,
    );
    expect(new Set(questions.map((question) => question.prompt)).size).toBe(
      questions.length,
    );
    for (const lesson of grammarLessons) {
      for (const field of [
        "title",
        "subtitle",
        "rule",
        "structure",
        "tip",
      ] as const)
        expect(
          lesson[field].trim().length,
          lesson.id + ": " + field,
        ).toBeGreaterThan(0);
      expect(lesson.duration, lesson.id).toBeGreaterThan(0);
      expect(lesson.examples.length, lesson.id).toBeGreaterThanOrEqual(2);
      for (const example of lesson.examples) {
        expect(example.english, lesson.id).toMatch(/[A-Za-z]/);
        expect(example.chinese, lesson.id).toMatch(/[㐀-鿿]/u);
      }
    }
    for (const question of questions) {
      expect(question.options, question.id).toHaveLength(4);
      expect(
        new Set(question.options.map((option) => option.trim().toLowerCase()))
          .size,
        question.id,
      ).toBe(4);
      expect(
        question.options.every((option) => option.trim().length > 0),
        question.id,
      ).toBe(true);
      expect(Number.isInteger(question.answer), question.id).toBe(true);
      expect(question.answer, question.id).toBeGreaterThanOrEqual(0);
      expect(question.answer, question.id).toBeLessThan(
        question.options.length,
      );
      expect(question.prompt.match(/_{3,}/g), question.id).toHaveLength(1);
      expect(question.explanation, question.id).toMatch(/[㐀-鿿]/u);
    }
    expect(
      questions.filter((question) => question.kind === "vocabulary"),
    ).toHaveLength(20);
    expect(
      questions.filter((question) => question.kind === "grammar"),
    ).toHaveLength(20);
  });

  it("does not reintroduce the reviewed ambiguous alternatives and deadline misconceptions", () => {
    const timeQuestion = questions.find(
      (question) => question.id === "q-time-on",
    )!;
    expect(timeQuestion.options[timeQuestion.answer]).toBe("on");
    expect(timeQuestion.options).not.toContain("by");
    const conditional = questions.find(
      (question) => question.id === "q-conditional",
    )!;
    expect(conditional.prompt).toContain("the supplier");
    expect(conditional.options[conditional.answer]).toBe("confirms");
    const comparative = questions.find(
      (question) => question.id === "q-superlative",
    )!;
    expect(comparative.prompt).toContain("by far the");
    expect(comparative.options[comparative.answer]).toBe("most practical");
    expect(
      grammarLessons.find((lesson) => lesson.id === "time-prepositions")!.rule,
    ).toContain("不晚於指定時間");
    expect(
      grammarLessons.find((lesson) => lesson.id === "relative-clauses")!.rule,
    ).toContain("非限定關係子句");
  });
});
