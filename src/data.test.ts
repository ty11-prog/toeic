import { describe, expect, it } from "vitest";
import { words, grammarLessons, questions } from "./data";
import { vocabularyTiers } from "./content/vocabulary-tiers";
import { parseProgressBackup } from "./LearningJournal";

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
    "work-applicant",
    "work-application",
    "work-candidate",
    "work-qualification",
    "work-resume",
    "work-interview",
    "work-employer",
    "work-employee",
    "work-personnel",
    "work-supervisor",
    "work-department",
    "work-headquarters",
    "work-position",
    "work-responsibility",
    "work-workload",
    "work-overtime",
    "work-shift",
    "work-schedule",
    "work-productivity",
    "work-accuracy",
    "work-priority",
    "work-objective",
    "work-training",
    "work-workshop",
    "work-seminar",
    "work-conference",
    "work-presentation",
    "work-minutes",
    "work-memorandum",
    "work-correspondence",
    "work-attachment",
    "work-signature",
    "work-approval",
    "work-authorization",
    "work-policy",
    "work-regulation",
    "work-compliance",
    "work-equipment",
    "work-facility",
    "work-maintenance",
    "work-inspection",
    "work-evaluation",
    "work-feedback",
    "work-suggestion",
    "work-revision",
    "work-clarify",
    "work-respond",
    "work-submit",
    "work-postpone",
    "work-assign",
    "work-coordinate",
    "work-organize",
    "work-arrange",
    "work-implement",
    "work-update",
    "work-resolve",
    "work-assist",
    "work-attend",
    "work-conduct",
    "work-motivate",
    "travel-arrival",
    "travel-delay",
    "travel-terminal",
    "travel-platform",
    "travel-passenger",
    "travel-aisle",
    "travel-luggage",
    "travel-passport",
    "travel-visa",
    "travel-immigration",
    "travel-security",
    "travel-checkpoint",
    "travel-embassy",
    "travel-declaration",
    "travel-allowance",
    "travel-prohibited",
    "travel-connection",
    "travel-nonstop",
    "travel-domestic",
    "travel-international",
    "travel-overseas",
    "travel-journey",
    "travel-excursion",
    "travel-sightseeing",
    "travel-attraction",
    "travel-landmark",
    "travel-admission",
    "travel-guide",
    "travel-brochure",
    "travel-tourist",
    "travel-route",
    "travel-timetable",
    "travel-commute",
    "travel-commuter",
    "travel-pedestrian",
    "travel-intersection",
    "travel-detour",
    "travel-congestion",
    "travel-highway",
    "travel-expressway",
    "travel-toll",
    "travel-rental",
    "travel-concierge",
    "travel-reception",
    "travel-lobby",
    "travel-suite",
    "travel-occupancy",
    "travel-amenity",
    "travel-housekeeping",
    "travel-laundry",
    "travel-upgrade",
    "travel-balcony",
    "travel-elevator",
    "travel-ferry",
    "travel-cruise",
    "travel-pier",
    "travel-port",
    "travel-overnight",
    "travel-punctual",
    "travel-disruption",
    "business-account",
    "business-balance",
    "business-asset",
    "business-liability",
    "business-investment",
    "business-interest",
    "business-capital",
    "business-expense",
    "business-earnings",
    "business-turnover",
    "business-forecast",
    "business-demand",
    "business-supply",
    "business-manufacturer",
    "business-distributor",
    "business-vendor",
    "business-client",
    "business-consumer",
    "business-market",
    "business-segment",
    "business-brand",
    "business-advertisement",
    "business-campaign",
    "business-launch",
    "business-strategy",
    "business-partnership",
    "business-merger",
    "business-acquisition",
    "business-franchise",
    "business-corporation",
    "business-enterprise",
    "business-shareholder",
    "business-dividend",
    "business-equity",
    "business-loan",
    "business-mortgage",
    "business-insurance",
    "business-premium",
    "business-deposit",
    "business-withdrawal",
    "business-installment",
    "business-payment",
    "business-overdue",
    "business-outstanding",
    "business-refund",
    "business-rebate",
    "business-quotation",
    "business-bid",
    "business-tender",
    "business-incentive",
    "business-commission",
    "business-margin",
    "business-currency",
    "business-exchange",
    "business-tariff",
    "business-export",
    "business-import",
    "business-freight",
    "business-warehouse",
    "business-procurement",
    "daily-household",
    "daily-tenant",
    "daily-landlord",
    "daily-lease",
    "daily-utility",
    "daily-plumbing",
    "daily-renovation",
    "daily-installation",
    "daily-warranty",
    "daily-replacement",
    "daily-defective",
    "daily-durable",
    "daily-disposal",
    "daily-recycle",
    "daily-packaging",
    "daily-consumption",
    "daily-reusable",
    "daily-voucher",
    "daily-coupon",
    "daily-membership",
    "daily-loyalty",
    "daily-redeem",
    "daily-affordable",
    "daily-selection",
    "daily-replenish",
    "daily-checkout",
    "daily-delivery",
    "daily-complaint",
    "daily-satisfaction",
    "daily-assistance",
    "daily-announcement",
    "daily-notice",
    "daily-enrollment",
    "daily-sanitation",
    "daily-exhibit",
    "daily-exhibition",
    "daily-venue",
    "daily-audience",
    "daily-registration",
    "daily-donation",
    "daily-volunteer",
    "daily-community",
    "daily-resident",
    "daily-neighborhood",
    "daily-medication",
    "daily-precaution",
    "daily-symptom",
    "daily-prescription",
    "daily-treatment",
    "daily-recovery",
    "daily-nutrition",
    "daily-ingredient",
    "daily-portion",
    "daily-expiration",
    "daily-perishable",
    "daily-storage",
    "daily-hygiene",
    "daily-queue",
    "daily-reminder",
    "daily-optional",
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
  it("provides 480 distinct words and 120 words in each context", () => {
    expect(words).toHaveLength(480);
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
      ).toHaveLength(120);
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
      "difficulty",
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
      const tier = vocabularyTiers.find((item) => item.id === word.difficulty);
      expect(tier, word.id).toBeDefined();
      expect(word.level, word.id).toBe(tier?.label);
      expect(word.example, word.id).not.toMatch(/_{3,}|TODO|TBD|lorem ipsum/i);
    }
  });

  it("supports all three editorial study bands and restores pre-expansion backups", () => {
    expect(vocabularyTiers.map((tier) => tier.id)).toEqual([
      "foundation",
      "core",
      "advanced",
    ]);
    expect(vocabularyTiers.map((tier) => tier.range)).toEqual([
      "600–700",
      "700–850",
      "850–990",
    ]);
    for (const tier of vocabularyTiers) {
      expect(
        words.filter((word) => word.difficulty === tier.id).length,
        tier.id,
      ).toBeGreaterThan(0);
    }
    const legacyProgress = {
      saved: [...legacyIds.words],
      learned: [...legacyIds.words],
      lessons: [...legacyIds.grammarLessons],
      mistakes: [...legacyIds.questions],
      activity: { "2026-10-29": 10 },
      quizResults: [{ date: "2026-10-29", score: 7, total: 10 }],
    };
    expect(
      parseProgressBackup(
        JSON.stringify({ schemaVersion: 1, progress: legacyProgress }),
      ),
    ).toEqual(legacyProgress);
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
