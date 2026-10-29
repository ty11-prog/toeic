import { workAdditions } from "./content/work-additions.ts";
import { travelAdditions } from "./content/travel-additions.ts";
import { businessAdditions } from "./content/business-additions.ts";
import { dailyAdditions } from "./content/daily-additions.ts";
import { workAdvanced } from "./content/work-advanced.ts";
import { travelAdvanced } from "./content/travel-advanced.ts";
import { businessAdvanced } from "./content/business-advanced.ts";
import { dailyAdvanced } from "./content/daily-advanced.ts";
import {
  difficultyByWordId,
  vocabularyTiers,
} from "./content/vocabulary-tiers.ts";
import type { VocabularyDifficulty } from "./content/vocabulary-tiers.ts";
export { vocabularyTiers } from "./content/vocabulary-tiers.ts";
export type { VocabularyDifficulty } from "./content/vocabulary-tiers.ts";

export type WordEntry = {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  definition: string;
  example: string;
  translation: string;
  category: "work" | "travel" | "business" | "daily";
  collocation: string;
};
export type Word = WordEntry & {
  difficulty: VocabularyDifficulty;
  level: string;
};

const originalWords: WordEntry[] = [
  {
    id: "work-deadline",
    word: "deadline",
    phonetic: "/ˈded.laɪn/",
    partOfSpeech: "n.",
    meaning: "截止期限",
    definition: "The latest time by which something must be finished.",
    example: "We need to meet the deadline for the quarterly report.",
    translation: "我們必須在期限內完成季度報告。",
    category: "work",
    collocation: "meet a deadline 在期限內完成",
  },
  {
    id: "work-collaborate",
    word: "collaborate",
    phonetic: "/kəˈlæb.ə.reɪt/",
    partOfSpeech: "v.",
    meaning: "合作；協作",
    definition: "To work together with another person or group.",
    example: "Our design team will collaborate with the marketing department.",
    translation: "我們的設計團隊將與行銷部門合作。",
    category: "work",
    collocation: "collaborate with a team 與團隊合作",
  },
  {
    id: "work-efficient",
    word: "efficient",
    phonetic: "/ɪˈfɪʃ.ənt/",
    partOfSpeech: "adj.",
    meaning: "有效率的",
    definition: "Working well without wasting time, energy, or money.",
    example: "The new software makes our ordering process more efficient.",
    translation: "新軟體讓我們的訂購流程更有效率。",
    category: "work",
    collocation: "an efficient process 有效率的流程",
  },
  {
    id: "work-assignment",
    word: "assignment",
    phonetic: "/əˈsaɪn.mənt/",
    partOfSpeech: "n.",
    meaning: "工作任務；指派的工作",
    definition: "A task or piece of work given to someone.",
    example:
      "Her first assignment is to prepare a summary of customer feedback.",
    translation: "她的第一項任務是整理顧客回饋摘要。",
    category: "work",
    collocation: "complete an assignment 完成任務",
  },
  {
    id: "work-prioritize",
    word: "prioritize",
    phonetic: "/praɪˈɔːr.ə.taɪz/",
    partOfSpeech: "v.",
    meaning: "安排優先順序；優先處理",
    definition:
      "To decide which things are most important and deal with them first.",
    example:
      "Please prioritize requests from customers whose deliveries are delayed.",
    translation: "請優先處理那些交貨延遲的顧客所提出的請求。",
    category: "work",
    collocation: "prioritize tasks 安排任務的優先順序",
  },
  {
    id: "work-reschedule",
    word: "reschedule",
    phonetic: "/ˌriːˈskedʒ.uːl/",
    partOfSpeech: "v.",
    meaning: "重新安排時間",
    definition: "To change the time or date of a planned event.",
    example: "The manager rescheduled the interview for Thursday morning.",
    translation: "經理將面試改到星期四上午。",
    category: "work",
    collocation: "reschedule a meeting 重新安排會議時間",
  },
  {
    id: "work-qualified",
    word: "qualified",
    phonetic: "/ˈkwɑː.lə.faɪd/",
    partOfSpeech: "adj.",
    meaning: "合格的；具備資格的",
    definition: "Having the skills, knowledge, or training needed for a job.",
    example:
      "We are looking for a qualified candidate with experience in sales.",
    translation: "我們正在尋找具備銷售經驗的合格人選。",
    category: "work",
    collocation: "be qualified for a position 符合職位資格",
  },
  {
    id: "work-initiative",
    word: "initiative",
    phonetic: "/ɪˈnɪʃ.ə.tɪv/",
    partOfSpeech: "n.",
    meaning: "主動性；新措施",
    definition:
      "The ability to act without being told what to do; a new plan to improve something.",
    example:
      "She took the initiative to organize a training session for new staff.",
    translation: "她主動為新進員工安排了一場訓練課程。",
    category: "work",
    collocation: "take the initiative 主動採取行動",
  },
  {
    id: "travel-itinerary",
    word: "itinerary",
    phonetic: "/aɪˈtɪn.ə.rer.i/",
    partOfSpeech: "n.",
    meaning: "行程表",
    definition: "A plan showing the places, dates, and times of a journey.",
    example: "A detailed itinerary will be emailed to all tour participants.",
    translation: "詳細行程表將以電子郵件寄給所有參團旅客。",
    category: "travel",
    collocation: "a detailed itinerary 詳細行程表",
  },
  {
    id: "travel-accommodation",
    word: "accommodation",
    phonetic: "/əˌkɑː.məˈdeɪ.ʃən/",
    partOfSpeech: "n.",
    meaning: "住宿；住宿設施",
    definition: "A place to stay while traveling or living away from home.",
    example:
      "The registration fee includes meals but does not cover accommodation.",
    translation: "報名費包含餐點，但不包含住宿。",
    category: "travel",
    collocation: "book accommodation 預訂住宿",
  },
  {
    id: "travel-departure",
    word: "departure",
    phonetic: "/dɪˈpɑːr.tʃɚ/",
    partOfSpeech: "n.",
    meaning: "出發；離境",
    definition:
      "The act of leaving a place, especially at the start of a journey.",
    example:
      "Passengers should arrive at the gate thirty minutes before departure.",
    translation: "旅客應在起飛前三十分鐘抵達登機門。",
    category: "travel",
    collocation: "departure time 出發時間",
  },
  {
    id: "travel-reservation",
    word: "reservation",
    phonetic: "/ˌrez.ɚˈveɪ.ʃən/",
    partOfSpeech: "n.",
    meaning: "預訂；預約",
    definition: "An arrangement to keep a room, seat, or table for someone.",
    example:
      "Please confirm your hotel reservation at least two days in advance.",
    translation: "請至少提前兩天確認您的飯店訂房。",
    category: "travel",
    collocation: "make a reservation 預訂",
  },
  {
    id: "travel-complimentary",
    word: "complimentary",
    phonetic: "/ˌkɑːm.pləˈmen.t̬ɚ.i/",
    partOfSpeech: "adj.",
    meaning: "免費贈送的；招待的",
    definition: "Provided free of charge, often as a courtesy to a customer.",
    example:
      "Guests receive a complimentary breakfast in the hotel restaurant.",
    translation: "住客可在飯店餐廳享用免費早餐。",
    category: "travel",
    collocation: "complimentary breakfast 免費早餐",
  },
  {
    id: "travel-convenient",
    word: "convenient",
    phonetic: "/kənˈviː.ni.ənt/",
    partOfSpeech: "adj.",
    meaning: "方便的；便利的",
    definition:
      "Easy to use or suitable for a particular purpose or situation.",
    example: "The hotel is in a convenient location near the central station.",
    translation: "這間飯店位於中央車站附近，地點便利。",
    category: "travel",
    collocation: "a convenient location 便利的地點",
  },
  {
    id: "travel-reimburse",
    word: "reimburse",
    phonetic: "/ˌriː.ɪmˈbɝːs/",
    partOfSpeech: "v.",
    meaning: "償還；報銷",
    definition: "To pay someone back for money they have spent.",
    example:
      "The company will reimburse employees for approved travel expenses.",
    translation: "公司將報銷員工經核准的差旅費用。",
    category: "travel",
    collocation: "reimburse someone for expenses 報銷某人的費用",
  },
  {
    id: "travel-destination",
    word: "destination",
    phonetic: "/ˌdes.təˈneɪ.ʃən/",
    partOfSpeech: "n.",
    meaning: "目的地",
    definition: "The place that someone or something is traveling to.",
    example:
      "The island has become a popular destination for business retreats.",
    translation: "這座島已成為企業團隊移地研習的熱門目的地。",
    category: "travel",
    collocation: "reach a destination 抵達目的地",
  },
  {
    id: "business-revenue",
    word: "revenue",
    phonetic: "/ˈrev.ə.nuː/",
    partOfSpeech: "n.",
    meaning: "營收；收入",
    definition: "Money received by a business from its regular activities.",
    example:
      "Online sales accounted for nearly half of the company’s annual revenue.",
    translation: "線上銷售幾乎占公司年營收的一半。",
    category: "business",
    collocation: "annual revenue 年營收",
  },
  {
    id: "business-negotiate",
    word: "negotiate",
    phonetic: "/nɪˈɡoʊ.ʃi.eɪt/",
    partOfSpeech: "v.",
    meaning: "談判；協商",
    definition: "To discuss something in order to reach an agreement.",
    example:
      "The purchasing team is negotiating a lower price with the supplier.",
    translation: "採購團隊正在與供應商協商更低的價格。",
    category: "business",
    collocation: "negotiate a contract 協商合約",
  },
  {
    id: "business-invoice",
    word: "invoice",
    phonetic: "/ˈɪn.vɔɪs/",
    partOfSpeech: "n.",
    meaning: "請款單；發票",
    definition:
      "A document listing goods or services and the amount to be paid.",
    example: "Payment is due within thirty days of the invoice date.",
    translation: "款項應於請款單開立日起三十天內付清。",
    category: "business",
    collocation: "issue an invoice 開立請款單",
  },
  {
    id: "business-purchase",
    word: "purchase",
    phonetic: "/ˈpɝː.tʃəs/",
    partOfSpeech: "v.",
    meaning: "購買",
    definition: "To buy something, especially in a formal or business context.",
    example:
      "Customers can purchase replacement parts directly from our website.",
    translation: "顧客可以直接從我們的網站購買替換零件。",
    category: "business",
    collocation: "purchase equipment 購買設備",
  },
  {
    id: "business-supplier",
    word: "supplier",
    phonetic: "/səˈplaɪ.ɚ/",
    partOfSpeech: "n.",
    meaning: "供應商",
    definition: "A person or company that provides goods or materials.",
    example: "We chose a local supplier to reduce delivery times.",
    translation: "我們選擇了當地供應商，以縮短交貨時間。",
    category: "business",
    collocation: "a reliable supplier 可靠的供應商",
  },
  {
    id: "business-expansion",
    word: "expansion",
    phonetic: "/ɪkˈspæn.ʃən/",
    partOfSpeech: "n.",
    meaning: "擴張；拓展",
    definition: "An increase in the size, range, or activities of something.",
    example:
      "The company’s expansion into overseas markets created several new jobs.",
    translation: "公司拓展海外市場，創造了數個新職缺。",
    category: "business",
    collocation: "business expansion 業務擴張",
  },
  {
    id: "business-competitive",
    word: "competitive",
    phonetic: "/kəmˈpet̬.ə.t̬ɪv/",
    partOfSpeech: "adj.",
    meaning: "有競爭力的；競爭激烈的",
    definition:
      "As good as or better than others of a similar kind; involving strong competition.",
    example: "The retailer offers competitive prices on office supplies.",
    translation: "這家零售商以有競爭力的價格販售辦公用品。",
    category: "business",
    collocation: "competitive prices 有競爭力的價格",
  },
  {
    id: "business-guarantee",
    word: "guarantee",
    phonetic: "/ˌɡer.ənˈtiː/",
    partOfSpeech: "v.",
    meaning: "保證；擔保",
    definition:
      "To promise that something will happen or that something has a particular quality.",
    example: "We guarantee delivery within three business days.",
    translation: "我們保證在三個工作天內送達。",
    category: "business",
    collocation: "guarantee delivery 保證交貨",
  },
  {
    id: "daily-perspective",
    word: "perspective",
    phonetic: "/pɚˈspek.tɪv/",
    partOfSpeech: "n.",
    meaning: "觀點；看法",
    definition: "A particular way of thinking about or seeing something.",
    example:
      "Learning another language helps us see the world from a different perspective.",
    translation: "學習另一種語言，幫助我們以不同的觀點看世界。",
    category: "daily",
    collocation: "from a different perspective 從不同的觀點",
  },
  {
    id: "daily-maintain",
    word: "maintain",
    phonetic: "/meɪnˈteɪn/",
    partOfSpeech: "v.",
    meaning: "維持；保養",
    definition: "To keep something in good condition or at the same level.",
    example: "Regular practice helps you maintain your language skills.",
    translation: "規律練習能幫助你維持語言能力。",
    category: "daily",
    collocation: "maintain a routine 維持固定作息",
  },
  {
    id: "daily-available",
    word: "available",
    phonetic: "/əˈveɪ.lə.bəl/",
    partOfSpeech: "adj.",
    meaning: "可取得的；有空的",
    definition: "Able to be used or obtained; free to do something.",
    example:
      "Additional information is available on the community center’s website.",
    translation: "社區中心網站上提供更多資訊。",
    category: "daily",
    collocation: "be available online 可在線上取得",
  },
  {
    id: "daily-recommend",
    word: "recommend",
    phonetic: "/ˌrek.əˈmend/",
    partOfSpeech: "v.",
    meaning: "推薦；建議",
    definition:
      "To suggest that someone should do or choose something because it is useful or suitable.",
    example:
      "The instructor recommends reviewing new words before going to bed.",
    translation: "老師建議在睡前複習新單字。",
    category: "daily",
    collocation: "recommend doing something 建議做某事",
  },
  {
    id: "daily-considerable",
    word: "considerable",
    phonetic: "/kənˈsɪd.ɚ.ə.bəl/",
    partOfSpeech: "adj.",
    meaning: "相當大的；可觀的",
    definition: "Large enough in amount or degree to be important.",
    example: "Preparing meals at home can lead to considerable savings.",
    translation: "在家準備餐點可以省下可觀的費用。",
    category: "daily",
    collocation: "considerable progress 相當大的進步",
  },
  {
    id: "daily-alternative",
    word: "alternative",
    phonetic: "/ɔːlˈtɝː.nə.t̬ɪv/",
    partOfSpeech: "n.",
    meaning: "替代方案；其他選擇",
    definition: "Something you can choose instead of another thing.",
    example: "Taking the bus is an affordable alternative to driving.",
    translation: "搭公車是開車以外經濟實惠的選擇。",
    category: "daily",
    collocation: "an alternative to something 某事物的替代方案",
  },
  {
    id: "daily-beneficial",
    word: "beneficial",
    phonetic: "/ˌben.əˈfɪʃ.əl/",
    partOfSpeech: "adj.",
    meaning: "有益的；有幫助的",
    definition: "Having a helpful or positive effect.",
    example:
      "A short walk after lunch can be beneficial to your concentration.",
    translation: "午餐後短暫散步有助於專注力。",
    category: "daily",
    collocation: "be beneficial to something 對某事物有益",
  },
  {
    id: "daily-consistent",
    word: "consistent",
    phonetic: "/kənˈsɪs.tənt/",
    partOfSpeech: "adj.",
    meaning: "持續穩定的；一致的",
    definition: "Continuing in a similar way over time without large changes.",
    example:
      "Consistent effort is more useful than studying for hours just once a month.",
    translation:
      "持續穩定的努力，比每個月只集中讀一次、一次讀好幾個小時更有幫助。",
    category: "daily",
    collocation: "consistent effort 持續穩定的努力",
  },
  {
    id: "work-agenda",
    word: "agenda",
    phonetic: "/əˈdʒen.də/",
    partOfSpeech: "n.",
    meaning: "議程",
    definition: "A list of subjects to be discussed at a meeting.",
    example: "Please review the agenda before tomorrow’s team meeting.",
    translation: "請在明天的團隊會議前先查看議程。",
    category: "work",
    collocation: "on the agenda 在議程中",
  },
  {
    id: "work-colleague",
    word: "colleague",
    phonetic: "/ˈkɑː.liːɡ/",
    partOfSpeech: "n.",
    meaning: "同事",
    definition:
      "A person who works with you, especially in the same profession.",
    example:
      "I asked a colleague to check the figures before I sent the report.",
    translation: "寄出報告前，我請一位同事檢查數據。",
    category: "work",
    collocation: "a former colleague 前同事",
  },
  {
    id: "work-accomplish",
    word: "accomplish",
    phonetic: "/əˈkɑːm.plɪʃ/",
    partOfSpeech: "v.",
    meaning: "完成；達成",
    definition: "To succeed in doing or finishing something.",
    example:
      "With a clear plan, the team accomplished all its goals for the month.",
    translation: "透過明確的計畫，團隊達成了當月所有目標。",
    category: "work",
    collocation: "accomplish a goal 達成目標",
  },
  {
    id: "work-delegate",
    word: "delegate",
    phonetic: "/ˈdel.ə.ɡeɪt/",
    partOfSpeech: "v.",
    meaning: "委派；授權",
    definition: "To give a task or responsibility to another person.",
    example: "The manager delegated routine tasks to experienced team members.",
    translation: "經理將例行工作委派給有經驗的團隊成員。",
    category: "work",
    collocation: "delegate tasks to someone 將任務委派給某人",
  },
  {
    id: "work-supervise",
    word: "supervise",
    phonetic: "/ˈsuː.pɚ.vaɪz/",
    partOfSpeech: "v.",
    meaning: "監督；管理",
    definition: "To watch and direct an activity or the people doing it.",
    example:
      "An experienced technician will supervise the installation of the equipment.",
    translation: "一位資深技術人員將監督設備的安裝作業。",
    category: "work",
    collocation: "supervise a project 監督專案",
  },
  {
    id: "work-recruit",
    word: "recruit",
    phonetic: "/rɪˈkruːt/",
    partOfSpeech: "v.",
    meaning: "招募",
    definition: "To find and employ new people for a company or organization.",
    example:
      "The firm plans to recruit ten engineers before the end of the year.",
    translation: "這家公司計畫在年底前招募十位工程師。",
    category: "work",
    collocation: "recruit new employees 招募新員工",
  },
  {
    id: "work-orientation",
    word: "orientation",
    phonetic: "/ˌɔːr.i.enˈteɪ.ʃən/",
    partOfSpeech: "n.",
    meaning: "新進人員訓練；入門介紹",
    definition:
      "Training or information that helps someone become familiar with a new job or situation.",
    example: "New employees attend an orientation session on their first day.",
    translation: "新員工會在到職第一天參加新進人員訓練。",
    category: "work",
    collocation: "an orientation session 新進人員訓練課程",
  },
  {
    id: "work-attendance",
    word: "attendance",
    phonetic: "/əˈten.dəns/",
    partOfSpeech: "n.",
    meaning: "出席；出席人數",
    definition:
      "The act of being present at an event, or the number of people present.",
    example:
      "Attendance at the safety workshop is required for all warehouse staff.",
    translation: "所有倉庫員工都必須出席安全講習。",
    category: "work",
    collocation: "confirm your attendance 確認出席",
  },
  {
    id: "work-promotion",
    word: "promotion",
    phonetic: "/prəˈmoʊ.ʃən/",
    partOfSpeech: "n.",
    meaning: "升遷；促銷",
    definition:
      "A move to a higher position at work; an activity intended to increase sales.",
    example:
      "Her excellent leadership earned her a promotion to regional manager.",
    translation: "出色的領導能力讓她升任區域經理。",
    category: "work",
    collocation: "receive a promotion 獲得升遷",
  },
  {
    id: "work-performance",
    word: "performance",
    phonetic: "/pɚˈfɔːr.məns/",
    partOfSpeech: "n.",
    meaning: "工作表現；效能",
    definition: "How well a person, machine, or organization does a task.",
    example: "The supervisor reviews each employee’s performance twice a year.",
    translation: "主管每年評估每位員工的工作表現兩次。",
    category: "work",
    collocation: "a performance review 績效考核",
  },
  {
    id: "work-procedure",
    word: "procedure",
    phonetic: "/prəˈsiː.dʒɚ/",
    partOfSpeech: "n.",
    meaning: "程序；步驟",
    definition: "An established series of actions used to do something.",
    example:
      "Please follow the standard procedure when reporting a technical issue.",
    translation: "回報技術問題時，請遵循標準程序。",
    category: "work",
    collocation: "follow a procedure 遵循程序",
  },
  {
    id: "work-confidential",
    word: "confidential",
    phonetic: "/ˌkɑːn.fəˈden.ʃəl/",
    partOfSpeech: "adj.",
    meaning: "機密的；保密的",
    definition:
      "Intended to be kept secret and shared only with authorized people.",
    example:
      "Employees must keep all customer account information confidential.",
    translation: "員工必須對所有顧客帳戶資料保密。",
    category: "work",
    collocation: "confidential information 機密資訊",
  },
  {
    id: "travel-boarding",
    word: "boarding",
    phonetic: "/ˈbɔːr.dɪŋ/",
    partOfSpeech: "n.",
    meaning: "登機；登船",
    definition:
      "The process of getting onto an aircraft, ship, or other vehicle.",
    example: "Boarding for Flight 218 will begin at Gate 6 in ten minutes.",
    translation: "218 號班機將在十分鐘後於 6 號登機門開始登機。",
    category: "travel",
    collocation: "a boarding pass 登機證",
  },
  {
    id: "travel-baggage",
    word: "baggage",
    phonetic: "/ˈbæɡ.ɪdʒ/",
    partOfSpeech: "n.",
    meaning: "行李",
    definition: "The bags and suitcases a traveler takes on a journey.",
    example: "Each passenger may check one piece of baggage free of charge.",
    translation: "每位旅客可免費托運一件行李。",
    category: "travel",
    collocation: "checked baggage 托運行李",
  },
  {
    id: "travel-cancellation",
    word: "cancellation",
    phonetic: "/ˌkæn.səˈleɪ.ʃən/",
    partOfSpeech: "n.",
    meaning: "取消",
    definition:
      "The act of deciding that a planned event or arrangement will not happen.",
    example:
      "There is no cancellation fee if you notify us at least 48 hours in advance.",
    translation: "若至少提前 48 小時通知我們，就不收取消費用。",
    category: "travel",
    collocation: "a cancellation fee 取消費用",
  },
  {
    id: "travel-confirm",
    word: "confirm",
    phonetic: "/kənˈfɝːm/",
    partOfSpeech: "v.",
    meaning: "確認；證實",
    definition: "To state or establish that something is correct or definite.",
    example: "Please call the hotel to confirm your arrival time.",
    translation: "請致電飯店確認您的抵達時間。",
    category: "travel",
    collocation: "confirm a booking 確認預訂",
  },
  {
    id: "travel-transfer",
    word: "transfer",
    phonetic: "/trænsˈfɝː/",
    partOfSpeech: "v.",
    meaning: "轉乘；轉移",
    definition: "To move from one place, vehicle, or situation to another.",
    example:
      "You will need to transfer to the express train at Central Station.",
    translation: "您需要在中央車站轉乘快車。",
    category: "travel",
    collocation: "transfer to another train 轉乘另一班火車",
  },
  {
    id: "travel-transit",
    word: "transit",
    phonetic: "/ˈtræn.zɪt/",
    partOfSpeech: "n.",
    meaning: "運輸；運送途中",
    definition: "The movement of people or goods from one place to another.",
    example:
      "The city’s public transit system provides easy access to the airport.",
    translation: "這座城市的大眾運輸系統讓前往機場十分方便。",
    category: "travel",
    collocation: "public transit 大眾運輸",
  },
  {
    id: "travel-fare",
    word: "fare",
    phonetic: "/fer/",
    partOfSpeech: "n.",
    meaning: "車資；票價",
    definition:
      "The price paid for a journey on a bus, train, aircraft, or taxi.",
    example: "The train fare includes a seat reservation.",
    translation: "火車票價包含劃位費。",
    category: "travel",
    collocation: "a round-trip fare 來回票價",
  },
  {
    id: "travel-surcharge",
    word: "surcharge",
    phonetic: "/ˈsɝː.tʃɑːrdʒ/",
    partOfSpeech: "n.",
    meaning: "附加費",
    definition: "An extra amount charged in addition to the usual price.",
    example: "A fuel surcharge will be added to the total ticket price.",
    translation: "機票總價將加上燃油附加費。",
    category: "travel",
    collocation: "a fuel surcharge 燃油附加費",
  },
  {
    id: "travel-refundable",
    word: "refundable",
    phonetic: "/rɪˈfʌn.də.bəl/",
    partOfSpeech: "adj.",
    meaning: "可退款的",
    definition:
      "Allowing the customer to get back money that has been paid, under stated conditions.",
    example: "Tickets purchased at the discounted rate are not refundable.",
    translation: "以優惠價格購買的票券不得退款。",
    category: "travel",
    collocation: "a refundable deposit 可退還的押金",
  },
  {
    id: "travel-vacancy",
    word: "vacancy",
    phonetic: "/ˈveɪ.kən.si/",
    partOfSpeech: "n.",
    meaning: "空房；職缺",
    definition: "An available room or position that has not been filled.",
    example:
      "The receptionist checked whether the hotel had any vacancies for the weekend.",
    translation: "接待人員查看飯店週末是否還有空房。",
    category: "travel",
    collocation: "no vacancies 無空房",
  },
  {
    id: "travel-shuttle",
    word: "shuttle",
    phonetic: "/ˈʃʌt̬.əl/",
    partOfSpeech: "n.",
    meaning: "接駁車；定期往返班次",
    definition:
      "A vehicle or service that travels regularly between two places.",
    example:
      "A free shuttle runs between the airport and the hotel every half hour.",
    translation: "機場與飯店之間每半小時有一班免費接駁車。",
    category: "travel",
    collocation: "an airport shuttle 機場接駁車",
  },
  {
    id: "travel-customs",
    word: "customs",
    phonetic: "/ˈkʌs.təmz/",
    partOfSpeech: "n.",
    meaning: "海關",
    definition:
      "The authority that checks goods entering a country and collects relevant taxes.",
    example:
      "Travelers must declare certain food products when passing through customs.",
    translation: "旅客通關時必須申報某些食品。",
    category: "travel",
    collocation: "go through customs 通過海關",
  },
  {
    id: "business-budget",
    word: "budget",
    phonetic: "/ˈbʌdʒ.ɪt/",
    partOfSpeech: "n.",
    meaning: "預算",
    definition:
      "A plan for how much money can be spent for a particular purpose.",
    example:
      "The advertising campaign was completed within the approved budget.",
    translation: "這次廣告活動在核准的預算內完成。",
    category: "business",
    collocation: "within budget 在預算內",
  },
  {
    id: "business-estimate",
    word: "estimate",
    phonetic: "/ˈes.tə.mət/",
    partOfSpeech: "n.",
    meaning: "估價；估計",
    definition: "An approximate calculation of an amount, cost, or value.",
    example:
      "The contractor provided a written estimate for the office repairs.",
    translation: "承包商提供了辦公室修繕的書面估價。",
    category: "business",
    collocation: "a cost estimate 費用估計",
  },
  {
    id: "business-proposal",
    word: "proposal",
    phonetic: "/prəˈpoʊ.zəl/",
    partOfSpeech: "n.",
    meaning: "提案；建議書",
    definition: "A formal suggestion or plan presented for consideration.",
    example:
      "The client accepted our proposal for redesigning its online store.",
    translation: "客戶接受了我們重新設計其網路商店的提案。",
    category: "business",
    collocation: "submit a proposal 提交提案",
  },
  {
    id: "business-contract",
    word: "contract",
    phonetic: "/ˈkɑːn.trækt/",
    partOfSpeech: "n.",
    meaning: "合約；契約",
    definition:
      "A formal agreement that creates legal responsibilities for the parties involved.",
    example: "Both parties signed the contract after reviewing its terms.",
    translation: "雙方審閱條款後簽署了合約。",
    category: "business",
    collocation: "sign a contract 簽署合約",
  },
  {
    id: "business-merchandise",
    word: "merchandise",
    phonetic: "/ˈmɝː.tʃən.daɪs/",
    partOfSpeech: "n.",
    meaning: "商品；貨品",
    definition: "Goods that are bought and sold by a business.",
    example:
      "Damaged merchandise may be returned within fourteen days of purchase.",
    translation: "受損商品可於購買後十四天內退回。",
    category: "business",
    collocation: "return merchandise 退回商品",
  },
  {
    id: "business-inventory",
    word: "inventory",
    phonetic: "/ˈɪn.vən.tɔːr.i/",
    partOfSpeech: "n.",
    meaning: "庫存；存貨清單",
    definition:
      "The goods a business has available, or a detailed list of those goods.",
    example: "The warehouse team checks inventory levels every Friday.",
    translation: "倉庫團隊每週五檢查庫存量。",
    category: "business",
    collocation: "inventory levels 庫存量",
  },
  {
    id: "business-shipment",
    word: "shipment",
    phonetic: "/ˈʃɪp.mənt/",
    partOfSpeech: "n.",
    meaning: "一批貨物；出貨",
    definition:
      "Goods sent together, or the act of sending goods to a destination.",
    example:
      "The shipment of replacement parts is expected to arrive on Tuesday.",
    translation: "這批替換零件預計星期二送達。",
    category: "business",
    collocation: "track a shipment 追蹤貨件",
  },
  {
    id: "business-retailer",
    word: "retailer",
    phonetic: "/ˈriː.teɪ.lɚ/",
    partOfSpeech: "n.",
    meaning: "零售商",
    definition: "A business that sells goods directly to individual customers.",
    example: "The manufacturer supplies electronic devices to major retailers.",
    translation: "這家製造商向大型零售商供應電子裝置。",
    category: "business",
    collocation: "an online retailer 網路零售商",
  },
  {
    id: "business-wholesale",
    word: "wholesale",
    phonetic: "/ˈhoʊl.seɪl/",
    partOfSpeech: "adj.",
    meaning: "批發的",
    definition:
      "Relating to the sale of goods in large quantities, usually to other businesses.",
    example:
      "Wholesale prices are available for orders of one hundred units or more.",
    translation: "訂購一百件以上可享批發價格。",
    category: "business",
    collocation: "wholesale prices 批發價格",
  },
  {
    id: "business-profit",
    word: "profit",
    phonetic: "/ˈprɑː.fɪt/",
    partOfSpeech: "n.",
    meaning: "利潤；獲利",
    definition:
      "Money remaining after the costs of running a business have been paid.",
    example: "Reducing packaging costs helped the company increase its profit.",
    translation: "降低包裝成本幫助公司增加了利潤。",
    category: "business",
    collocation: "make a profit 獲利",
  },
  {
    id: "business-discount",
    word: "discount",
    phonetic: "/ˈdɪs.kaʊnt/",
    partOfSpeech: "n.",
    meaning: "折扣",
    definition: "A reduction in the usual price of a product or service.",
    example:
      "Customers receive a ten percent discount on their first online order.",
    translation: "顧客首次線上訂購可享九折優惠。",
    category: "business",
    collocation: "offer a discount 提供折扣",
  },
  {
    id: "business-transaction",
    word: "transaction",
    phonetic: "/trænˈzæk.ʃən/",
    partOfSpeech: "n.",
    meaning: "交易",
    definition:
      "An act of buying, selling, or exchanging money, goods, or services.",
    example:
      "You will receive an email confirmation after the transaction is complete.",
    translation: "交易完成後，您會收到電子郵件確認函。",
    category: "business",
    collocation: "complete a transaction 完成交易",
  },
  {
    id: "daily-appointment",
    word: "appointment",
    phonetic: "/əˈpɔɪnt.mənt/",
    partOfSpeech: "n.",
    meaning: "預約；約定",
    definition:
      "An arrangement to meet someone at a particular time and place.",
    example:
      "Please arrive ten minutes before your appointment with the doctor.",
    translation: "請在與醫師預約的時間前十分鐘抵達。",
    category: "daily",
    collocation: "make an appointment 預約",
  },
  {
    id: "daily-appliance",
    word: "appliance",
    phonetic: "/əˈplaɪ.əns/",
    partOfSpeech: "n.",
    meaning: "家電；器具",
    definition:
      "A device, often electrical, used to do a particular job in the home.",
    example:
      "Energy-efficient appliances can help lower your monthly electricity bill.",
    translation: "節能家電有助於降低每月電費。",
    category: "daily",
    collocation: "household appliances 家用電器",
  },
  {
    id: "daily-subscription",
    word: "subscription",
    phonetic: "/səbˈskrɪp.ʃən/",
    partOfSpeech: "n.",
    meaning: "訂閱；訂閱費",
    definition:
      "An arrangement to receive a product or service regularly by paying a fee.",
    example:
      "Your magazine subscription includes access to all online articles.",
    translation: "您的雜誌訂閱包含所有線上文章的閱讀權限。",
    category: "daily",
    collocation: "an annual subscription 年度訂閱",
  },
  {
    id: "daily-renewal",
    word: "renewal",
    phonetic: "/rɪˈnuː.əl/",
    partOfSpeech: "n.",
    meaning: "續約；更新",
    definition:
      "The act of extending the period during which an agreement or membership is valid.",
    example:
      "A membership renewal notice will be sent one month before the expiration date.",
    translation: "會員資格到期前一個月會寄送續約通知。",
    category: "daily",
    collocation: "membership renewal 會員續約",
  },
  {
    id: "daily-receipt",
    word: "receipt",
    phonetic: "/rɪˈsiːt/",
    partOfSpeech: "n.",
    meaning: "收據",
    definition:
      "A document showing that money has been paid for goods or services.",
    example: "Bring your original receipt if you wish to exchange the item.",
    translation: "若要換貨，請攜帶原始收據。",
    category: "daily",
    collocation: "keep a receipt 保留收據",
  },
  {
    id: "daily-eligible",
    word: "eligible",
    phonetic: "/ˈel.ə.dʒə.bəl/",
    partOfSpeech: "adj.",
    meaning: "符合資格的",
    definition:
      "Meeting the conditions necessary to receive something or take part in an activity.",
    example: "Students are eligible for a reduced admission fee at the museum.",
    translation: "學生符合資格，可享博物館優惠票價。",
    category: "daily",
    collocation: "be eligible for a discount 符合折扣資格",
  },
  {
    id: "daily-requirement",
    word: "requirement",
    phonetic: "/rɪˈkwaɪr.mənt/",
    partOfSpeech: "n.",
    meaning: "要求；必要條件",
    definition: "Something that is needed or must be done.",
    example: "A valid photo ID is a requirement for opening a library account.",
    translation: "申辦圖書館帳戶必須出示有效的附照片身分證件。",
    category: "daily",
    collocation: "meet a requirement 符合要求",
  },
  {
    id: "daily-notify",
    word: "notify",
    phonetic: "/ˈnoʊ.t̬ə.faɪ/",
    partOfSpeech: "v.",
    meaning: "通知；告知",
    definition: "To formally tell someone about something.",
    example:
      "Please notify the front desk if you notice any damage to your room.",
    translation: "如果發現房間有任何損壞，請通知櫃檯。",
    category: "daily",
    collocation: "notify someone of a change 通知某人有變更",
  },
  {
    id: "daily-participate",
    word: "participate",
    phonetic: "/pɑːrˈtɪs.ə.peɪt/",
    partOfSpeech: "v.",
    meaning: "參與；參加",
    definition: "To take part in an activity or event.",
    example:
      "Residents are encouraged to participate in the neighborhood cleanup.",
    translation: "鼓勵居民參加社區清潔活動。",
    category: "daily",
    collocation: "participate in an event 參與活動",
  },
  {
    id: "daily-accessible",
    word: "accessible",
    phonetic: "/əkˈses.ə.bəl/",
    partOfSpeech: "adj.",
    meaning: "可到達的；易於使用的",
    definition: "Easy to reach, enter, obtain, or use.",
    example:
      "The new community center is fully accessible to wheelchair users.",
    translation: "輪椅使用者可以無障礙地使用新的社區中心。",
    category: "daily",
    collocation: "accessible to everyone 所有人皆可使用的",
  },
  {
    id: "daily-essential",
    word: "essential",
    phonetic: "/ɪˈsen.ʃəl/",
    partOfSpeech: "adj.",
    meaning: "必要的；不可或缺的",
    definition: "Completely necessary for a particular purpose.",
    example:
      "A reliable internet connection is essential for this online course.",
    translation: "穩定的網路連線是上這門線上課程的必要條件。",
    category: "daily",
    collocation: "be essential for something 對某事物不可或缺",
  },
  {
    id: "daily-approximately",
    word: "approximately",
    phonetic: "/əˈprɑːk.sə.mət.li/",
    partOfSpeech: "adv.",
    meaning: "大約；近似地",
    definition: "Close to a particular number, amount, or time, but not exact.",
    example: "The guided tour lasts approximately ninety minutes.",
    translation: "導覽行程大約持續九十分鐘。",
    category: "daily",
    collocation: "approximately one hour 大約一小時",
  },
];

