import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechSettings = {
  voiceURI: string;
  accent: "en-US" | "en-GB" | "en-AU";
  rate: number;
};

export const SPEECH_STORAGE_KEY = "daylight-speech-settings-v1";
export const DEFAULT_SPEECH_SETTINGS: SpeechSettings = {
  voiceURI: "",
  accent: "en-US",
  rate: 0.95,
};

export function parseSpeechSettings(value: unknown): SpeechSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...DEFAULT_SPEECH_SETTINGS };
  }
  const item = value as Record<string, unknown>;
  return {
    voiceURI:
      typeof item.voiceURI === "string" && item.voiceURI.length <= 1000
        ? item.voiceURI
        : "",
    accent:
      item.accent === "en-GB" || item.accent === "en-AU"
        ? item.accent
        : "en-US",
    rate:
      typeof item.rate === "number" &&
      Number.isFinite(item.rate) &&
      item.rate >= 0.6 &&
      item.rate <= 1.2
        ? Math.round(item.rate * 100) / 100
        : DEFAULT_SPEECH_SETTINGS.rate,
  };
}

function loadSettings(): SpeechSettings {
  try {
    return parseSpeechSettings(
      JSON.parse(localStorage.getItem(SPEECH_STORAGE_KEY) || "null"),
    );
  } catch {
    return { ...DEFAULT_SPEECH_SETTINGS };
  }
}

/** Voice identities persist across list reorderings, unlike array positions. */
export function voiceKey(voice: SpeechSynthesisVoice): string {
  return voice.voiceURI || `${voice.name}::${voice.lang}`;
}

