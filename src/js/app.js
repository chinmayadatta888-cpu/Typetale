const App = {
  screens: {
    login: document.getElementById("loginScreen"),
    dashboard: document.getElementById("dashboardScreen"),
    test: document.getElementById("testScreen"),
    result: document.getElementById("resultScreen")
  },
  lastRecommendation: null,

  init() {
    this.bindEvents();
    this.showScreen("login");
  },

  bindEvents() {
    document.getElementById("loginForm").addEventListener("submit", (event) => {
      event.preventDefault();
      Storage.login(document.getElementById("loginEmail").value.trim(), document.getElementById("loginPassword").value);
      this.setAuthMessage("");
      this.applyTheme(Storage.getProgress().theme);
      this.renderDashboard();
      this.showScreen("dashboard");
    });

    document.getElementById("forgotPasswordBtn").addEventListener("click", () => {
      this.setAuthMessage("An OTP was sent to your registered email.");
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
      Storage.logout();
      TypingTest.cancel();
      this.showScreen("login");
    });

    document.getElementById("startBtn").addEventListener("click", () => this.startPractice());

    document.getElementById("weakWordsBtn").addEventListener("click", () => {
      Storage.saveSelectedMode("weak-words");
      this.startPractice("weak-words");
    });

    document.getElementById("finishTestBtn").addEventListener("click", () => TypingTest.finish());

    document.getElementById("typingSurface").addEventListener("click", () => {
      document.getElementById("typingInput").focus();
    });

    document.getElementById("typingInput").addEventListener("keydown", (event) => {
      TypingTest.handleKeydown(event);
    });

    document.querySelectorAll(".theme-btn").forEach((button) => {
      button.addEventListener("click", () => {
        this.applyTheme(button.dataset.theme);
        Storage.saveTheme(button.dataset.theme);
      });
    });

    document.querySelectorAll(".time-btn").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".time-btn").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
      });
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
      const modeId = this.lastRecommendation ? this.lastRecommendation.modeId : Storage.getProgress().selectedMode;
      Storage.saveSelectedMode(modeId);
      this.startPractice(modeId);
    });

    document.getElementById("dashboardBtn").addEventListener("click", () => {
      this.renderDashboard();
      this.showScreen("dashboard");
    });
  },

  showScreen(screenName) {
    Object.values(this.screens).forEach((screen) => screen.classList.remove("active"));
    this.screens[screenName].classList.add("active");
    document.body.classList.toggle("is-auth-view", screenName === "login");
  },

  setAuthMessage(message) {
    document.getElementById("authMessage").textContent = message;
  },

  applyTheme(theme) {
    document.body.dataset.theme = theme;
    document.querySelectorAll(".theme-btn").forEach((button) => {
      button.classList.toggle("active", button.dataset.theme === theme);
    });
  },

  renderDashboard() {
    const progress = Storage.getProgress();
    const recommendation = PracticeEngine.getRecommendation();

    document.getElementById("bestWpm").textContent = PracticeEngine.getBestWpm();
    document.getElementById("bestAccuracy").textContent = `${PracticeEngine.getBestAccuracy()}%`;
    document.getElementById("sessionCount").textContent = progress.history.length;
    document.getElementById("currentGoal").textContent = PracticeEngine.getSelectedMode().title;
    document.getElementById("recommendationTitle").textContent = recommendation.title;
    document.getElementById("recommendationText").textContent = recommendation.text;

    this.renderModes();
    this.renderTimeline();
  },

  renderModes() {
    const grid = document.getElementById("modeGrid");
    const selectedMode = Storage.getProgress().selectedMode;
    grid.innerHTML = "";

    PRACTICE_MODES.forEach((mode) => {
      const item = document.createElement("button");
      item.className = `mode-card ${mode.id === selectedMode ? "active" : ""}`;
      item.innerHTML = `<strong>${mode.title}</strong><span>${mode.goal}</span>`;
      item.addEventListener("click", () => {
        Storage.saveSelectedMode(mode.id);
        this.renderDashboard();
      });
      grid.appendChild(item);
    });
  },

  startPractice(modeId = Storage.getProgress().selectedMode) {
    const prompt = PracticeEngine.getPrompt(modeId);
    const activeTimeBtn = document.querySelector(".time-btn.active");
    TypingTest.duration = activeTimeBtn ? parseInt(activeTimeBtn.dataset.time, 10) : 60;

    document.getElementById("currentGoal").textContent = prompt.modeTitle;
    this.showScreen("test");
    TypingTest.start(prompt);
    setTimeout(() => document.getElementById("typingInput").focus(), 100);
  },

  showResult(result) {
    this.lastRecommendation = PracticeEngine.getRecommendation(result);
    document.getElementById("finalWpm").textContent = result.wpm;
    document.getElementById("finalAccuracy").textContent = `${result.accuracy}%`;
    document.getElementById("finalConsistency").textContent = `${result.consistency}%`;

    this.renderProfile(result);
    this.renderRecommendation(this.lastRecommendation);
    this.renderFatigue(result);
    this.renderKeyboardHeatmap(result.heatmap);
    this.renderRhythmGraph(result.rhythm);
    this.renderMistakeReplay(result);
    this.renderDashboard();
    this.showScreen("result");
  },

  renderProfile(result) {
    const title = document.getElementById("personalityTitle");
    const body = document.getElementById("personalityBody");

    if (result.accuracy >= 96 && result.backspaces <= 3) {
      title.textContent = "Accuracy-First Typist";
      body.textContent = "You keep mistakes low and corrections controlled. Build speed gradually while preserving that precision.";
      return;
    }
    if (result.wpm >= 45 && result.accuracy < 88) {
      title.textContent = "Speed-First Typist";
      body.textContent = "Your pace is strong, but errors are costing clarity. Accuracy drills will give you cleaner speed.";
      return;
    }
    if (result.backspaces >= 10) {
      title.textContent = "Over-Corrector";
      body.textContent = "You rely heavily on backspace. Try slower accuracy rounds and aim to type once with confidence.";
      return;
    }
    if (result.consistency < 70) {
      title.textContent = "Burst Typist";
      body.textContent = "Your speed rises and drops in waves. Rhythm practice will help you maintain an even pace.";
      return;
    }

    title.textContent = "Steady Typist";
    body.textContent = "Your pace and accuracy are balanced. You can safely target one specific skill next.";
  },

  renderRecommendation(recommendation) {
    document.getElementById("resultRecommendationTitle").textContent = recommendation.title;
    document.getElementById("resultRecommendationText").textContent = recommendation.text;
  },

  renderFatigue(result) {
    const title = document.getElementById("fatigueTitle");
    const body = document.getElementById("fatigueBody");

    if (result.fatigue.detected) {
      title.textContent = "End-Round Fatigue Detected";
      body.textContent = `Your performance dropped by about ${result.fatigue.drop} points near the end. Try shorter focused drills or slow the final 15 seconds.`;
      return;
    }

    title.textContent = "Stable Finish";
    body.textContent = "No major late-round drop was detected. Your focus held up well through the session.";
  },

  renderKeyboardHeatmap(heatmap) {
    const keyboard = document.getElementById("keyboardHeatmap");
    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    const counts = Object.fromEntries(heatmap.map((item) => [item.key, item.count]));
    const max = Math.max(...heatmap.map((item) => item.count), 1);
    keyboard.innerHTML = "";

    rows.forEach((row) => {
      const rowEl = document.createElement("div");
      rowEl.className = "keyboard-row";
      [...row].forEach((key) => {
        const count = counts[key] || 0;
        const keyEl = document.createElement("span");
        keyEl.className = "keyboard-key";
        keyEl.style.setProperty("--heat", count / max);
        keyEl.textContent = key;
        rowEl.appendChild(keyEl);
      });
      keyboard.appendChild(rowEl);
    });
  },

  renderRhythmGraph(samples) {
    const graph = document.getElementById("rhythmGraph");
    graph.innerHTML = "";
    const maxWpm = Math.max(...samples.map((sample) => sample.wpm), 1);

    samples.forEach((sample) => {
      const bar = document.createElement("div");
      bar.className = "rhythm-bar";
      bar.style.height = `${Math.max((sample.wpm / maxWpm) * 100, 6)}%`;
      bar.innerHTML = `<span>${sample.wpm}</span><small>${sample.second}s</small>`;
      graph.appendChild(bar);
    });
  },

  renderMistakeReplay(result) {
    const replay = document.getElementById("mistakeReplay");
    replay.innerHTML = "";

    if (!result.heatmap.length && !result.weakWords.length) {
      replay.innerHTML = `<p class="empty-note">No clear mistake pattern detected in this round.</p>`;
      return;
    }

    const weakKeys = result.heatmap.map((item) => `${item.key} (${item.count})`).join(", ") || "none";
    const weakWords = result.weakWords.join(", ") || "none";
    replay.innerHTML = `
      <p><strong>Weak keys:</strong> ${weakKeys}</p>
      <p><strong>Weak words:</strong> ${weakWords}</p>
      <p><strong>Backspaces:</strong> ${result.backspaces}</p>
    `;
  },

  renderTimeline() {
    const timeline = document.getElementById("progressTimeline");
    const history = Storage.getProgress().history.slice(0, 8);
    timeline.innerHTML = "";

    if (!history.length) {
      timeline.innerHTML = `<p class="empty-note">Complete a session to start your progress timeline.</p>`;
      return;
    }

    history.forEach((entry) => {
      const item = document.createElement("article");
      item.className = "timeline-item";
      item.innerHTML = `
        <span>${entry.date}</span>
        <strong>${entry.wpm} WPM</strong>
        <small>${entry.accuracy}% accuracy - ${entry.consistency}% consistency</small>
      `;
      timeline.appendChild(item);
    });
  }
};

App.init();
