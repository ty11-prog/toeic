import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Book,
  BookOpen,
  Bookmark,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  Flame,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  Menu,
  Plane,
  Play,
  RotateCcw,
  Search,
  Settings2,
  ShoppingBag,
  Sparkles,
  Sprout,
  Square,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  Volume2,
  X,
} from "lucide-react";
import LearningJournal from "./LearningJournal";
import SpeechSettingsPanel from "./SpeechSettings";
import { useSpeech } from "./useSpeech";
import { words, grammarLessons, questions, vocabularyTiers } from "./data";
import type {
  Word,
  GrammarLesson,
  Question,
  VocabularyDifficulty,
} from "./data";
import { buildDailyStudyList } from "./vocabularyPlan";
import { loadProgress, localDate, streak } from "./progress";
import type { Progress } from "./progress";

type Page =
  "home" | "vocabulary" | "grammar" | "quiz" | "saved" | "journal" | "settings";
type Category = Word["category"] | "all";
const categories = [
  {
    id: "work",
    title: "職場日常",
    english: "At the workplace",
    description: "從會議到專案，自信表達每個想法。",
    icon: BriefcaseBusiness,
    color: "sage",
  },
  {
    id: "travel",
    title: "旅行與交通",
    english: "Out in the world",
    description: "機場、飯店與旅途，讓英文帶你出發。",
    icon: Plane,
    color: "peach",
  },
  {
    id: "business",
    title: "商務與經濟",
    english: "The business world",
    description: "掌握商業往來中，最常遇見的關鍵字。",
    icon: TrendingUp,
    color: "lavender",
  },
  {
    id: "daily",
    title: "生活與消費",
    english: "Everyday moments",
    description: "購物、服務與日常，讀懂生活的英文。",
    icon: ShoppingBag,
    color: "butter",
  },
] as const;
const pageNames: Record<Page, string> = {
  home: "學習總覽",
  vocabulary: "單字學習",
  grammar: "文法攻略",
  quiz: "隨堂測驗",
  saved: "我的收藏",
  journal: "學習足跡",
  settings: "語音設定",
};
const navItems = [
  { id: "home", icon: LayoutDashboard },
  { id: "vocabulary", icon: BookOpen },
  { id: "grammar", icon: Book },
  { id: "quiz", icon: CircleCheck },
  { id: "saved", icon: Bookmark },
  { id: "journal", icon: ChartNoAxesCombined },
  { id: "settings", icon: Settings2 },
] as const;
const mobileTabs = [
  { id: "home", label: "今日", icon: LayoutDashboard },
  { id: "vocabulary", label: "單字", icon: BookOpen },
  { id: "grammar", label: "文法", icon: Book },
  { id: "journal", label: "足跡", icon: ChartNoAxesCombined },
  { id: "settings", label: "設定", icon: Settings2 },
] as const;

function ReadAloudButton({
  text,
  label,
  speech,
  caption = "朗讀",
}: {
  text: string;
  label: string;
  speech: ReturnType<typeof useSpeech>;
  caption?: string;
}) {
  const active = speech.speakingText === text;
  return (
    <button
      type="button"
      className={`example-audio ${active ? "is-speaking" : ""}`}
      aria-label={active ? `停止${label}` : label}
      aria-pressed={active}
      onClick={() => speech.speak(text)}
    >
      {active ? (
        <Square size={14} fill="currentColor" />
      ) : (
        <Volume2 size={16} />
      )}
      <span>{active ? "停止朗讀" : caption}</span>
    </button>
  );
}

function DeskIllustration() {
  return (
    <svg
      className="desk-illustration"
      viewBox="0 0 360 290"
      fill="none"
      aria-hidden="true"
    >
      <path d="M72 217V91a96 96 0 0 1 192 0v126" fill="#dce8d9" />
      <path d="M83 214V93a85 85 0 0 1 170 0v121" fill="#f0f1dc" />
      <path d="M168 12v201M84 111h168" stroke="#bacbb4" strokeWidth="5" />
      <circle cx="214" cy="64" r="22" fill="#e7c981" />
      <path
        d="M86 185c26-38 56-22 83-43 32-25 55-9 83-30v102H86z"
        fill="#c7d7bc"
      />
      <path
        d="M85 199c38-23 54-7 93-20 27-9 54-27 75-18v53H85z"
        fill="#a9c3a5"
      />
      <path d="M46 225h263v10H46z" fill="#c8ab85" />
      <path d="M55 235h8v47h-8M291 235h8v47h-8" fill="#b79a77" />
      <path
        d="M104 212l58-19 71 20-65 17z"
        fill="#fdfaf0"
        stroke="#7d9b85"
        strokeWidth="1.5"
      />
      <path
        d="M168 201v29M114 213l45-13M180 207l39 10M180 212l27 8M124 218l35-10"
        stroke="#9eae99"
        strokeWidth="1.5"
      />
      <path d="M109 210l-3-6 55-17 73 20-1 6-71-19z" fill="#5b7c67" />
      <rect
        x="201"
        y="204"
        width="32"
        height="8"
        rx="2"
        transform="rotate(-10 201 204)"
        fill="#d4a178"
      />
      <path
        d="M269 162l-22-42M260 144l29-35M254 133l-2-45M270 143l24-15"
        stroke="#55765a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse
        cx="245"
        cy="111"
        rx="8"
        ry="19"
        transform="rotate(-35 245 111)"
        fill="#769878"
      />
      <ellipse
        cx="254"
        cy="85"
        rx="9"
        ry="20"
        transform="rotate(8 254 85)"
        fill="#8cab87"
      />
      <ellipse
        cx="284"
        cy="111"
        rx="9"
        ry="20"
        transform="rotate(37 284 111)"
        fill="#779b7a"
      />
      <ellipse
        cx="294"
        cy="134"
        rx="8"
        ry="17"
        transform="rotate(57 294 134)"
        fill="#9bb28a"
      />
      <path d="M248 161h42l-6 54h-29z" fill="#d8b98f" />
      <path d="M246 158h46v7h-46z" fill="#cba77a" />
      <path d="M56 185h27v32H56z" fill="#f7f3df" />
      <path d="M83 192h7a8 8 0 0 1 0 16h-7" stroke="#f7f3df" strokeWidth="5" />
      <path
        d="M64 177c-5-8 6-12 0-20M73 177c-5-8 6-12 0-20"
        stroke="#a4b79b"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M45 69l3-8 3 8 8 3-8 3-3 8-3-8-8-3zM288 53l2-5 2 5 5 2-5 2-2 5-2-5-5-2z"
        fill="#b9bb8d"
      />
    </svg>
  );
}

