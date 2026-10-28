# 文法與測驗內容複查

本次以逐項編輯複查方式檢查全部 **12 篇文法與 40 題測驗**，包括規則、結構、兩組雙語例句、提醒，以及每題四個選項、答案與解析。這是英文教學內容的編輯複查，並未聲稱已查核外部詞典、官方多益題庫或取得官方認證。

修正記錄保留既有 ID，供主資料套用；不更動學習者已完成的課程或錯題 ID。

整合結果：所有修訂已直接套用至 `src/data.ts`，保留原有 ID、答案索引與題型。

## 文法逐項記錄

| ID                        | 複查結果與處理                                                                                                                                     |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| present-perfect           | 保留。經驗、結果與持續狀態的說明合理；for/since、兩例及過去簡單式對照正確，時間訊號使用「可留意」「通常」，未宣稱絕對規則。                        |
| passive-voice             | 修正例句翻譯：by Friday 改成「最遲於星期五」，避免把截止日排除。modal + be + p.p.、進行式被動均正確。                                              |
| relative-clauses          | 補充 that 用於限定關係子句，不能引導逗號後的非限定子句；whose 後須接名詞。拆開 whose 結構，並限定關代省略規則的適用範圍。兩例與翻譯保留。          |
| conditionals              | 結構原本只列第一類，現在補上第二類；說明 would/could/might。補充 if 後的 will 仍可能表示意願或禮貌請求，避免「永遠不能用」的誤學。兩例均正確。     |
| gerunds-infinitives       | 保留。avoid/consider + V-ing、decide/plan + to V 與 look forward to + V-ing 正確；介系詞後使用 V-ing 已有「通常」限定。                            |
| conjunctions-prepositions | 完整子句規則加上適用範圍，提醒 although tired/although working 等簡化形式存在，避免把教學捷徑當絕對規則。兩例正確。                                |
| adjectives-adverbs        | 保留。修飾目標、連綴動詞、兩個例句，以及 friendly/fast 的提醒正確。                                                                                |
| subject-verb-agreement    | every 本身不是可單獨作主詞的代名詞，改成「every + 單數名詞」；each/everyone 與兩個例句均正確。                                                     |
| comparatives-superlatives | 保留。「通常」限定了比較級/最高級的基本模式；兩例、much/far/considerably、as ... as 與避免 more faster 均正確。                                    |
| participles               | 修正「人/物」過度簡化：人也可引起感受而用 -ing；-ed 可描述其他感受者。結構補上第一例使用的名詞後分詞片語。by Friday 翻譯同步改成「最遲於星期五」。 |
| countable-uncountable     | 分清 a/an 配單數可數名詞，many/a few 配複數，避免並列寫法讓人誤以為可互換。四個不可數名詞、兩例、單位詞與 few/little 語氣正確。                    |
| time-prepositions         | by 明確改為「不晚於指定時間」，包含截止邊界；與 until 的對比及例句正確。at/on/in 說明已有「常用」範圍。                                            |

## 測驗逐題記錄

以下「保留」表示逐一讀過題幹、四個選項與解析，在題目提供的語境下有一個合理答案；不是僅以陣列索引通過程式檢查。

