import {
  Check,
  Headphones,
  Info,
  SlidersHorizontal,
  Square,
  Volume2,
} from "lucide-react";
import { voiceKey } from "./useSpeech";
import type { SpeechSettings, useSpeech } from "./useSpeech";
import "./speech.css";

const previewSentence =
  "A little practice every day can make a big difference.";
const accents: { value: SpeechSettings["accent"]; label: string }[] = [
  { value: "en-US", label: "美式英文 · English (US)" },
  { value: "en-GB", label: "英式英文 · English (UK)" },
  { value: "en-AU", label: "澳洲英文 · English (AU)" },
];

export default function SpeechSettingsPanel({
  speech,
}: {
  speech: ReturnType<typeof useSpeech>;
}) {
  const { settings, voices, supported, selectedVoice, voicesLoading } = speech;
  const missingSavedVoice =
    !!settings.voiceURI &&
    !voices.some((voice) => voiceKey(voice) === settings.voiceURI);
  const playing = speech.speakingText === previewSentence;
  return (
    <div className="speech-settings">
      <section className="speech-panel" aria-labelledby="speech-settings-title">
        <div className="speech-panel-heading">
          <span className="speech-setting-icon">
            <Headphones size={25} strokeWidth={1.6} />
          </span>
          <div>
            <span className="eyebrow">FIND YOUR ENGLISH VOICE</span>
            <h2 id="speech-settings-title">讓英文，聽起來更順耳。</h2>
            <p>挑一個喜歡的聲音，用舒服的速度，把單字和例句慢慢聽清楚。</p>
          </div>
        </div>
        {!supported && (
          <p className="speech-status warning" role="status">
            此瀏覽器不支援語音朗讀。你仍可閱讀全部教材；可改用其他支援語音的瀏覽器試聽。
          </p>
        )}
        <div className="speech-fields">
          <div className="speech-field">
            <label htmlFor="speech-accent">偏好口音</label>
            <select
              id="speech-accent"
              disabled={!supported}
              value={settings.accent}
              onChange={(event) =>
                speech.updateSettings({
                  accent: event.target.value as SpeechSettings["accent"],
                  voiceURI: "",
                })
              }
            >
              {accents.map((accent) => (
                <option key={accent.value} value={accent.value}>
                  {accent.label}
                </option>
              ))}
            </select>
            <p>
              自動選聲時優先採用這個口音；沒有對應聲音時會改用其他英文聲音。
            </p>
          </div>
          <div className="speech-field">
            <label htmlFor="speech-voice">英文聲音</label>
            <select
              id="speech-voice"
              disabled={!supported}
              value={settings.voiceURI}
              onChange={(event) =>
                speech.updateSettings({ voiceURI: event.target.value })
              }
            >
              <option value="">自動選擇（推薦）</option>
              {missingSavedVoice && (
                <option value={settings.voiceURI}>
                  先前選擇的聲音（此裝置暫未提供）
                </option>
              )}
              {voices.map((voice) => (
                <option key={voiceKey(voice)} value={voiceKey(voice)}>
                  {voice.name} · {voice.lang} ·{" "}
                  {voice.localService ? "裝置語音" : "可能需連線"}
                </option>
              ))}
            </select>
            <p>
              指定聲音後，以該聲音的實際口音朗讀。清單由目前裝置與瀏覽器提供。
            </p>
          </div>
        </div>
        {supported && voicesLoading && (
          <p className="speech-status" role="status">
            正在載入這台裝置的英文聲音…
          </p>
        )}
        {supported && !voicesLoading && !voices.length && (
          <p className="speech-status warning" role="status">
            尚未找到英文聲音。請在手機或電腦的文字轉語音設定下載英文語音，再重新開啟此頁。
          </p>
        )}
        {supported && missingSavedVoice && voices.length > 0 && (
          <p className="speech-status" role="status">
            原先選擇的聲音暫時不在此裝置上，已自動改用可用的英文聲音；偏好會保留。
          </p>
        )}
        <div className="speech-rate-heading">
          <label htmlFor="speech-rate">
            <SlidersHorizontal size={16} /> 朗讀速度
          </label>
          <output htmlFor="speech-rate">{settings.rate.toFixed(2)}×</output>
        </div>
        <input
          id="speech-rate"
          className="speech-rate-slider"
          type="range"
          min="0.6"
          max="1.2"
          step="0.01"
          value={settings.rate}
          disabled={!supported}
          onChange={(event) =>
            speech.updateSettings({ rate: Number(event.target.value) })
          }
        />
        <div className="speech-rate-labels">
          <span>0.60× 慢慢聽</span>
          <span>1.20× 流暢聽</span>
        </div>
        <div className="speech-rate-presets" aria-label="常用語速">
          {[
            { label: "慢速練習", rate: 0.75 },
            { label: "自然節奏", rate: 0.95 },
            { label: "標準速度", rate: 1 },
          ].map((preset) => (
            <button
              key={preset.rate}
              className={
                settings.rate === preset.rate
                  ? "speech-preset selected"
                  : "speech-preset"
              }
              aria-pressed={settings.rate === preset.rate}
              disabled={!supported}
              onClick={() => speech.updateSettings({ rate: preset.rate })}
            >
              {settings.rate === preset.rate && <Check size={13} />}
              {preset.label} <span>{preset.rate.toFixed(2)}×</span>
            </button>
          ))}
        </div>
        <div className="speech-preview">
          <span className="eyebrow">LISTEN & FEEL THE DIFFERENCE</span>
          <p lang="en">{previewSentence}</p>
          <span>每天練習一點，能帶來很大的改變。</span>
          <div className="speech-preview-bottom">
            <span className="speech-current-voice">
              <Volume2 size={15} />
              目前使用：
              {selectedVoice?.name ??
                (voicesLoading ? "聲音載入中" : "尚無可用英文聲音")}
            </span>
            <button
              className="button primary"
              disabled={!supported || !voices.length}
              onClick={() =>
                playing ? speech.stop() : speech.speak(previewSentence)
              }
            >
              {playing ? <Square size={15} /> : <Volume2 size={17} />}
              {playing ? "停止試聽" : "試聽例句"}
            </button>
          </div>
        </div>
        <p
          className={`speech-storage-note ${speech.preferencesSaved ? "" : "warning"}`}
          role={speech.preferencesSaved ? undefined : "status"}
        >
          {speech.preferencesSaved
            ? "聲音、口音與語速會自動保存在此瀏覽器，套用到所有單字與例句朗讀。"
            : "目前設定已套用，但瀏覽器無法儲存偏好；關閉頁面後可能需要重新設定。"}
        </p>
      </section>
      <section className="speech-help">
        <Info size={20} />
        <div>
          <h2>關於聲音的自然度</h2>
          <p>
            若裝置提供名稱含 Natural、Enhanced、Premium 或 Neural
            的英文聲音，可以優先試聽；自動選聲也會參考這些名稱。名稱只是提示，實際品質仍取決於裝置與瀏覽器。
          </p>
          <p>
            iPhone／iPad 可查看「設定 →
            輔助使用」中的語音朗讀與聲音選項；Android
            可查看「文字轉語音輸出」並安裝英文語音。系統下載的聲音是否出現在瀏覽器，仍依裝置支援而定。
          </p>
          <p>
            這裡使用裝置提供的合成語音，部分聲音需要網路連線。可用選項與品質會因手機、電腦及瀏覽器而異。
          </p>
        </div>
      </section>
    </div>
  );
}