export const words: Word[] = [
  ...originalWords,
  ...workAdditions,
  ...travelAdditions,
  ...businessAdditions,
  ...dailyAdditions,
  ...workAdvanced,
  ...travelAdvanced,
  ...businessAdvanced,
  ...dailyAdvanced,
].map((entry) => {
  const difficulty = difficultyByWordId[entry.id];
  const tier = vocabularyTiers.find((item) => item.id === difficulty);
  if (!tier) throw new Error(`Missing vocabulary difficulty: ${entry.id}`);
  return { ...entry, difficulty, level: tier.label };
});

export type GrammarLesson = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  duration: number;
  rule: string;
  structure: string;
  examples: { english: string; chinese: string }[];
  tip: string;
};

export const grammarLessons: GrammarLesson[] = [
  {
    id: "present-perfect",
    title: "現在完成式",
    subtitle: "連結過去與現在的時間線",
    tag: "時態",
    duration: 8,
    rule: "現在完成式用來描述過去發生、但與現在仍有關聯的經驗或結果，也可表示從過去持續到現在的狀態。for 接一段時間；since 接起始時間點。",
    structure: "主詞 + have / has + 過去分詞（p.p.）",
    examples: [
      {
        english: "Ms. Chen has worked in the sales department for five years.",
        chinese: "陳女士已在業務部工作五年。（現在仍在職）",
      },
      {
        english: "We have already sent the revised proposal to the client.",
        chinese: "我們已經將修訂後的提案寄給客戶。",
      },
    ],
    tip: "看到 already、yet、ever、never、so far，可留意現在完成式；若有 yesterday 或 last year 等明確且已結束的過去時間，通常使用過去簡單式。",
  },
  {
    id: "passive-voice",
    title: "被動語態",
    subtitle: "把焦點放在動作的承受者",
    tag: "句型",
    duration: 7,
    rule: "當主詞是接受動作的人或事物時，使用被動語態。be 動詞隨時態與主詞改變，主要動詞維持過去分詞。執行者若不重要，可以省略 by 片語。",
    structure: "主詞 + be 動詞 + 過去分詞（+ by 執行者）",
    examples: [
      {
        english: "All applications must be submitted by Friday.",
        chinese: "所有申請都必須最遲於星期五繳交。",
      },
      {
        english: "The conference room is being cleaned at the moment.",
        chinese: "會議室目前正在清潔中。",
      },
    ],
    tip: "先判斷主詞能不能主動執行該動作。例如 applications 無法自己「繳交」，所以需要被動。情態助動詞後的被動形式是 modal + be + p.p.。",
  },
  {
    id: "relative-clauses",
    title: "關係子句",
    subtitle: "用一句話補充人與事物",
    tag: "子句",
    duration: 10,
    rule: "關係子句放在名詞後面，限定或補充名詞的意思。who 通常指人；which 指事物；that 可在限定關係子句中指人或事物，但不引導逗號後的非限定關係子句。whose 表示所屬關係，後面須接名詞。",
    structure:
      "先行詞 + who / which / that + 子句其餘部分\n先行詞 + whose + 名詞 + 子句其餘部分",
    examples: [
      {
        english: "The employee who organized the event received an award.",
        chinese: "籌辦這場活動的員工獲得了獎項。",
      },
      {
        english:
          "Please contact the supplier whose products we ordered last week.",
        chinese: "請聯絡我們上週訂購產品的那家供應商。",
      },
    ],
    tip: "空格後若緊接名詞，例如「___ products」，且有所有關係，可考慮 whose。限定關係子句中，關係代名詞作受詞時常可省略；作主詞時不能直接省略。",
  },
  {
    id: "conditionals",
    title: "條件句與假設語氣",
    subtitle: "分清實際可能與想像情況",
    tag: "句型",
    duration: 9,
    rule: "描述未來可能發生的條件時，if 子句通常用現在簡單式，主要子句常用 will + 原形動詞。描述與現在事實不同或可能性較低的假設時，if 子句常用過去式，主要子句可用 would、could 或 might + 原形動詞。",
    structure:
      "未來可能的條件：If + 現在簡單式, 主詞 + will + 原形動詞\n與現在不同或較不可能的假設：If + 過去式, 主詞 + would / could / might + 原形動詞",
    examples: [
      {
        english: "If you register today, you will receive a discount.",
        chinese: "如果你今天報名，就能獲得折扣。",
      },
      {
        english: "If we had a larger budget, we would hire another designer.",
        chinese: "如果我們有更多預算，就會再聘一位設計師。（目前預算不足）",
      },
    ],
    tip: "一般預測性的未來條件句中，if 子句通常不用 will。will 也可能表示意願或禮貌請求，所以不能把「if 後永遠不能用 will」當成絕對規則；本課先分辨一般未來條件與現在假設。",
  },
  {
    id: "gerunds-infinitives",
    title: "動名詞與不定詞",
    subtitle: "掌握常見動詞搭配",
    tag: "動詞",
    duration: 8,
    rule: "有些動詞後面接動名詞 V-ing，例如 enjoy、avoid、finish、consider；有些接 to + 原形動詞，例如 decide、plan、agree、hope。介系詞後若接動詞，通常使用 V-ing。",
    structure: "avoid / consider + V-ing；decide / plan + to V",
    examples: [
      {
        english: "The team decided to postpone the product launch.",
        chinese: "團隊決定延後產品上市。",
      },
      {
        english: "We look forward to meeting you at the conference.",
        chinese: "我們期待在研討會與您見面。",
      },
    ],
    tip: "look forward to 的 to 是介系詞，因此後接 V-ing，而不是原形動詞。練習時把整組搭配一起記，比只背單一動詞更有效。",
  },
  {
    id: "conjunctions-prepositions",
    title: "連接詞與介系詞",
    subtitle: "從空格後面的結構判斷",
    tag: "詞性",
    duration: 7,
    rule: "在常見的完整句型中，because、although 等連接詞後面接子句（主詞 + 動詞）；because of、despite 等介系詞或介系詞片語後面可接名詞、代名詞或 V-ing。despite 表示讓步，because of 表示原因。",
    structure: "although / because + S + V；despite / because of + 名詞",
    examples: [
      {
        english: "Although the weather was bad, the delivery arrived on time.",
        chinese: "雖然天氣不好，貨物仍準時送達。",
      },
      {
        english: "The flight was delayed because of heavy snow.",
        chinese: "班機因大雪而延誤。",
      },
    ],
    tip: "先看空格後是名詞片語，還是具有主詞與動詞的子句，再判斷因果或讓步。although 也有 although tired、although working 等簡化形式，不能只靠是否看見主詞就斷定所有題目；although 與 but 一般不重複連接同一組子句。",
  },
  {
    id: "adjectives-adverbs",
    title: "形容詞與副詞",
    subtitle: "找到被修飾的字，就能選對詞性",
    tag: "詞性",
    duration: 8,
    rule: "形容詞通常修飾名詞，或放在連綴動詞（be、seem、become 等）後面描述主詞；副詞通常修飾動詞、形容詞、其他副詞或整個句子。選詞前先判斷空格在句中的功能。",
    structure: "形容詞 + 名詞；副詞 + 形容詞；動詞 + 副詞",
    examples: [
      {
        english: "The new assistant is efficient and completes tasks quickly.",
        chinese:
          "新助理很有效率，能迅速完成工作。（efficient 描述助理；quickly 修飾 completes）",
      },
      {
        english: "We are extremely pleased with the quality of the products.",
        chinese: "我們對產品品質非常滿意。（extremely 修飾形容詞 pleased）",
      },
    ],
    tip: "多益常把同一字根的不同詞性放在選項中，例如 successful / successfully。不要只看字尾：friendly 是形容詞，而 fast 可同時當形容詞與副詞。",
  },
  {
    id: "subject-verb-agreement",
    title: "主詞與動詞一致",
    subtitle: "排除修飾語，找到真正的主詞",
    tag: "動詞",
    duration: 8,
    rule: "動詞的單複數取決於真正的主詞，而非最接近動詞的名詞。介系詞片語或關係子句常插在主詞與動詞之間。each、everyone 等作主詞時通常搭配單數動詞；every + 單數名詞也搭配單數動詞。",
    structure: "單數主詞 + 單數動詞；複數主詞 + 複數動詞",
    examples: [
      {
        english: "The list of available positions is on the company website.",
        chinese: "可應徵職位的清單在公司網站上。（主詞是單數 list）",
      },
      {
        english: "Each of the applicants has at least two years of experience.",
        chinese: "每位應徵者都至少有兩年的經驗。（主詞 each 使用單數 has）",
      },
    ],
    tip: "先把 of、with、for 等開頭的修飾片語暫時括起來，再判斷主詞。A number of + 複數名詞通常配複數動詞；the number of + 複數名詞則配單數動詞。",
  },
  {
    id: "comparatives-superlatives",
    title: "比較級與最高級",
    subtitle: "用精確的方式比較差異",
    tag: "句型",
    duration: 7,
    rule: "比較兩者時通常使用比較級 + than；在三者以上的群體中表示最高程度時，通常使用 the + 最高級。較短的形容詞常加 -er / -est，較長的形容詞常搭配 more / most。",
    structure: "比較級 + than；the + 最高級；as + 原級 + as",
    examples: [
      {
        english:
          "The updated software is more reliable than the previous version.",
        chinese: "更新後的軟體比舊版本更可靠。",
      },
      {
        english: "This is the most convenient route to the convention center.",
        chinese: "這是前往會展中心最便利的路線。",
      },
    ],
    tip: "much、far、considerably 可加強比較級，例如 much faster；不要使用 more faster。as ... as 中間使用原級，例如 as efficient as。",
  },
  {
    id: "participles",
    title: "現在分詞與過去分詞",
    subtitle: "分辨主動、被動與感受的來源",
    tag: "詞性",
    duration: 9,
    rule: "分詞可修飾名詞。V-ing 常表示主動或進行，過去分詞常表示被動或完成。描述感受時，-ing 表示引起感受的人或事物，-ed 表示有此感受的人或其他感受者；不能只用「人用 -ed、物用 -ing」判斷。",
    structure:
      "名詞 + V-ing 片語（主動，如 employees attending a workshop）\n過去分詞 + 名詞（被動，如 a signed contract）",
    examples: [
      {
        english: "Employees attending the workshop should bring a laptop.",
        chinese: "參加工作坊的員工應攜帶筆記型電腦。（員工主動參加）",
      },
      {
        english: "Please return the signed contract by Friday.",
        chinese: "請最遲於星期五寄回已簽署的合約。（合約被簽署）",
      },
    ],
    tip: "先問名詞與動作的關係：是「做這個動作」還是「接受這個動作」？例如 an interesting presentation（引人興趣的簡報）與 interested participants（感興趣的參與者）。",
  },
  {
    id: "countable-uncountable",
    title: "可數與不可數名詞",
    subtitle: "選對數量詞與名詞形式",
    tag: "名詞",
    duration: 8,
    rule: "單數可數名詞可搭配 a / an，複數可數名詞可搭配 many、a few；不可數名詞在一般用法中不加複數 -s，可搭配 much、a little。information、equipment、advice、baggage 在一般用法中都是不可數名詞。",
    structure: "many / a few + 複數可數名詞；much / a little + 不可數名詞",
    examples: [
      {
        english: "We need a few additional chairs for the meeting.",
        chinese: "我們需要再多幾張椅子來開會。",
      },
      {
        english:
          "The technician provided some useful advice about the equipment.",
        chinese: "技術人員提供了一些關於設備的實用建議。",
      },
    ],
    tip: "要數不可數名詞，可用單位詞：two pieces of equipment、a piece of advice。a few / a little 表示「有一些」；few / little 通常帶有「幾乎沒有」的語氣。",
  },
  {
    id: "time-prepositions",
    title: "時間介系詞",
    subtitle: "掌握 at、on、in 與期限表達",
    tag: "介系詞",
    duration: 7,
    rule: "at 常用於精確時間，on 用於特定日期或星期，in 用於月份、年份或較長時段。by 表示截止期限，意思是「不晚於指定時間」；until 表示動作或狀態「持續到指定時間」。",
    structure: "at + 時刻；on + 日期／星期；in + 月份／年份",
    examples: [
      {
        english: "The meeting starts at 9 a.m. on Monday.",
        chinese: "會議在星期一上午九點開始。",
      },
      {
        english:
          "Please submit the form by Friday; the office will remain open until 6 p.m.",
        chinese: "請最遲在星期五繳交表格；辦公室將開放到下午六點。",
      },
    ],
    tip: "比較「finish by 5 p.m.（最遲五點完成）」與「work until 5 p.m.（持續工作到五點）」。by 包含指定的截止時間，不是一定要更早完成。last、next、this、every 等後面接時間名詞時，通常不加 at / on / in。",
  },
];

