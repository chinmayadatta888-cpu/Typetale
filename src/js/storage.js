const Storage = {
  activeProgressKey: null,

  getDefaultProgress() {
    return {
      theme: "midnight",
      selectedMode: "diagnostic",
      history: [],
      weakWords: [],
      weakKeys: {}
    };
  },

  getAccountKey(email, password) {
    const credentials = `${email.trim().toLowerCase()}::${password}`;
    const accountId = Array.from(credentials)
      .map((character) => character.codePointAt(0).toString(16))
      .join("-");
    return `typetale-account-${accountId}`;
  },

  getProgress() {
    if (!this.activeProgressKey) return this.getDefaultProgress();
    const saved = localStorage.getItem(this.activeProgressKey);
    if (!saved) return this.getDefaultProgress();

    const progress = JSON.parse(saved);
    const allowedThemes = ["paper", "midnight"];
    const theme = allowedThemes.includes(progress.theme) ? progress.theme : "midnight";

    return {
      theme,
      selectedMode: progress.selectedMode || "diagnostic",
      history: progress.history || [],
      weakWords: progress.weakWords || [],
      weakKeys: progress.weakKeys || {}
    };
  },

  saveProgress(progress) {
    if (!this.activeProgressKey) return;
    localStorage.setItem(this.activeProgressKey, JSON.stringify(progress));
  },

  saveSelectedMode(modeId) {
    const progress = this.getProgress();
    progress.selectedMode = modeId;
    this.saveProgress(progress);
  },

  saveTheme(theme) {
    const progress = this.getProgress();
    progress.theme = theme;
    this.saveProgress(progress);
  },

  saveSession(result) {
    const progress = this.getProgress();
    const entry = {
      date: new Date().toLocaleDateString(),
      mode: result.mode,
      wpm: result.wpm,
      accuracy: result.accuracy,
      consistency: result.consistency,
      mistakes: result.mistakes,
      backspaces: result.backspaces
    };

    progress.history.unshift(entry);
    progress.history = progress.history.slice(0, 12);

    result.weakWords.forEach((word) => {
      if (!progress.weakWords.includes(word)) progress.weakWords.push(word);
    });
    progress.weakWords = progress.weakWords.slice(0, 18);

    result.heatmap.forEach((item) => {
      progress.weakKeys[item.key] = (progress.weakKeys[item.key] || 0) + item.count;
    });

    this.saveProgress(progress);
  },

  login(email, password) {
    this.activeProgressKey = this.getAccountKey(email, password);
  },

  logout() {
    this.activeProgressKey = null;
  }
};
