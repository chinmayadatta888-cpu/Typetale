// Logic Order:
// 1. Test Initialization Logic
// 2. Timer Management Logic
// 3. Keyboard Input Handling Logic
// 4. UI Rendering Logic
// 5. Statistics Update Logic
// 6. Rhythm Sampling Logic
// 7. Test Completion Logic
// 8. Analysis Utility Logic


const TypingTest = {
  duration: 60,
  timeLeft: 60,
  timerId: null,
  startedAt: null,
  prompt: null,
  typedText: "",
  rhythmSamples: [],
  sampledSeconds: [],
  backspaces: 0,

  // 1. Test Initialization Logic
  start(prompt) {
    this.prompt = prompt;
    this.typedText = "";
    this.rhythmSamples = [];
    this.sampledSeconds = [];
    this.backspaces = 0;
    this.timeLeft = this.duration;
    this.startedAt = null;

    clearInterval(this.timerId);
    document.getElementById("typingInput").value = "";
    document.getElementById("timer").textContent = this.timeLeft;
    document.getElementById("typingSurface").classList.remove("is-finished");
    this.renderText();
    this.updateStats();
  },

  // 2. Timer Management Logic
  beginTimer() {
    if (this.startedAt) return;

    this.startedAt = Date.now();
    this.timerId = setInterval(() => {
      this.timeLeft--;
      document.getElementById("timer").textContent = this.timeLeft;
      this.updateStats();
      this.sampleRhythm();

      if (this.timeLeft <= 0) {
        this.finish();
      }
    }, 1000);
  },

  // 3. Keyboard Input Handling Logic
  handleKeydown(event) {
    if (this.timeLeft <= 0) return;

    const ignoredKeys = ["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

    if (ignoredKeys.includes(event.key)) {
      return;
    }

    event.preventDefault();
    this.beginTimer();

    if (event.key === "Backspace") {
      this.backspaces++;
      this.typedText = this.typedText.slice(0, -1);
      this.renderText();
      this.updateStats();
      return;
    }

    if (event.key.length !== 1 && event.key !== "Enter") return;

    const character = event.key === "Enter" ? " " : event.key;

    if (this.typedText.length < this.prompt.text.length) {
      this.typedText += character;
    }

    if (this.typedText.length >= this.prompt.text.length) {
      const morePrompt = PracticeEngine.getPrompt(this.prompt.modeId);
      this.prompt.text += " " + morePrompt.text;
    }

    this.renderText();
    this.updateStats();
  },

  // 4. UI Rendering Logic
  renderText() {
    const container = document.getElementById("jumbledText");
    container.innerHTML = "";

    [...this.prompt.text].forEach((character, index) => {
      const span = document.createElement("span");
      span.textContent = character;
      span.className = "char";

      if (index < this.typedText.length) {
        span.classList.add(this.typedText[index] === character ? "correct" : "wrong");
      }

      if (index === this.typedText.length) {
        span.classList.add("current");
      }

      container.appendChild(span);
    });
  },

  // 5. Statistics Update Logic
  updateStats() {
    const secondsUsed = this.startedAt
      ? Math.max((Date.now() - this.startedAt) / 1000, 1)
      : 1;
    const target = this.prompt.text.slice(0, this.typedText.length);
    const result = ResultCalculator.calculate(target, this.typedText, secondsUsed);

    document.getElementById("liveWpm").textContent = result.wpm;
    document.getElementById("liveAccuracy").textContent = `${result.accuracy}%`;
    document.getElementById("decodeMeterText").textContent = `${result.accuracy}%`;
    document.getElementById("decodeMeterBar").style.width = `${result.accuracy}%`;

    return result;
  },

  // 6. Rhythm Sampling Logic
  sampleRhythm() {
    if (!this.startedAt) return;

    const elapsed = Math.min(this.duration, Math.floor((Date.now() - this.startedAt) / 1000));

    if (elapsed === 0 || elapsed % 5 !== 0 || this.sampledSeconds.includes(elapsed)) return;

    const result = this.updateStats();
    this.sampledSeconds.push(elapsed);
    this.rhythmSamples.push({ second: elapsed, wpm: result.wpm, accuracy: result.accuracy });
  },

  // 7. Test Completion Logic
  finish() {
    if (document.getElementById("typingSurface").classList.contains("is-finished")) {
      return;
    }

    clearInterval(this.timerId);
    this.timeLeft = 0;
    document.getElementById("timer").textContent = "0";
    document.getElementById("typingSurface").classList.add("is-finished");

    const secondsUsed = this.startedAt
      ? Math.max((Date.now() - this.startedAt) / 1000, 1)
      : 1;
    const target = this.prompt.text.slice(0, this.typedText.length);
    const result = ResultCalculator.calculate(target, this.typedText, secondsUsed);
    const fullResult = {
      ...result,
      mode: this.prompt.modeId,
      modeTitle: this.prompt.modeTitle,
      goal: this.prompt.goal,
      targetText: target,
      typedText: this.typedText,
      backspaces: this.backspaces,
      rhythm: this.rhythmSamples.length ? this.rhythmSamples : [{ second: Math.round(secondsUsed), wpm: result.wpm, accuracy: result.accuracy }],
      heatmap: this.getErrorHeatmap(target, this.typedText),
      weakWords: this.getWeakWords(target, this.typedText)
    };

    fullResult.consistency = this.getConsistency(fullResult.rhythm);
    fullResult.fatigue = this.getFatigue(fullResult.rhythm);
    Storage.saveSession(fullResult);
    App.showResult(fullResult);
  },

  cancel() {
    clearInterval(this.timerId);
    this.timerId = null;
    this.startedAt = null;
  },

  // 8. Analysis Utility Logic
  getErrorHeatmap(targetText, typedText) {
    const heatmap = {};

    for (let i = 0; i < typedText.length; i++) {
      const expected = targetText[i];
      if (!expected || typedText[i] === expected || expected === " ") continue;
      const key = expected.toUpperCase();
      heatmap[key] = (heatmap[key] || 0) + 1;
    }

    return Object.entries(heatmap)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  },

  getWeakWords(targetText, typedText) {
    const targetWords = targetText.split(/\s+/);
    const typedWords = typedText.split(/\s+/);
    const weak = [];

    targetWords.forEach((word, index) => {
      if (typedWords[index] && typedWords[index] !== word) {
        weak.push(word.replace(/[^a-zA-Z0-9'-]/g, ""));
      }
    });

    return [...new Set(weak.filter(Boolean))].slice(0, 10);
  },

  getConsistency(samples) {
    if (samples.length < 2) return 100;

    const wpms = samples.map((sample) => sample.wpm);
    const average = wpms.reduce((sum, value) => sum + value, 0) / wpms.length;
    const variation = wpms.reduce((sum, value) => sum + Math.abs(value - average), 0) / wpms.length;

    return Math.max(0, Math.round(100 - variation * 2));
  },

  getFatigue(samples) {
    if (samples.length < 4) {
      return { detected: false, drop: 0 };
    }

    const midpoint = Math.floor(samples.length / 2);
    const firstHalf = samples.slice(0, midpoint);
    const secondHalf = samples.slice(midpoint);
    const avg = (items, key) => items.reduce((sum, item) => sum + item[key], 0) / items.length;
    const accuracyDrop = Math.round(avg(firstHalf, "accuracy") - avg(secondHalf, "accuracy"));
    const wpmDrop = Math.round(avg(firstHalf, "wpm") - avg(secondHalf, "wpm"));

    return {
      detected: accuracyDrop >= 8 || wpmDrop >= 10,
      drop: Math.max(accuracyDrop, wpmDrop)
    };
  }
};