export type Question = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  kind: "vocabulary" | "grammar";
};

export const questions: Question[] = [
  {
    id: "q-deadline",
    prompt:
      "The team worked late to meet the _____ for submitting the annual report.",
    options: ["destination", "deadline", "reservation", "revenue"],
    answer: 1,
    kind: "vocabulary",
    explanation:
      "meet the deadline 是「趕上截止期限」的固定搭配。團隊加班是為了按時繳交年度報告。",
  },
  {
    id: "q-complimentary",
    prompt:
      "All hotel guests can enjoy a _____ breakfast at no additional charge.",
    options: ["competitive", "qualified", "complimentary", "considerable"],
    answer: 2,
    kind: "vocabulary",
    explanation:
      "complimentary 表示「免費贈送的」，與 at no additional charge（不另收費）呼應。注意它與 complementary（互補的）不同。",
  },
  {
    id: "q-reimburse",
    prompt:
      "Please keep your receipts so that the company can _____ you for travel expenses.",
    options: ["reimburse", "maintain", "negotiate", "reschedule"],
    answer: 0,
    kind: "vocabulary",
    explanation:
      "reimburse someone for expenses 表示「報銷某人的費用」。保留收據是為了向公司申請報銷。",
  },
  {
    id: "q-efficient",
    prompt:
      "The new system processes orders in half the time, making it much more _____.",
    options: ["available", "considerable", "qualified", "efficient"],
    answer: 3,
    kind: "vocabulary",
    explanation:
      "efficient 表示「有效率的」。只需原本一半的時間處理訂單，代表系統效率提高。",
  },
  {
    id: "q-itinerary",
    prompt:
      "Our travel agent sent us a detailed _____ listing every stop on the tour.",
    options: ["invoice", "initiative", "itinerary", "assignment"],
    answer: 2,
    kind: "vocabulary",
    explanation:
      "itinerary 是「行程表」，會列出旅程中的地點與安排。invoice 是請款單；initiative 是主動性或新措施；assignment 是工作任務。",
  },
  {
    id: "q-revenue",
    prompt:
      "The company’s annual _____ increased by 12 percent as a result of strong sales.",
    options: ["departure", "revenue", "alternative", "perspective"],
    answer: 1,
    kind: "vocabulary",
    explanation:
      "revenue 是「營收」，銷售表現強勁可使年營收成長。annual revenue 是常見商務搭配。",
  },
  {
    id: "q-supplier",
    prompt:
      "We need a reliable _____ who can deliver fresh ingredients every morning.",
    options: ["supplier", "reservation", "deadline", "expansion"],
    answer: 0,
    kind: "vocabulary",
    explanation:
      "supplier 是提供商品或材料的「供應商」。後面的 who can deliver fresh ingredients 描述供應商的工作。",
  },
  {
    id: "q-negotiate",
    prompt:
      "Representatives of the two companies will _____ with each other over the price before signing the new contract.",
    options: ["purchase", "recommend", "maintain", "negotiate"],
    answer: 3,
    kind: "vocabulary",
    explanation:
      "negotiate with someone over a price 表示「與某人協商價格」。此處 with each other over the price 需要能表示雙方協商的動詞；其餘選項不符合這個用法。",
  },
  {
    id: "q-perfect",
    prompt: "Ms. Lin _____ in the accounting department since 2021.",
    options: ["is working", "works", "has worked", "will work"],
    answer: 2,
    kind: "grammar",
    explanation:
      "since 2021 指出從過去開始、延續到現在的狀態，因此用現在完成式 has worked。主詞 Ms. Lin 為第三人稱單數，使用 has。",
  },
  {
    id: "q-passive",
    prompt:
      "All expense reports must _____ by the department manager before payment.",
    options: ["approve", "be approved", "approving", "have approved"],
    answer: 1,
    kind: "grammar",
    explanation:
      "報告是被核准的對象，需要被動語態。情態助動詞 must 後接 be + 過去分詞，因此選 be approved。",
  },
  {
    id: "q-relative",
    prompt:
      "The consultant _____ recommendations we followed helped us reduce costs.",
    options: ["who", "which", "whom", "whose"],
    answer: 3,
    kind: "grammar",
    explanation:
      "recommendations 與 consultant 有所有關係，意思是「那位顧問的建議」，因此用 whose + 名詞。",
  },
  {
    id: "q-conditional",
    prompt:
      "If the supplier _____ the order details today, we will arrange delivery for tomorrow.",
    options: ["confirms", "confirming", "confirm", "to confirm"],
    answer: 0,
    kind: "grammar",
    explanation:
      "這是未來可能發生的一般條件句，if 子句此處用現在簡單式。主詞 the supplier 是第三人稱單數，因此選 confirms；主要子句使用 will + 原形動詞 arrange。",
  },
  {
    id: "q-gerund",
    prompt: "We look forward to _____ you at the annual conference.",
    options: ["meet", "be met", "meeting", "have met"],
    answer: 2,
    kind: "grammar",
    explanation:
      "look forward to 中的 to 是介系詞，後面接名詞或動名詞，因此使用 meeting。",
  },
  {
    id: "q-conjunction",
    prompt: "_____ the heavy rain, all scheduled deliveries arrived on time.",
    options: ["Although", "Despite", "Because", "Unless"],
    answer: 1,
    kind: "grammar",
    explanation:
      "空格後是名詞片語 the heavy rain，句意為「儘管大雨，仍準時送達」，因此選介系詞 despite。此處 although、because、unless 都無法直接接這個名詞片語。",
  },
  {
    id: "q-adverb",
    prompt: "Please review the contract _____ before you sign it.",
    options: ["care", "careful", "carefulness", "carefully"],
    answer: 3,
    kind: "grammar",
    explanation:
      "空格修飾動詞 review（審閱），需要副詞 carefully（仔細地）。careful 是形容詞，通常用來修飾名詞。",
  },
  {
    id: "q-infinitive",
    prompt:
      "The management team has decided _____ the office renovation until next month.",
    options: ["to postpone", "postponing", "postponed", "postpone"],
    answer: 0,
    kind: "grammar",
    explanation:
      "decide 後接 to + 原形動詞，表示「決定做某事」，因此選 to postpone（延後）。",
  },
  {
    id: "q-agenda",
    prompt:
      "The first item on today’s meeting _____ is the new training schedule.",
    options: ["baggage", "receipt", "agenda", "fare"],
    answer: 2,
    kind: "vocabulary",
    explanation:
      "agenda 是「議程」；an item on the agenda 表示「議程上的一個項目」。此處說明會議首先要討論的新訓練時程。",
  },
  {
    id: "q-confidential",
    prompt:
      "Please keep these salary records _____ and do not share them outside the HR department.",
    options: ["confidential", "refundable", "approximately", "competitive"],
    answer: 0,
    kind: "vocabulary",
    explanation:
      "薪資紀錄不得向人資部門以外的人透露，因此應保持 confidential（機密的）。keep + 受詞 + 形容詞，表示讓受詞保持某種狀態。",
  },
  {
    id: "q-orientation",
    prompt:
      "During the _____ session, new staff will learn about company policies and meet their supervisors.",
    options: ["cancellation", "transaction", "departure", "orientation"],
    answer: 3,
    kind: "vocabulary",
    explanation:
      "orientation session 是「新進人員訓練課程」，內容通常包含公司政策介紹與認識主管。",
  },
  {
    id: "q-delegate",
    prompt:
      "To manage her workload, Ms. Park will _____ some routine tasks to her assistants.",
    options: ["confirm", "delegate", "participate", "purchase"],
    answer: 1,
    kind: "vocabulary",
    explanation:
      "delegate tasks to someone 是「將任務委派給某人」。為了妥善處理工作量，朴女士將部分例行工作交給助理。",
  },
  {
    id: "q-refundable",
    prompt:
      "The deposit is fully _____ if the room is left clean and undamaged.",
    options: ["accessible", "efficient", "refundable", "essential"],
    answer: 2,
    kind: "vocabulary",
    explanation:
      "refundable 表示「可退還的」。若房間保持清潔且沒有損壞，押金就可全額退還。",
  },
  {
    id: "q-shuttle",
    prompt:
      "Guests can take the hotel’s free _____ to the airport instead of paying for a taxi.",
    options: ["inventory", "proposal", "appliance", "shuttle"],
    answer: 3,
    kind: "vocabulary",
    explanation:
      "shuttle 是往返固定地點的「接駁車」。題目指出可用它前往機場，作為計程車的替代選擇。",
  },
  {
    id: "q-surcharge",
    prompt:
      "An additional fuel _____ of $15 will be added to each airline ticket.",
    options: ["surcharge", "budget", "promotion", "performance"],
    answer: 0,
    kind: "vocabulary",
    explanation: "fuel surcharge 是「燃油附加費」，指基本票價以外加收的費用。",
  },
  {
    id: "q-inventory",
    prompt:
      "The store checks its _____ every week to avoid running out of popular items.",
    options: ["itinerary", "inventory", "appointment", "subscription"],
    answer: 1,
    kind: "vocabulary",
    explanation:
      "inventory 指「庫存」。定期檢查庫存，可以避免熱門商品缺貨（run out of）。",
  },
  {
    id: "q-profit",
    prompt:
      "After subtracting all operating costs, the shop made a _____ of $8,000 last month.",
    options: ["fare", "requirement", "profit", "procedure"],
    answer: 2,
    kind: "vocabulary",
    explanation:
      "profit 是扣除成本後的「利潤」；revenue 則是尚未扣除成本的營收。題目明確寫出已扣除所有營運成本。",
  },
  {
    id: "q-eligible",
    prompt:
      "Only members who have paid their annual fee are _____ for the special discount.",
    options: ["eligible", "considerable", "confidential", "approximately"],
    answer: 0,
    kind: "vocabulary",
    explanation:
      "be eligible for 表示「符合……的資格」。只有已繳年費的會員符合享有特別折扣的資格。",
  },
  {
    id: "q-notify",
    prompt:
      "Please _____ the customer service team immediately if your delivery address changes.",
    options: ["negotiate", "recruit", "accomplish", "notify"],
    answer: 3,
    kind: "vocabulary",
    explanation:
      "notify 是「通知」，可直接接受詞，notify the team 表示「通知團隊」。地址變動時需要立刻告知客服。",
  },
  {
    id: "q-receipt",
    prompt:
      "You must present the original _____ to receive a refund for your purchase.",
    options: ["agenda", "receipt", "vacancy", "colleague"],
    answer: 1,
    kind: "vocabulary",
    explanation:
      "receipt 是付款後取得的「收據」。申請購物退款時，通常須出示原始收據作為購買證明。",
  },
  {
    id: "q-adjective",
    prompt: "The sales team gave a very _____ presentation to the new client.",
    options: ["impress", "impressively", "impressive", "impression"],
    answer: 2,
    kind: "grammar",
    explanation:
      "空格位於副詞 very 與名詞 presentation 之間，需要形容詞 impressive（令人印象深刻的）來修飾名詞。",
  },
  {
    id: "q-agreement-list",
    prompt:
      "The list of updated safety procedures _____ available at the reception desk.",
    options: ["is", "are", "have", "be"],
    answer: 0,
    kind: "grammar",
    explanation:
      "真正的主詞是單數 The list；of updated safety procedures 是修飾語，不決定動詞單複數，因此選 is。",
  },
  {
    id: "q-agreement-each",
    prompt: "Each of the conference rooms _____ a projector and a whiteboard.",
    options: ["have", "are having", "having", "has"],
    answer: 3,
    kind: "grammar",
    explanation:
      "Each of + 複數名詞的主詞是 each，搭配單數動詞 has。意思是每間會議室都有投影機和白板。",
  },
  {
    id: "q-comparative",
    prompt:
      "The new printer is considerably _____ than the model we used before.",
    options: ["fast", "faster", "fastest", "most fast"],
    answer: 1,
    kind: "grammar",
    explanation:
      "than 顯示正在比較兩款印表機，需使用比較級 faster。considerably 可加強比較級，表示「快得多」。",
  },
  {
    id: "q-superlative",
    prompt:
      "This proposal offers by far the _____ solution among the five we received.",
    options: ["practical", "more practical", "most practical", "practically"],
    answer: 2,
    kind: "grammar",
    explanation:
      "by far the + 最高級可表示「遠比其他的更……」，among the five 也明確指出比較群體，因此選 most practical（最實用的）。一般形容詞 practical 無法構成本題的 by far the + 最高級結構。",
  },
  {
    id: "q-participle-passive",
    prompt: "Please place the _____ application form in the envelope provided.",
    options: ["completes", "completing", "completion", "completed"],
    answer: 3,
    kind: "grammar",
    explanation:
      "申請表是「被填寫完成」的，使用過去分詞 completed 修飾 application form，意思是「已填妥的申請表」。",
  },
  {
    id: "q-participle-active",
    prompt: "Visitors _____ the factory must wear safety helmets at all times.",
    options: ["touring", "toured", "are touring", "tour"],
    answer: 0,
    kind: "grammar",
    explanation:
      "主要動詞是 must wear，空格部分修飾 Visitors。訪客主動「參觀」工廠，因此用 touring，相當於 who are touring。",
  },
  {
    id: "q-uncountable",
    prompt: "Could you give me some _____ about the training program?",
    options: [
      "informations",
      "information",
      "an information",
      "many information",
    ],
    answer: 1,
    kind: "grammar",
    explanation:
      "information 是不可數名詞，不加 -s，也不搭配 an 或 many。some information 表示「一些資訊」。",
  },
  {
    id: "q-quantifier",
    prompt:
      "We have only _____ chairs left, so we may need to rent more for the event.",
    options: ["a little", "much", "a few", "an"],
    answer: 2,
    kind: "grammar",
    explanation:
      "chairs 是複數可數名詞，使用 a few（幾張）。a little 與 much 用於不可數名詞；an 不能修飾複數 chairs。",
  },
  {
    id: "q-time-on",
    prompt:
      "The product demonstration will take place _____ Wednesday afternoon.",
    options: ["at", "in", "into", "on"],
    answer: 3,
    kind: "grammar",
    explanation:
      "表示活動發生於特定星期的上午、下午或晚上，使用 on。單說「在下午」常用 in the afternoon，但指定 Wednesday afternoon 時用 on Wednesday afternoon。",
  },
  {
    id: "q-time-by",
    prompt: "Please send your registration form _____ Friday at the latest.",
    options: ["by", "until", "during", "since"],
    answer: 0,
    kind: "grammar",
    explanation:
      "by Friday 表示「不晚於星期五」，包含星期五這個截止日期，與 at the latest 呼應。until 表示動作或狀態持續到某時，不適合此處一次性的繳交動作。",
  },
  {
    id: "q-preposition-gerund",
    prompt: "Employees can improve their skills by _____ in monthly workshops.",
    options: ["participate", "participating", "participated", "participates"],
    answer: 1,
    kind: "grammar",
    explanation:
      "by 是介系詞，後面接動名詞 participating。participate in 表示「參與」，全句意思是員工能透過參加每月工作坊增進技能。",
  },
];
