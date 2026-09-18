const PracticeEngine = {
  getMode(modeId) {
    if (modeId === "weak-words") {
      return { id: "weak-words", title: "Weak Word Practice", goal: "Retry words that caused mistakes.", bank: "common" };
    }
    return PRACTICE_MODES.find((mode) => mode.id === modeId) || PRACTICE_MODES[0];
  },

  getSelectedMode() {
    return this.getMode(Storage.getProgress().selectedMode);
  },

  getPrompt(modeId = Storage.getProgress().selectedMode) {
    const mode = this.getMode(modeId);
    const progress = Storage.getProgress();

    if (modeId === "weak-words") {
      return this.buildWeakWordPrompt(progress.weakWords);
    }

    const bank = TEXT_BANKS[mode.bank] || TEXT_BANKS.balanced;
    const base = bank[Math.floor(Math.random() * bank.length)];
    const smartText = ["diagnostic", "accuracy", "speed"].includes(mode.id)
      ? this.buildSmartText(progress.weakKeys)
      : "";

    return {
      modeId: mode.id,
      modeTitle: mode.title,
      goal: mode.goal,
      text: smartText ? `${base} ${smartText}` : base
    };
  },

  buildWeakWordPrompt(words) {
    const fallback = ["because", "different", "practice", "through", "accuracy", "rhythm"];
    const selected = words.length ? words : fallback;
    return {
      modeId: "weak-words",
      modeTitle: "Weak Word Practice",
      goal: "Retry words that previously caused mistakes.",
      text: [...selected, ...selected.slice(0, 6)].join(" ")
    };
  },

  buildSmartText(weakKeys) {
    const sorted = Object.entries(weakKeys)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([key]) => key.toLowerCase());
    const words = sorted.flatMap((key) => SMART_WORDS[key] || []);
    return words.length ? `Focused drill: ${words.slice(0, 10).join(" ")}.` : "";
  },

  getBestWpm() {
    const history = Storage.getProgress().history;
    return history.length ? Math.max(...history.map((item) => item.wpm)) : 0;
  },

  getBestAccuracy() {
    const history = Storage.getProgress().history;
    return history.length ? Math.max(...history.map((item) => item.accuracy)) : 0;
  },

  getRecommendation(lastResult = null) {
    const progress = Storage.getProgress();
    const latest = lastResult || progress.history[0];

    if (!latest) {
      return { modeId: "diagnostic", title: "Diagnostic Test", text: "Start with a diagnostic round so TypeTale can find your first weak pattern." };
    }
    if (latest.accuracy < 85) {
      return { modeId: "accuracy", title: "Accuracy Builder", text: "Your accuracy needs attention. Practice clean typing before pushing speed." };
    }
    if (latest.backspaces >= 10) {
      return { modeId: "accuracy", title: "Reduce Corrections", text: "You corrected often. Use accuracy practice to reduce backspace dependence." };
    }
    if (progress.weakWords.length >= 3) {
      return { modeId: "weak-words", title: "Weak Word Practice", text: "Several words have repeated mistakes. Drill those words directly before another full test." };
    }
    if (latest.consistency < 70) {
      return { modeId: "speed", title: "Rhythm Builder", text: "Your speed changed during the round. Use familiar words to smooth your pace." };
    }

    return { modeId: "speed", title: "Speed Builder", text: "Your typing is stable enough to safely push for more speed." };
  }
};

const StoryEngine = PracticeEngine;
