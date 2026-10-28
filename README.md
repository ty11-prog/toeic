# daylight. 英文學習手帖

每天一點，英文更近一點。參考 [拾語手帖](https://github.com/ty11-prog/japanese) 的自學流程，為目標 TOEIC 約 700 分的學習者打造繁體中文英文學習網站。

暖白、鼠尾草綠與淡杏色介面，搭配本機打包的中英文字型。支援桌面、平板與手機，免登入、免 API 金鑰。

## 開始開發

使用 Node.js 22.12+（已驗證 Node.js 24）與 npm：

```bash
git clone https://github.com/ty11-prog/toeic.git
cd toeic
npm ci
npm run dev
```

正式建置、測試與本機檢查：

```bash
npm test
npm run build
npm run preview
```

## 學習內容

- **320 個情境單字**：職場、旅行、商務與日常生活各 80 個，含美式音標、中文意思、英文定義、雙語例句與常見搭配。單字卡每批顯示 24 筆；搜尋與單字卡練習涵蓋全部符合篩選的單字。
- **12 篇文法主題**：完成式、被動語態、關係子句、條件句、動名詞、連接詞、詞性、主動詞一致、分詞、比較級、可數與不可數名詞，以及時間介系詞。
- **40 題附解析練習**：單字與文法各 20 題。每次隨機抽取最多 10 題，支援專項練習、錯題收錄與答對後移除。
- **單字卡**：先回想再揭示解答，自評是否記住；已掌握的新字與首次完成的文法才計入活動，避免重複點擊灌入進度。
- **收藏與學習足跡**：即時搜尋、分類、收藏、每日目標、連續學習、近七日活動與歷次測驗摘要。
- **進度備份**：匯出 JSON；匯入時檢查資料，先預覽並確認，再取代目前進度。

這是針對 TOEIC 約 700 分學習需求設計的原創教材，不是完整題庫或官方分數預測。「700 分目標詞彙」是本站的編輯選材標示，並非 ETS 官方逐字分級。測驗百分比表示本站練習的答對比例。

本輪已逐項複查全部 320 個單字、12 篇文法與 40 題測驗。新增單字經跨批次校對，修正了定義、搭配翻譯與可造成多解的題目；原有單字、課程與題目 ID 均保留。範圍與修訂理由見 [內容複查紀錄](docs/content-review.md)。語言編輯複查與自動化資料完整性測試分別進行，後者不代表外部詞典或官方認證。

## 本機資料與發音

學習進度儲存在目前網站的瀏覽器 `localStorage`，沒有帳號或雲端同步。清除網站資料、使用無痕模式、改用另一個瀏覽器或網站網址，都可能無法保留進度；請在「學習足跡」定期匯出備份。匯入備份會取代現有資料，建議先匯出目前的進度。

英文朗讀使用瀏覽器的 Web Speech API，實際聲音、可用性與是否需連線依裝置而異；無法播放時仍可閱讀音標及例句。網站未實作離線快取。

## 部署

`npm run build` 產生 `dist/`，可部署至一般靜態網站服務。資源使用相對路徑，支援 GitHub Pages 的 `/toeic/` 子路徑。

專案附有 `.github/workflows/deploy.yml`。將 GitHub 儲存庫的 **Settings → Pages → Source** 設成 **GitHub Actions** 後，每次推送至 `main` 都會自動測試、建置並部署；也可在 **Actions → Deploy daylight. to GitHub Pages → Run workflow** 手動發布。

預設發布網址為 `https://ty11-prog.github.io/toeic/`，實際部署結果請以 GitHub Actions 的成功紀錄及網址回應為準。

## 專案結構

```text
src/App.tsx                 頁面與學習互動
src/data.ts                 單字、文法與測驗資料
src/content/*-additions.ts   四類情境新增單字
src/progress.ts             本機進度讀取與日期工具
src/LearningJournal.tsx     學習統計與備份匯入匯出
src/styles.css              響應式介面
src/*.test.tsx              學習流程、分批載入及備份驗證測試
src/data.test.ts            教材完整性、既有 ID 與已知歧義回歸檢查
docs/content-review.md     語言內容複查紀錄索引
```
