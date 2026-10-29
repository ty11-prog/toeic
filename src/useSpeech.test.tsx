import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSpeech, SPEECH_STORAGE_KEY } from "./useSpeech";

const voice = (
  name: string,
  lang: string,
  voiceURI: string,
  isDefault = false,
): SpeechSynthesisVoice => ({
  name,
  lang,
  voiceURI,
  default: isDefault,
  localService: !name.includes("Online"),
});
const standardVoice = voice("System English", "en-US", "english-system", true);
const naturalVoice = voice(
  "Microsoft Aria Online (Natural)",
  "en-US",
  "english-natural",
);
const britishVoice = voice("Daniel", "en-GB", "english-british");
const chineseVoice = voice("Mei-Jia", "zh-TW", "chinese-system");

class MockUtterance {
  text: string;
  lang = "";
  rate = 1;
  pitch = 1;
  volume = 1;
  voice: SpeechSynthesisVoice | null = null;
  onstart: ((event: SpeechSynthesisEvent) => unknown) | null = null;
  onend: ((event: SpeechSynthesisEvent) => unknown) | null = null;
  onerror: ((event: SpeechSynthesisErrorEvent) => unknown) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

function mockSpeech(
  initialVoices: SpeechSynthesisVoice[] = [
    standardVoice,
    naturalVoice,
    britishVoice,
    chineseVoice,
  ],
) {
  let available = initialVoices;
  const events = new EventTarget();
  const synth = {
    getVoices: vi.fn(() => available),
    speak: vi.fn((_utterance: SpeechSynthesisUtterance) => {}),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    addEventListener: vi.fn(events.addEventListener.bind(events)),
    removeEventListener: vi.fn(events.removeEventListener.bind(events)),
  };
  vi.stubGlobal("speechSynthesis", synth);
  vi.stubGlobal("SpeechSynthesisUtterance", MockUtterance);
  return {
    synth,
    setVoices: (voices: SpeechSynthesisVoice[]) => {
      available = voices;
      events.dispatchEvent(new Event("voiceschanged"));
    },
    latest: () => synth.speak.mock.calls.at(-1)![0],
  };
}

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("English speech playback", () => {
  it("recommends an available natural English voice and uses full text at a normal learning rate", () => {
    const mock = mockSpeech();
    const { result } = renderHook(() => useSpeech(vi.fn()));
    expect(result.current.supported).toBe(true);
    expect(result.current.voices).not.toContain(chineseVoice);
    act(() => result.current.speak("A little practice makes a difference."));
    expect(mock.synth.speak).toHaveBeenCalledTimes(1);
    expect(mock.latest()).toMatchObject({
      text: "A little practice makes a difference.",
      lang: "en-US",
      rate: 0.95,
      voice: naturalVoice,
    });
  });

  it("persists explicit voice URI and rate and applies the selected voice's actual language", () => {
    const mock = mockSpeech();
    const view = renderHook(() => useSpeech(vi.fn()));
    act(() =>
      view.result.current.updateSettings({
        voiceURI: britishVoice.voiceURI,
        accent: "en-US",
        rate: 0.75,
      }),
    );
    expect(JSON.parse(localStorage.getItem(SPEECH_STORAGE_KEY)!)).toMatchObject(
      { voiceURI: britishVoice.voiceURI, rate: 0.75 },
    );
    act(() => view.result.current.speak("Please submit the form by Friday."));
    expect(mock.latest()).toMatchObject({
      lang: "en-GB",
      voice: britishVoice,
      rate: 0.75,
    });
    view.unmount();
    const nextView = renderHook(() => useSpeech(vi.fn()));
    expect(nextView.result.current.settings).toMatchObject({
      voiceURI: britishVoice.voiceURI,
      rate: 0.75,
    });
    act(() => mock.setVoices([britishVoice, standardVoice, naturalVoice]));
    act(() => nextView.result.current.speak("Your reservation is confirmed."));
    expect(mock.latest().voice).toBe(britishVoice);
  });

  it("updates an asynchronously loaded voice list and falls back when a saved voice disappears", () => {
    localStorage.setItem(
      SPEECH_STORAGE_KEY,
      JSON.stringify({
        voiceURI: "missing-device-voice",
        accent: "en-GB",
        rate: 1,
      }),
    );
    const mock = mockSpeech([]);
    const { result } = renderHook(() => useSpeech(vi.fn()));
    expect(result.current.voices).toEqual([]);
    act(() => mock.setVoices([chineseVoice, standardVoice, britishVoice]));
    expect(result.current.voices).toHaveLength(2);
    act(() => result.current.speak("The train departs from platform two."));
    expect(mock.latest()).toMatchObject({ voice: britishVoice, lang: "en-GB" });
  });

  it("stops repeated playback and ignores callbacks from an interrupted utterance", () => {
    const mock = mockSpeech();
    const notify = vi.fn();
    const { result } = renderHook(() => useSpeech(notify));
    act(() => result.current.speak("First sentence."));
    const first = mock.latest();
    act(() => result.current.speak("Second sentence."));
    expect(mock.synth.cancel).toHaveBeenCalled();
    act(() => {
      first.onend?.(new Event("end") as SpeechSynthesisEvent);
      first.onerror?.({ error: "interrupted" } as SpeechSynthesisErrorEvent);
    });
    expect(result.current.speakingText).toBe("Second sentence.");
    expect(notify).not.toHaveBeenCalled();
    act(() => result.current.speak("Second sentence."));
    expect(mock.synth.speak).toHaveBeenCalledTimes(2);
    expect(result.current.speakingText).toBeNull();
  });

  it("reports a real synthesis error and resets playback state", () => {
    const mock = mockSpeech();
    const notify = vi.fn();
    const { result } = renderHook(() => useSpeech(notify));
    act(() => result.current.speak("Please try again."));
    act(() =>
      mock
        .latest()
        .onerror?.({ error: "network" } as SpeechSynthesisErrorEvent),
    );
    expect(result.current.speakingText).toBeNull();
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("does not send English text to a Chinese-only voice list and gives a helpful message", () => {
    vi.useFakeTimers();
    const mock = mockSpeech([chineseVoice]);
    const notify = vi.fn();
    const { result } = renderHook(() => useSpeech(notify));
    act(() => vi.runAllTimers());
    act(() => result.current.speak("This should not use a Chinese voice."));
    expect(mock.synth.speak).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalled();
    expect(result.current.speakingText).toBeNull();
  });

  it("handles unavailable browser speech without throwing and cancels speech on unmount", () => {
    vi.stubGlobal("speechSynthesis", undefined);
    vi.stubGlobal("SpeechSynthesisUtterance", undefined);
    const notify = vi.fn();
    const unsupported = renderHook(() => useSpeech(notify));
    expect(unsupported.result.current.supported).toBe(false);
    act(() => unsupported.result.current.speak("Hello."));
    expect(notify).toHaveBeenCalled();
    unsupported.unmount();
    const mock = mockSpeech();
    const supported = renderHook(() => useSpeech(vi.fn()));
    act(() => supported.result.current.speak("An active sentence."));
    mock.synth.cancel.mockClear();
    supported.unmount();
    expect(mock.synth.cancel).toHaveBeenCalled();
    expect(mock.synth.removeEventListener).toHaveBeenCalledWith(
      "voiceschanged",
      expect.any(Function),
    );
  });

  it("rejects malformed persisted preferences rather than passing invalid values to speech", () => {
    localStorage.setItem(
      SPEECH_STORAGE_KEY,
      JSON.stringify({ voiceURI: 42, accent: "zh-TW", rate: 9 }),
    );
    const mock = mockSpeech();
    const { result } = renderHook(() => useSpeech(vi.fn()));
    expect(result.current.settings).toEqual({
      voiceURI: "",
      accent: "en-US",
      rate: 0.95,
    });
    act(() => result.current.speak("Your settings are ready."));
    expect(mock.latest()).toMatchObject({ lang: "en-US", rate: 0.95 });
  });

  it("interrupts active speech when preferences change and uses the new rate on the next request", () => {
    const mock = mockSpeech();
    const { result } = renderHook(() => useSpeech(vi.fn()));
    act(() => result.current.speak("Listen at the original speed."));
    mock.synth.cancel.mockClear();
    act(() => result.current.updateSettings({ rate: 0.6 }));
    expect(mock.synth.cancel).toHaveBeenCalled();
    expect(result.current.speakingText).toBeNull();
    act(() => result.current.speak("Listen at a slower speed."));
    expect(mock.latest().rate).toBe(0.6);
  });

  it("handles synchronous engine failures without leaving the playback button stuck", () => {
    const mock = mockSpeech();
    mock.synth.speak.mockImplementation(() => {
      throw new Error("Speech engine unavailable");
    });
    const notify = vi.fn();
    const { result } = renderHook(() => useSpeech(notify));
    act(() => result.current.speak("Try another voice."));
    expect(result.current.speakingText).toBeNull();
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("keeps speech usable when saving preferences is blocked and warns once", () => {
    const mock = mockSpeech();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage unavailable", "QuotaExceededError");
    });
    const notify = vi.fn();
    const { result } = renderHook(() => useSpeech(notify));
    expect(result.current.preferencesSaved).toBe(false);
    act(() => result.current.updateSettings({ rate: 1.1 }));
    act(() => result.current.speak("These settings work for this visit."));
    expect(mock.latest().rate).toBe(1.1);
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("stops speech when the page becomes hidden and removes voice loading timers on unmount", () => {
    vi.useFakeTimers();
    const mock = mockSpeech();
    const { result, unmount } = renderHook(() => useSpeech(vi.fn()));
    act(() => result.current.speak("Pause when leaving this page."));
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    mock.synth.cancel.mockClear();
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(result.current.speakingText).toBeNull();
    expect(mock.synth.cancel).toHaveBeenCalled();
    unmount();
    const callsAfterUnmount = mock.synth.getVoices.mock.calls.length;
    act(() => vi.advanceTimersByTime(5000));
    expect(mock.synth.getVoices).toHaveBeenCalledTimes(callsAfterUnmount);
  });
});