export function getEnglishVoices(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice[] {
  const unique = new Map<string, SpeechSynthesisVoice>();
  for (const voice of voices) {
    if (/^en(?:[-_]|$)/i.test(voice.lang)) unique.set(voiceKey(voice), voice);
  }
  return [...unique.values()].sort(
    (a, b) =>
      a.name.localeCompare(b.name, "en") ||
      a.lang.localeCompare(b.lang, "en") ||
      voiceKey(a).localeCompare(voiceKey(b), "en"),
  );
}

/** Names are helpful hints, not a guarantee of a particular speech technology. */
export function chooseEnglishVoice(
  voices: SpeechSynthesisVoice[],
  settings: SpeechSettings,
): SpeechSynthesisVoice | null {
  const english = getEnglishVoices(voices);
  const requested = english.find(
    (voice) => voiceKey(voice) === settings.voiceURI,
  );
  if (requested) return requested;
  const accent = settings.accent.toLowerCase();
  const score = (voice: SpeechSynthesisVoice) => {
    const language = voice.lang.replaceAll("_", "-").toLowerCase();
    return (
      (language === accent || language.startsWith(`${accent}-`) ? 1000 : 0) +
      (/natural|enhanced|premium|neural/i.test(voice.name) ? 100 : 0) +
      (/google|microsoft/i.test(voice.name) ? 30 : 0) +
      (voice.default ? 20 : 0) +
      (voice.localService ? 5 : 0)
    );
  };
  return english.reduce<SpeechSynthesisVoice | null>(
    (best, voice) => (!best || score(voice) > score(best) ? voice : best),
    null,
  );
}

function sameVoices(a: SpeechSynthesisVoice[], b: SpeechSynthesisVoice[]) {
  return (
    a.length === b.length &&
    a.every(
      (voice, index) =>
        voiceKey(voice) === voiceKey(b[index]) &&
        voice.name === b[index].name &&
        voice.lang === b[index].lang &&
        voice.localService === b[index].localService &&
        voice.default === b[index].default,
    )
  );
}

export function useSpeech(notify: (message: string) => void) {
  const supported =
    typeof window !== "undefined" &&
    !!window.speechSynthesis &&
    typeof window.SpeechSynthesisUtterance === "function";
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<SpeechSettings>(loadSettings);
  const [voicesLoading, setVoicesLoading] = useState(supported);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [preferencesSaved, setPreferencesSaved] = useState(true);
  const notifyRef = useRef(notify);
  const settingsRef = useRef(settings);
  const requestId = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef<string | null>(null);
  const mounted = useRef(false);
  const storageWarning = useRef(false);
  notifyRef.current = notify;
  settingsRef.current = settings;

  const stop = useCallback(() => {
    requestId.current += 1;
    utteranceRef.current = null;
    textRef.current = null;
    setSpeakingText(null);
    if (supported) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Cancellation should not prevent navigation or changing preferences.
      }
    }
  }, [supported]);

  const refreshVoices = useCallback(() => {
    if (!supported) return [] as SpeechSynthesisVoice[];
    try {
      const list = getEnglishVoices(window.speechSynthesis.getVoices());
      if (mounted.current) {
        setVoices((previous) => (sameVoices(previous, list) ? previous : list));
        if (list.length) setVoicesLoading(false);
      }
      return list;
    } catch {
      return [] as SpeechSynthesisVoice[];
    }
  }, [supported]);

  useEffect(() => {
    mounted.current = true;
    if (!supported)
      return () => {
        mounted.current = false;
      };
    refreshVoices();
    const synthesis = window.speechSynthesis;
    const changed = () => {
      refreshVoices();
    };
    synthesis.addEventListener("voiceschanged", changed);
    // Some engines return an empty list initially without firing voiceschanged.
    const timers = [200, 700, 1500].map((delay) =>
      window.setTimeout(refreshVoices, delay),
    );
    timers.push(
      window.setTimeout(() => {
        refreshVoices();
        setVoicesLoading(false);
      }, 3000),
    );
    const visibilityChanged = () => {
      if (document.visibilityState === "hidden") stop();
    };
    document.addEventListener("visibilitychange", visibilityChanged);
    return () => {
      mounted.current = false;
      timers.forEach((timer) => window.clearTimeout(timer));
      synthesis.removeEventListener("voiceschanged", changed);
      document.removeEventListener("visibilitychange", visibilityChanged);
      requestId.current += 1;
      utteranceRef.current = null;
      textRef.current = null;
      try {
        synthesis.cancel();
      } catch {
        /* Engine may already be gone. */
      }
    };
  }, [supported, refreshVoices, stop]);

  useEffect(() => {
    try {
      localStorage.setItem(SPEECH_STORAGE_KEY, JSON.stringify(settings));
      setPreferencesSaved(true);
      storageWarning.current = false;
    } catch {
      setPreferencesSaved(false);
      if (!storageWarning.current) {
        notifyRef.current("語音設定已套用，但瀏覽器暫時無法儲存偏好。");
        storageWarning.current = true;
      }
    }
  }, [settings]);

  const updateSettings = useCallback(
    (patch: Partial<SpeechSettings>) => {
      stop();
      setSettings((previous) => parseSpeechSettings({ ...previous, ...patch }));
    },
    [stop],
  );

  const speak = useCallback(
    (text: string) => {
      const cleaned = text.trim();
      if (!cleaned) return;
      if (!supported) {
        notifyRef.current(
          "此瀏覽器不支援語音朗讀，請改用支援文字轉語音的瀏覽器。",
        );
        return;
      }
      if (textRef.current === cleaned && utteranceRef.current) {
        stop();
        return;
      }
      const available = refreshVoices();
      const voice = chooseEnglishVoice(available, settingsRef.current);
      if (!voice) {
        notifyRef.current(
          "目前找不到英文聲音，請稍後再試，或在裝置的文字轉語音設定安裝英文語音。",
        );
        return;
      }
      stop();
      const currentRequest = ++requestId.current;
      try {
        const utterance = new window.SpeechSynthesisUtterance(cleaned);
        utterance.voice = voice;
        utterance.lang = voice.lang.replaceAll("_", "-");
        utterance.rate = settingsRef.current.rate;
        utterance.pitch = 1;
        utterance.volume = 1;
        const finish = () => {
          if (requestId.current !== currentRequest || !mounted.current)
            return false;
          utteranceRef.current = null;
          textRef.current = null;
          setSpeakingText(null);
          return true;
        };
        utterance.onend = finish;
        utterance.onerror = (event) => {
          if (
            !finish() ||
            event.error === "canceled" ||
            event.error === "interrupted"
          )
            return;
          notifyRef.current(
            event.error === "not-allowed"
              ? "瀏覽器未允許播放，請再點一次朗讀按鈕，或確認網站的聲音權限。"
              : "目前無法播放這個聲音，請在語音設定試選其他英文聲音，並確認網路與裝置音量。",
          );
        };
        utteranceRef.current = utterance;
        textRef.current = cleaned;
        setSpeakingText(cleaned);
        window.speechSynthesis.speak(utterance);
      } catch {
        if (requestId.current === currentRequest) {
          utteranceRef.current = null;
          textRef.current = null;
          setSpeakingText(null);
        }
        notifyRef.current("目前無法播放語音，請在語音設定選擇其他英文聲音。");
      }
    },
    [supported, refreshVoices, stop],
  );

  return {
    supported,
    voices,
    settings,
    updateSettings,
    speak,
    stop,
    speakingText,
    voicesLoading,
    selectedVoice: chooseEnglishVoice(voices, settings),
    preferencesSaved,
  };
}