function Dialog({
  title,
  onClose,
  children,
  className = "",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const elements = ref.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
        );
        if (!elements?.length) return;
        const first = elements[0],
          last = elements[elements.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === ref.current)
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="dialog-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`dialog ${className}`}
      >
        <button
          className="icon-button dialog-close"
          aria-label="關閉視窗"
          onClick={onClose}
        >
          <X size={21} />
        </button>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [category, setCategory] = useState<Category>("all");
  const [difficulty, setDifficulty] = useState<VocabularyDifficulty | "all">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [wordPage, setWordPage] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [homeTab, setHomeTab] = useState<"vocabulary" | "grammar">(
    "vocabulary",
  );
  const [lesson, setLesson] = useState<GrammarLesson | null>(null);
  const [studyWords, setStudyWords] = useState<Word[]>([]);
  const [studyIndex, setStudyIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [studiedCount, setStudiedCount] = useState(0);
  const [toast, setToast] = useState("");
  const [quizSet, setQuizSet] = useState<Question[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizWrong, setQuizWrong] = useState<string[]>([]);
  const [today, setToday] = useState(localDate);
  const speech = useSpeech(setToast);
  const speak = speech.speak;
  const closeLesson = () => {
    speech.stop();
    setLesson(null);
  };
  const closeStudy = () => {
    speech.stop();
    setStudyWords([]);
  };

  useEffect(() => {
    setWordPage(1);
  }, [page, category, difficulty, search]);

  useEffect(() => {
    const timer = window.setInterval(() => setToday(localDate()), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("daylight-progress-v1", JSON.stringify(progress));
    } catch {
      setToast("瀏覽器儲存空間無法使用，進度將僅保留於本次瀏覽。");
    }
  }, [progress]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const dailyCount = progress.activity[today] || 0;
  const dailyPercent = Math.min(100, dailyCount * 10);
  const todayWord = words[Math.floor(Date.now() / 86400000) % words.length];
  const dailyWords = buildDailyStudyList(words, progress.learned, 10, today);
  const accuracy = progress.quizResults.length
    ? Math.round(
        (progress.quizResults.reduce((sum, q) => sum + q.score, 0) /
          progress.quizResults.reduce((sum, q) => sum + q.total, 0)) *
          100,
      )
    : null;
  const navigate = (target: Page) => {
    speech.stop();
    setPage(target);
    setMobileOpen(false);
    setSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const recordActivity = (previous: Progress): Progress => ({
    ...previous,
    activity: {
      ...previous.activity,
      [today]: (previous.activity[today] || 0) + 1,
    },
  });
  const toggleSaved = (word: Word) => {
    const saved = progress.saved.includes(word.id);
    setProgress((previous) => ({
      ...previous,
      saved: saved
        ? previous.saved.filter((id) => id !== word.id)
        : [...previous.saved, word.id],
    }));
    setToast(
      saved ? `已取消收藏 ${word.word}` : `已收藏 ${word.word}，隨時回來複習。`,
    );
  };
  const openStudy = (list: Word[]) => {
    if (!list.length) return;
    speech.stop();
    setStudyWords(list);
    setStudyIndex(0);
    setFlipped(false);
    setStudiedCount(0);
  };
  const finishWord = (known: boolean) => {
    speech.stop();
    const word = studyWords[studyIndex];
    if (known) {
      setProgress((previous) =>
        previous.learned.includes(word.id)
          ? previous
          : recordActivity({
              ...previous,
              learned: [...previous.learned, word.id],
            }),
      );
      setStudiedCount((count) => count + 1);
    }
    setStudyIndex((index) => index + 1);
    setFlipped(false);
  };
  const startQuiz = (
    mode: "mixed" | "vocabulary" | "grammar" | "mistakes" = "mixed",
  ) => {
    const pool =
      mode === "mistakes"
        ? questions.filter((q) => progress.mistakes.includes(q.id))
        : mode === "mixed"
          ? questions
          : questions.filter((q) => q.kind === mode);
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQuizSet(shuffled.slice(0, 10));
    setQuizIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setQuizDone(false);
    setQuizWrong([]);
    navigate("quiz");
  };
  const checkAnswer = () => {
    if (selected === null || checked) return;
    const question = quizSet[quizIndex],
      correct = selected === question.answer;
    setChecked(true);
    if (correct) setScore((value) => value + 1);
    else setQuizWrong((previous) => [...previous, question.id]);
    setProgress((previous) =>
      recordActivity({
        ...previous,
        mistakes: correct
          ? previous.mistakes.filter((id) => id !== question.id)
          : [...new Set([...previous.mistakes, question.id])],
      }),
    );
  };
  const nextQuestion = () => {
    speech.stop();
    if (quizIndex === quizSet.length - 1) {
      setQuizDone(true);
      setProgress((previous) => ({
        ...previous,
        quizResults: [
          ...previous.quizResults,
          { date: today, score, total: quizSet.length },
        ],
      }));
    } else {
      setQuizIndex((index) => index + 1);
      setSelected(null);
      setChecked(false);
    }
  };
  const visibleWords = words.filter(
    (word) =>
      (page !== "saved" || progress.saved.includes(word.id)) &&
      (category === "all" || word.category === category) &&
      (difficulty === "all" || word.difficulty === difficulty) &&
      `${word.word} ${word.meaning} ${word.collocation}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );

  const renderGrammarList = (compact = false) => (
    <div className={`grammar-list ${compact ? "compact" : ""}`}>
      {(compact ? grammarLessons.slice(0, 3) : grammarLessons).map(
        (item, index) => (
          <button
            key={item.id}
            className="grammar-row"
            onClick={() => {
              speech.stop();
              setLesson(item);
            }}
          >
            <span className="lesson-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="grammar-row-copy">
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </span>
            <span className="lesson-tag">
              {progress.lessons.includes(item.id) ? (
                <>
                  <Check size={13} /> 已完成
                </>
              ) : (
                item.tag
              )}
            </span>
            <span className="lesson-time">
              <Clock3 size={14} /> {item.duration} 分鐘
            </span>
            <ChevronRight size={18} />
          </button>
        ),
      )}
    </div>
  );
  const renderCategoryCards = () => (
    <div className="category-grid">
      {categories.slice(0, 3).map((item) => {
        const Icon = item.icon,
          list = words.filter((word) => word.category === item.id),
          done = list.filter((word) =>
            progress.learned.includes(word.id),
          ).length;
        return (
          <button
            className="category-card"
            key={item.id}
            onClick={() => {
              setCategory(item.id);
              setDifficulty("all");
              navigate("vocabulary");
            }}
          >
            <div className={`category-art ${item.color}`}>
              <span className="category-icon">
                <Icon strokeWidth={1.3} size={42} />
              </span>
              <span className="art-line line-one" />
              <span className="art-line line-two" />
              <span className="art-spark">✦</span>
              <span className="card-level">600–990 混合選材</span>
            </div>
            <div className="category-copy">
              <span className="eyebrow">{item.english}</span>
              <h3>
                {item.title}
                <ArrowRight size={18} />
              </h3>
              <p>{item.description}</p>
              <div className="card-progress">
                <span>{list.length} 個單字</span>
                <span>
                  {done}/{list.length} 已掌握
                </span>
              </div>
              <div className="progress-track">
                <span style={{ width: `${(done / list.length) * 100}%` }} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        跳到學習內容
      </a>
      {mobileOpen && (
        <button
          className="sidebar-scrim"
          aria-label="關閉導覽"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            navigate("home");
          }}
        >
          <span className="brand-mark">
            <Sun size={29} strokeWidth={1.6} />
          </span>
          <span>
            daylight<span className="brand-dot">.</span>
          </span>
        </a>
        <p className="brand-caption">A LITTLE ENGLISH, EVERY DAY.</p>
        <span className="nav-label">我的學習空間</span>
        <nav aria-label="主要導覽">
          {navItems.map(({ id, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              onClick={() => {
                if (id === "vocabulary" || id === "saved") {
                  setCategory("all");
                  setDifficulty("all");
                }
                navigate(id);
              }}
              aria-current={page === id ? "page" : undefined}
            >
              <Icon size={19} strokeWidth={1.65} />
              <span>{pageNames[id]}</span>
              {id === "saved" && progress.saved.length > 0 && (
                <span className="nav-count">{progress.saved.length}</span>
              )}
              {page === id && <span className="active-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="small-sun">
            <Sprout size={27} strokeWidth={1.4} />
          </span>
          <h3>
            照自己的步調，
            <br />
            慢慢走得更遠。
          </h3>
          <p>
            每天留一點時間給英文，
            <br />
            進步會在不知不覺中發生。
          </p>
          <div className="note-bottom">
            <span>GROW AT YOUR OWN PACE</span>
            <Leaf size={13} />
          </div>
        </div>
        <div className="sidebar-bottom">
          <span className="avatar">Y</span>
          <span>
            <strong>你的學習旅程</strong>
            <small>目前約 700 · 目標 800+</small>
          </span>
          <span className="status-dot" title="進度儲存於本機" />
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="開啟導覽"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            <span className="breadcrumb-home">我的學習空間</span>
            <ChevronRight size={13} />
            <span>{pageNames[page]}</span>
          </div>
          <div className="topbar-right">
            <span className="today-date">
              {new Intl.DateTimeFormat("zh-TW", {
                month: "long",
                day: "numeric",
                weekday: "long",
              }).format(new Date())}
            </span>
            <span className="topbar-divider" />
            <span className="topbar-streak">
              <Flame size={17} /> {streak(progress.activity)} 天
              <span className="streak-text">持續學習</span>
            </span>
          </div>
        </header>
        <main id="main-content">
          {page === "home" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow heading-eyebrow">
                    <span className="tiny-line" /> EVERY DAY IS A FRESH START
                  </div>
                  <h1>
                    每天一點，英文更近一點
                    <span className="heading-period">.</span>
                  </h1>
                  <p>不用一次學很多，今天也一起累積一點進步吧。</p>
                </div>
                <span className="goal-badge">
                  <Target size={16} /> 目標分數 <strong>TOEIC 800+</strong>
                </span>
              </div>
              <div className="feature-grid">
                <section className="hero-card">
                  <div className="hero-copy">
                    <span className="hero-label">
                      <span /> YOUR DAILY DOSE OF ENGLISH
                    </span>
                    <h2>
                      Small steps.
                      <br />
                      <em>Brighter days.</em>
                    </h2>
                    <p>
                      每一個新單字，都是看見世界的新方式。
                      <br />留 10 分鐘，給今天的自己。
                    </p>
                    <button
                      className="button primary"
                      onClick={() => openStudy(dailyWords)}
                    >
                      開始今日學習 <ArrowRight size={17} />
                    </button>
                    <span className="hero-footnote">
                      <Clock3 size={12} /> 每天 10 分鐘，讓英文成為日常
                    </span>
                  </div>
                  <DeskIllustration />
                </section>
                <section className="daily-word">
                  <div className="daily-word-top">
                    <span>
                      <Sparkles size={15} /> 每日一字
                    </span>
                    <button
                      className={`icon-button ${progress.saved.includes(todayWord.id) ? "is-saved" : ""}`}
                      aria-label={
                        progress.saved.includes(todayWord.id)
                          ? `取消收藏 ${todayWord.word}`
                          : `收藏 ${todayWord.word}`
                      }
                      onClick={() => toggleSaved(todayWord)}
                    >
                      <Bookmark
                        size={19}
                        fill={
                          progress.saved.includes(todayWord.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>
                  <span className="daily-word-date">
                    A WORD TO TAKE WITH YOU
                  </span>
                  <h2>{todayWord.word}</h2>
                  <div className="pronunciation">
                    <span>{todayWord.phonetic}</span>
                    <button
                      className="icon-button"
                      aria-label={`播放 ${todayWord.word} 發音`}
                      onClick={() => speak(todayWord.word)}
                    >
                      <Volume2 size={17} />
                    </button>
                  </div>
                  <div className="daily-meaning">
                    <span>{todayWord.partOfSpeech}</span> {todayWord.meaning}
                    <small
                      className={`daily-word-level ${todayWord.difficulty}`}
                    >
                      {todayWord.level}
                    </small>
                  </div>
                  <div className="daily-example-block">
                    <p className="daily-example" lang="en">
                      “{todayWord.example}”
                    </p>
                    <ReadAloudButton
                      text={todayWord.example}
                      label="朗讀每日例句"
                      speech={speech}
                    />
                  </div>
                  <button
                    className="text-button"
                    onClick={() => openStudy([todayWord])}
                  >
                    認識這個單字 <ArrowRight size={15} />
                  </button>
                </section>
              </div>
              <section className="learning-route" aria-label="800 分學習路線">
                <div className="learning-route-intro">
                  <Target size={19} />
                  <div>
                    <h2>從約 700，穩穩走向 800+</h2>
                    <p>
                      先補足常用字，再拉高閱讀上限。每日混合練習以 3 個基礎、5
                      個核心、2 個進階字為原則。
                    </p>
                  </div>
                </div>
                <div className="learning-route-tiers">
                  {vocabularyTiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => {
                        setCategory("all");
                        setDifficulty(tier.id);
                        navigate("vocabulary");
                      }}
                    >
                      <span>{tier.label}</span>
                      <small>
                        {tier.range}
                        <span> 練習帶</span>
                      </small>
                      <ArrowRight size={14} />
                    </button>
                  ))}
                </div>
              </section>
              <section className="stats-strip" aria-label="學習統計">
                <div className="daily-goal-stat">
                  <span className="stat-icon sage">
                    <Target size={21} />
                  </span>
                  <div>
                    <span className="stat-label">今日小目標</span>
                    <strong>
                      {Math.min(dailyCount, 10)} <small>/ 10 次學習</small>
                    </strong>
                  </div>
                  <div
                    className="goal-ring"
                    style={{
                      background: `conic-gradient(var(--green) ${dailyPercent}%, #e9ede6 0)`,
                    }}
                  >
                    <span>{dailyPercent}%</span>
                  </div>
                </div>
                <div>
                  <span className="stat-icon peach">
                    <BookOpen size={21} />
                  </span>
                  <div>
                    <span className="stat-label">已掌握單字</span>
                    <strong>
                      {progress.learned.length} <small>個單字</small>
                    </strong>
                  </div>
                </div>
                <div>
                  <span className="stat-icon lavender">
                    <Book size={21} />
                  </span>
                  <div>
                    <span className="stat-label">完成文法</span>
                    <strong>
                      {progress.lessons.length}{" "}
                      <small>/ {grammarLessons.length} 個主題</small>
                    </strong>
                  </div>
                </div>
                <div>
                  <span className="stat-icon butter">
                    <TrendingUp size={21} />
                  </span>
                  <div>
                    <span className="stat-label">測驗正確率</span>
                    <strong>
                      {accuracy ?? "—"}{" "}
                      <small>{accuracy === null ? "尚未測驗" : "%"}</small>
                    </strong>
                  </div>
                </div>
              </section>
              <section className="learning-section">
                <div className="section-heading">
                  <div>
                    <h2>今天，想學點什麼？</h2>
                    <p>從熟悉的情境開始，把英文用進生活裡。</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => {
                      setCategory("all");
                      setDifficulty("all");
                      navigate(homeTab);
                    }}
                  >
                    探索全部 <ArrowRight size={16} />
                  </button>
                </div>
                <div
                  className="learning-tabs"
                  role="tablist"
                  aria-label="學習內容"
                >
                  <button
                    role="tab"
                    aria-selected={homeTab === "vocabulary"}
                    className={homeTab === "vocabulary" ? "selected" : ""}
                    onClick={() => setHomeTab("vocabulary")}
                  >
                    <BookOpen size={16} /> 情境單字<span>VOCABULARY</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={homeTab === "grammar"}
                    className={homeTab === "grammar" ? "selected" : ""}
                    onClick={() => setHomeTab("grammar")}
                  >
                    <Book size={16} /> 實用文法<span>GRAMMAR</span>
                  </button>
                </div>
                {homeTab === "vocabulary"
                  ? renderCategoryCards()
                  : renderGrammarList(true)}
              </section>
              <section className="practice-banner">
                <span className="practice-icon">
                  <Lightbulb size={26} strokeWidth={1.5} />
                </span>
                <div>
                  <h3>學過了，也來試試看。</h3>
                  <p>一個小測驗，把今天的收穫變成真正的記憶。</p>
                </div>
                <button className="button outline" onClick={() => startQuiz()}>
                  來個隨堂測驗 <ArrowRight size={16} />
                </button>
              </section>
            </>
          )}
          {(page === "vocabulary" || page === "saved") && (
            <>
              <PageHeading
                eyebrow={
                  page === "saved"
                    ? "YOUR PERSONAL WORD COLLECTION"
                    : "ONE WORD, A WHOLE NEW WORLD"
                }
                title={
                  page === "saved"
                    ? "把喜歡的單字，留在這裡。"
                    : "每個單字，都是一扇窗。"
                }
                subtitle={
                  page === "saved"
                    ? "收藏容易忘記、也想再遇見的字，慢慢變成自己的。"
                    : "涵蓋 600–990 選材範圍：補足常用字、突破 800+，也接觸高分閱讀的精確用語。"
                }
              />
              <div className="vocab-toolbar">
                <label className="search-field">
                  <Search size={19} />
                  <input
                    placeholder="搜尋單字、中文意思…"
                    aria-label="搜尋單字或中文意思"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <span>{visibleWords.length} 個</span>
                </label>
                <button
                  className="button primary"
                  disabled={!visibleWords.length}
                  onClick={() => openStudy(visibleWords)}
                >
                  <Play size={16} /> 單字卡練習
                </button>
              </div>
              <div className="filter-row">
                <button
                  className={
                    category === "all" ? "filter-chip active" : "filter-chip"
                  }
                  onClick={() => setCategory("all")}
                >
                  全部單字
                </button>
                {categories.map((item) => (
                  <button
                    className={
                      category === item.id
                        ? "filter-chip active"
                        : "filter-chip"
                    }
                    key={item.id}
                    onClick={() => setCategory(item.id)}
                  >
                    {item.title}
                  </button>
                ))}
                <span className="filter-note">
                  點選單字，深入學習 <ArrowDown size={13} />
                </span>
              </div>
              <div
                className="difficulty-filters"
                role="group"
                aria-label="單字難度"
              >
                <span className="difficulty-label">學習範圍</span>
                <button
                  className={
                    difficulty === "all"
                      ? "difficulty-chip active"
                      : "difficulty-chip"
                  }
                  aria-pressed={difficulty === "all"}
                  onClick={() => setDifficulty("all")}
                >
                  混合程度 <span>600–990</span>
                </button>
                {vocabularyTiers.map((tier) => (
                  <button
                    key={tier.id}
                    className={
                      difficulty === tier.id
                        ? `difficulty-chip active ${tier.id}`
                        : `difficulty-chip ${tier.id}`
                    }
                    aria-pressed={difficulty === tier.id}
                    onClick={() => setDifficulty(tier.id)}
                  >
                    {tier.label}
                    <span>{tier.range}</span>
                  </button>
                ))}
              </div>
              {visibleWords.length ? (
                <div className="word-grid">
                  {visibleWords.slice(0, wordPage * 24).map((word) => (
                    <article key={word.id} className="word-card">
                      <div className="word-card-top">
                        <span
                          className={`word-category ${categories.find((item) => item.id === word.category)?.color}`}
                        >
                          {
                            categories.find((item) => item.id === word.category)
                              ?.title
                          }
                        </span>
                        <button
                          className={`icon-button ${progress.saved.includes(word.id) ? "is-saved" : ""}`}
                          aria-label={
                            progress.saved.includes(word.id)
                              ? `取消收藏 ${word.word}`
                              : `收藏 ${word.word}`
                          }
                          onClick={() => toggleSaved(word)}
                        >
                          <Bookmark
                            size={18}
                            fill={
                              progress.saved.includes(word.id)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      </div>
                      <button
                        className="word-open"
                        onClick={() => openStudy([word])}
                      >
                        <h2>{word.word}</h2>
                        <span className="word-phonetic">{word.phonetic}</span>
                        <p>
                          <span>{word.partOfSpeech}</span> {word.meaning}
                        </p>
                      </button>
                      <div className="word-card-bottom">
                        <span>
                          {progress.learned.includes(word.id) ? (
                            <>
                              <CircleCheck size={14} /> 已掌握
                            </>
                          ) : (
                            word.level
                          )}
                        </span>
                        <button
                          className="icon-button"
                          aria-label={`播放 ${word.word} 發音`}
                          onClick={() => speak(word.word)}
                        >
                          <Volume2 size={17} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Bookmark size={38} strokeWidth={1.2} />
                  <h2>
                    {search || category !== "all" || difficulty !== "all"
                      ? "還沒找到這個單字"
                      : "給想記住的單字，一個位置。"}
                  </h2>
                  <p>
                    {search || category !== "all" || difficulty !== "all"
                      ? "試著搜尋其他英文單字、中文意思，或切換情境分類。"
                      : "在單字旁按下書籤，就能在這裡找到它。"}
                  </p>
                  <button
                    className="button outline"
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                      setDifficulty("all");
                      if (page === "saved" && !progress.saved.length)
                        navigate("vocabulary");
                    }}
                  >
                    {page === "saved" && !progress.saved.length
                      ? "探索情境單字"
                      : "清除篩選"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
              {visibleWords.length > 0 && (
                <div className="word-pagination">
                  <span>
                    顯示 {Math.min(wordPage * 24, visibleWords.length)} /{" "}
                    {visibleWords.length} 個單字
                  </span>
                  {wordPage * 24 < visibleWords.length && (
                    <button
                      className="button outline"
                      onClick={() => setWordPage((current) => current + 1)}
                    >
                      載入更多單字 <ArrowDown size={16} />
                    </button>
                  )}
                </div>
              )}
              <p className="vocabulary-level-note">
                分組與分數練習帶為本站的編輯選材建議，並非 TOEIC
                官方逐字分級；可依熟悉度混合練習。
              </p>
            </>
          )}
          {page === "grammar" && (
            <>
              <PageHeading
                eyebrow="MAKE SENSE OF THE SENTENCE"
                title="文法懂一點，句子就清楚一點。"
                subtitle="拆解多益常見的文法重點，用例句理解，再用練習記住。"
              />
              <div className="grammar-intro">
                <span className="stat-icon sage">
                  <Book size={24} />
                </span>
                <div>
                  <h2>你的文法路徑</h2>
                  <p>從句子結構到進階用法，循序建立閱讀的底氣。</p>
                </div>
                <span className="completion-pill">
                  {progress.lessons.length} / {grammarLessons.length} 已完成
                </span>
              </div>
              {renderGrammarList()}
              <section className="practice-banner">
                <span className="practice-icon">
                  <Lightbulb size={26} />
                </span>
                <div>
                  <h3>從理解，走向熟練。</h3>
                  <p>用文法專項練習，確認每個觀念都站穩了。</p>
                </div>
                <button
                  className="button outline"
                  onClick={() => startQuiz("grammar")}
                >
                  練習文法 <ArrowRight size={16} />
                </button>
              </section>
            </>
          )}
          {page === "quiz" && (
            <>
              <PageHeading
                eyebrow="A LITTLE CHALLENGE, A LOT OF GROWTH"
                title="給今天的自己，一個小挑戰。"
                subtitle="不用怕答錯，每一次練習，都讓記憶再深一點。"
              />
              {!quizSet.length ? (
                <>
                  <div className="quiz-options">
                    {[
                      {
                        mode: "mixed",
                        icon: Sparkles,
                        title: "綜合小測驗",
                        description: "單字 × 文法，檢視你的英文實力。",
                        label: "10 題 · 約 5 分鐘",
                        color: "sage",
                      },
                      {
                        mode: "vocabulary",
                        icon: BookOpen,
                        title: "單字專項練習",
                        description: "讀懂句子情境，選出最貼切的字。",
                        label: `${Math.min(10, questions.filter((q) => q.kind === "vocabulary").length)} 題 · 約 4 分鐘`,
                        color: "peach",
                      },
                      {
                        mode: "grammar",
                        icon: Book,
                        title: "文法專項練習",
                        description: "把學過的規則，轉化成答題直覺。",
                        label: `${Math.min(10, questions.filter((q) => q.kind === "grammar").length)} 題 · 約 4 分鐘`,
                        color: "lavender",
                      },
                    ].map((item) => (
                      <button
                        className="quiz-option"
                        key={item.mode}
                        onClick={() =>
                          startQuiz(
                            item.mode as "mixed" | "vocabulary" | "grammar",
                          )
                        }
                      >
                        <span className={`stat-icon ${item.color}`}>
                          <item.icon size={27} />
                        </span>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <span>{item.label}</span>
                        <span className="quiz-start">
                          開始練習 <ArrowRight size={18} />
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mistakes-banner">
                    <RotateCcw size={23} />
                    <div>
                      <h3>錯題，就是下一次進步的起點。</h3>
                      <p>
                        目前有 {progress.mistakes.length}{" "}
                        題待複習，答對後會自動移出錯題本。
                      </p>
                    </div>
                    <button
                      className="button outline"
                      disabled={!progress.mistakes.length}
                      onClick={() => startQuiz("mistakes")}
                    >
                      複習錯題 <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              ) : quizDone ? (
                <section className="quiz-result">
                  <span className="result-trophy">
                    <Trophy size={46} strokeWidth={1.3} />
                  </span>
                  <span className="eyebrow">
                    A LITTLE BETTER THAN YESTERDAY
                  </span>
                  <h2>
                    {score === quizSet.length
                      ? "太棒了，每一題都答對！"
                      : "練習完成，又前進了一點。"}
                  </h2>
                  <p>
                    你答對了 <strong>{score}</strong> / {quizSet.length}{" "}
                    題，正確率 {Math.round((score / quizSet.length) * 100)}%。
                  </p>
                  {quizWrong.length > 0 && (
                    <p className="result-note">
                      {quizWrong.length} 題已加入錯題本，隨時可以再複習。
                    </p>
                  )}
                  <div className="result-actions">
                    <button
                      className="button primary"
                      onClick={() => startQuiz()}
                    >
                      再練習一次 <RotateCcw size={16} />
                    </button>
                    <button
                      className="button outline"
                      onClick={() => setQuizSet([])}
                    >
                      回到測驗選單
                    </button>
                  </div>
                </section>
              ) : (
                <section className="quiz-panel">
                  <div className="quiz-panel-top">
                    <span className="eyebrow">
                      {quizSet[quizIndex].kind === "vocabulary"
                        ? "VOCABULARY · 情境單字"
                        : "GRAMMAR · 文法運用"}
                    </span>
                    <span>
                      {quizIndex + 1} / {quizSet.length}
                    </span>
                  </div>
                  <div className="quiz-progress">
                    <span
                      style={{
                        width: `${(quizIndex / quizSet.length) * 100}%`,
                      }}
                    />
                  </div>
                  <h2>{quizSet[quizIndex].prompt}</h2>
                  <div className="answer-options">
                    {quizSet[quizIndex].options.map((option, index) => (
                      <button
                        key={`${quizIndex}-${index}`}
                        disabled={checked}
                        className={`answer-option ${selected === index ? "selected" : ""} ${checked && index === quizSet[quizIndex].answer ? "correct" : ""} ${checked && selected === index && index !== quizSet[quizIndex].answer ? "incorrect" : ""}`}
                        onClick={() => setSelected(index)}
                      >
                        <span>{String.fromCharCode(65 + index)}</span>
                        {option}
                        {checked && index === quizSet[quizIndex].answer && (
                          <Check size={19} />
                        )}
                      </button>
                    ))}
                  </div>
                  {checked && (
                    <div
                      className={`answer-explanation ${selected === quizSet[quizIndex].answer ? "correct" : "incorrect"}`}
                      role="status"
                    >
                      <strong>
                        {selected === quizSet[quizIndex].answer
                          ? "答對了！"
                          : `再記住一次就好。正確答案：${String.fromCharCode(65 + quizSet[quizIndex].answer)}`}
                      </strong>
                      <p>{quizSet[quizIndex].explanation}</p>
                      <ReadAloudButton
                        text={quizSet[quizIndex].prompt.replace(
                          /_{3,}/g,
                          quizSet[quizIndex].options[quizSet[quizIndex].answer],
                        )}
                        label="朗讀完整句子"
                        caption="朗讀完整句子"
                        speech={speech}
                      />
                    </div>
                  )}
                  <div className="quiz-panel-footer">
                    <button
                      className="text-button muted"
                      onClick={() => {
                        speech.stop();
                        setQuizSet([]);
                        setQuizDone(false);
                      }}
                    >
                      <ArrowLeft size={15} /> 離開練習
                    </button>
                    {checked ? (
                      <button className="button primary" onClick={nextQuestion}>
                        {quizIndex === quizSet.length - 1
                          ? "查看學習成果"
                          : "下一題"}
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        className="button primary"
                        disabled={selected === null}
                        onClick={checkAnswer}
                      >
                        確認答案 <Check size={16} />
                      </button>
                    )}
                  </div>
                </section>
              )}
            </>
          )}
          {page === "journal" && (
            <>
              <PageHeading
                eyebrow="LOOK HOW FAR YOU HAVE COME"
                title="每一點進步，都值得被看見。"
                subtitle="回頭看看，你為自己的英文累積了多少可能。"
              />
              <LearningJournal
                progress={progress}
                onImport={setProgress}
                onNotify={setToast}
              />
            </>
          )}
          {page === "settings" && (
            <>
              <PageHeading
                eyebrow="FIND YOUR ENGLISH VOICE"
                title="找到聽起來，最自在的英文。"
                subtitle="選擇喜歡的聲音與語速，讓單字和例句一起走進記憶。"
              />
              <SpeechSettingsPanel speech={speech} />
            </>
          )}
          <footer className="page-footer">
            <span className="footer-logo">
              <Sun size={15} /> daylight.
            </span>
            <span>
              A little progress, every day.
              <span className="footer-zh"> 願英文成為你生活裡的光。</span>
            </span>
            <span className="local-save">
              <span /> 進度保存在此瀏覽器
            </span>
          </footer>
        </main>
      </div>
      {!mobileOpen && !lesson && studyWords.length === 0 && (
        <nav className="bottom-nav" aria-label="手機分頁導航">
          {mobileTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={page === id ? "active" : ""}
              aria-current={page === id ? "page" : undefined}
              onClick={() => {
                if (id === "vocabulary") {
                  setCategory("all");
                  setDifficulty("all");
                }
                navigate(id);
              }}
            >
              <Icon size={21} strokeWidth={page === id ? 2 : 1.6} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      )}
      {lesson && (
        <Dialog
          title={lesson.title}
          onClose={closeLesson}
          className="lesson-dialog"
        >
          <span className="dialog-eyebrow">
            <Book size={16} /> GRAMMAR NOTES
          </span>
          <h2>{lesson.title}</h2>
          <p className="lesson-subtitle">{lesson.subtitle}</p>
          <span className="reading-time">
            <Clock3 size={14} /> 約 {lesson.duration} 分鐘閱讀
          </span>
          <div className="lesson-section">
            <h3>掌握這個觀念</h3>
            <p>{lesson.rule}</p>
            <div className="structure-box">{lesson.structure}</div>
          </div>
          <div className="lesson-section">
            <h3>從例句看用法</h3>
            {lesson.examples.map((example, index) => (
              <div className="lesson-example" key={example.english}>
                <p lang="en">{example.english}</p>
                <span>{example.chinese}</span>
                <ReadAloudButton
                  text={example.english}
                  label={`朗讀文法例句 ${index + 1}`}
                  speech={speech}
                />
              </div>
            ))}
          </div>
          <div className="lesson-tip">
            <Lightbulb size={20} />
            <p>
              <strong>多益小提醒</strong>
              {lesson.tip}
            </p>
          </div>
          <button
            className="button primary full-width"
            onClick={() => {
              setProgress((previous) =>
                previous.lessons.includes(lesson.id)
                  ? previous
                  : recordActivity({
                      ...previous,
                      lessons: [...previous.lessons, lesson.id],
                    }),
              );
              closeLesson();
              setToast("文法主題已完成，來場小測驗鞏固記憶吧。");
            }}
          >
            <Check size={17} />{" "}
            {progress.lessons.includes(lesson.id)
              ? "已讀過，再記住一次"
              : "我理解了，完成主題"}
          </button>
        </Dialog>
      )}
      {studyWords.length > 0 && (
        <Dialog
          title="單字卡練習"
          onClose={closeStudy}
          className="study-dialog"
        >
          {studyIndex >= studyWords.length ? (
            <div className="study-complete">
              <span className="result-trophy">
                <Sprout size={45} />
              </span>
              <span className="eyebrow">SMALL STEPS COUNT</span>
              <h2>又為自己，累積了一點。</h2>
              <p>
                這次練習了 {studyWords.length} 個單字，
                <br />
                標記掌握 {studiedCount} 個。慢慢來，也很好。
              </p>
              <button className="button primary" onClick={closeStudy}>
                完成練習 <Check size={17} />
              </button>
            </div>
          ) : (
            <>
              <div className="study-top">
                <span className="dialog-eyebrow">
                  <BookOpen size={16} /> DAILY WORD PRACTICE
                </span>
                <span>
                  {studyIndex + 1} / {studyWords.length}
                </span>
              </div>
              <div className="quiz-progress">
                <span
                  style={{
                    width: `${(studyIndex / studyWords.length) * 100}%`,
                  }}
                />
              </div>
              <div className="study-word">
                <div className="study-word-tags">
                  <span className="word-category sage">
                    {
                      categories.find(
                        (item) => item.id === studyWords[studyIndex].category,
                      )?.title
                    }
                  </span>
                  <span
                    className={`study-difficulty ${studyWords[studyIndex].difficulty}`}
                  >
                    {studyWords[studyIndex].level} ·{" "}
                    {
                      vocabularyTiers.find(
                        (tier) => tier.id === studyWords[studyIndex].difficulty,
                      )?.range
                    }
                  </span>
                </div>
                <h2>{studyWords[studyIndex].word}</h2>
                <div className="pronunciation">
                  <span>{studyWords[studyIndex].phonetic}</span>
                  <button
                    className="icon-button"
                    aria-label={`播放 ${studyWords[studyIndex].word} 發音`}
                    onClick={() => speak(studyWords[studyIndex].word)}
                  >
                    <Volume2 size={20} />
                  </button>
                </div>
                <button
                  className={`icon-button study-bookmark ${progress.saved.includes(studyWords[studyIndex].id) ? "is-saved" : ""}`}
                  aria-label={
                    progress.saved.includes(studyWords[studyIndex].id)
                      ? `取消收藏 ${studyWords[studyIndex].word}`
                      : `收藏 ${studyWords[studyIndex].word}`
                  }
                  onClick={() => toggleSaved(studyWords[studyIndex])}
                >
                  <Bookmark
                    size={21}
                    fill={
                      progress.saved.includes(studyWords[studyIndex].id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>
              {flipped ? (
                <div className="study-answer">
                  <h3>
                    <span>{studyWords[studyIndex].partOfSpeech}</span>{" "}
                    {studyWords[studyIndex].meaning}
                  </h3>
                  <p className="word-definition">
                    {studyWords[studyIndex].definition}
                  </p>
                  <div className="study-example">
                    <p lang="en">{studyWords[studyIndex].example}</p>
                    <span>{studyWords[studyIndex].translation}</span>
                    <ReadAloudButton
                      text={studyWords[studyIndex].example}
                      label="朗讀單字例句"
                      speech={speech}
                    />
                  </div>
                  <div className="collocation">
                    <Lightbulb size={16} />
                    <span>
                      一起記更好：
                      <strong>{studyWords[studyIndex].collocation}</strong>
                    </span>
                  </div>
                  <div className="study-actions">
                    <button
                      className="button outline"
                      onClick={() => finishWord(false)}
                    >
                      <RotateCcw size={16} /> 還要再練習
                    </button>
                    <button
                      className="button primary"
                      onClick={() => finishWord(true)}
                    >
                      <Check size={17} /> 我記住了
                    </button>
                  </div>
                </div>
              ) : (
                <div className="study-reveal">
                  <p>先想想看，你記得這個單字的意思嗎？</p>
                  <button
                    className="button primary"
                    onClick={() => setFlipped(true)}
                  >
                    看看解答 <ArrowRight size={17} />
                  </button>
                </div>
              )}
            </>
          )}
        </Dialog>
      )}
      {toast && (
        <div className="toast" role="status">
          <CircleCheck size={17} />
          {toast}
          <button aria-label="關閉提示" onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function PageHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="page-heading inner-heading">
      <div>
        <div className="eyebrow heading-eyebrow">
          <span className="tiny-line" />
          {eyebrow}
        </div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