| 題目 ID              | 結果與理由                                                                                                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| q-deadline           | 保留；meet the deadline，其他名詞不符合繳交期限語境。                                                                                                                                    |
| q-complimentary      | 保留；at no additional charge 明確指免費，搭配與 complementary 辨析正確。                                                                                                                |
| q-reimburse          | 保留；reimburse someone for expenses，其他動詞不符合此結構與目的。                                                                                                                       |
| q-efficient          | 保留；處理時間減半對應 efficient，其餘形容詞無法解釋效率提升。                                                                                                                           |
| q-itinerary          | 保留；列旅程停靠點的文件是 itinerary，其他名詞不是行程表。                                                                                                                               |
| q-revenue            | 保留；annual revenue 與銷售成長一致。                                                                                                                                                    |
| q-supplier           | 保留；提供食材的是 supplier。                                                                                                                                                            |
| q-negotiate          | 改寫題幹；原來 recommend the terms 也可構成有意義的動詞受詞搭配。以 negotiate with each other over the price 的結構排除其他選項；同步修正解析。                                          |
| q-perfect            | 保留；since 2021 延續至今，選項中只有 has worked 符合。                                                                                                                                  |
| q-passive            | 保留；reports 是核准對象，must be approved 唯一合適。                                                                                                                                    |
| q-relative           | 保留；whose recommendations 有所有關係，其他關代不可直接修飾該名詞。                                                                                                                     |
| q-conditional        | 改寫題幹與干擾選項；原本 if you placed ... 可理解為已發生的條件，if you will place ... 也可能是禮貌請求。新版 supplier confirms 明確要求第三人稱單數限定動詞，避免用可成立的用法當錯答。 |
| q-gerund             | 保留；look forward to 的 to 為介系詞，meeting 正確。                                                                                                                                     |
| q-conjunction        | 保留答案，修正解析；不再宣稱 although 在所有情況下均須接完整子句，只指出其他選項不能直接接本題名詞片語。                                                                                 |
| q-adverb             | 保留；carefully 修飾 review，其他詞性不可替代。                                                                                                                                          |
| q-infinitive         | 保留；decide to postpone 為正確補語形式。                                                                                                                                                |
| q-agenda             | 保留；會議的討論項目屬 agenda。                                                                                                                                                          |
| q-confidential       | 保留；禁止對外分享明確對應 confidential，approximately 詞性亦不符。                                                                                                                      |
| q-orientation        | 保留；新進人員認識政策與主管是 orientation session。                                                                                                                                     |
| q-delegate           | 保留；delegate tasks to assistants 結構與工作分派語意一致。                                                                                                                              |
| q-refundable         | 保留；deposit fully refundable 表示符合條件可全額退還。                                                                                                                                  |
| q-shuttle            | 保留；機場接駁服務與 taxi 替代語境清楚。                                                                                                                                                 |
| q-surcharge          | 保留；fuel surcharge 是額外燃油費。                                                                                                                                                      |
| q-inventory          | 保留；檢查庫存以免商品缺貨。                                                                                                                                                             |
| q-profit             | 保留；扣除成本後的金額為 profit，解析與 revenue 區分正確。                                                                                                                               |
| q-eligible           | 保留；be eligible for a discount 結構與資格條件一致。                                                                                                                                    |
| q-notify             | 保留；地址變動應 notify 客服，其他動詞不合情境。                                                                                                                                         |
| q-receipt            | 保留；退款所需購買證明為 receipt。                                                                                                                                                       |
| q-adjective          | 保留；very impressive presentation，其他詞性不能填入。                                                                                                                                   |
| q-agreement-list     | 保留；主詞 list 為單數，is available。                                                                                                                                                   |
| q-agreement-each     | 保留；each of the rooms has，只有 has 是合適限定動詞。                                                                                                                                   |
| q-comparative        | 保留；considerably faster than，其餘選項不構成正確比較。                                                                                                                                 |
| q-superlative        | 改寫題幹；原本 the practical solution 在正常語境也能成立，不宜當絕對錯答。加入 by far the ... among the five，使 most practical 為唯一成立的比較結構。                                   |
| q-participle-passive | 保留；completed application form 表示填妥的申請表。                                                                                                                                      |
| q-participle-active  | 保留；Visitors touring ... must wear，touring 修飾訪客，不能另插限定動詞。                                                                                                               |
| q-uncountable        | 保留；some information，其他形式不符合不可數名詞用法。                                                                                                                                   |
| q-quantifier         | 保留；a few chairs，其他數量詞或冠詞不能接複數 chairs。                                                                                                                                  |
| q-time-on            | 修正選項；原本 will take place by Wednesday afternoon 也正確，僅表示不晚於該時間。將 by 干擾項換成 into，保留 on 為唯一合適答案。                                                        |
| q-time-by            | 保留答案，修正解析；by Friday 應包含星期五，不是必須星期五以前完成。                                                                                                                     |
| q-preposition-gerund | 保留；by participating in 是正確介系詞加動名詞形式。                                                                                                                                     |

## 範圍與後續

- 全部既有 12 篇與 40 題均已逐項閱讀；8 篇課程、6 題有內容或表述修正。
- 所有題目 ID、正確答案索引與題型維持不變；4 題題幹或選項調整以排除歧義，另 2 題只修正解析。
- 這份審查不涵蓋新增單字的逐字編輯，那部分另有單字複查記錄。
- 程式化結構檢查只能確認欄位、索引與對應關係，不能取代以上語言判斷。
