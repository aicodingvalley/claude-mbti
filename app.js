(function () {
  "use strict";

  const state = {
    currentIndex: 0,
    answers: new Array(QUESTIONS.length).fill(null)
  };

  const el = {
    startScreen: document.getElementById("start-screen"),
    quizScreen: document.getElementById("quiz-screen"),
    resultScreen: document.getElementById("result-screen"),
    startBtn: document.getElementById("start-btn"),
    progressFill: document.getElementById("progress-fill"),
    currentQ: document.getElementById("current-q"),
    totalQ: document.getElementById("total-q"),
    qIndex: document.getElementById("q-index"),
    qText: document.getElementById("q-text"),
    answers: document.getElementById("answers"),
    prevBtn: document.getElementById("prev-btn"),
    resultType: document.getElementById("result-type"),
    resultNickname: document.getElementById("result-nickname"),
    resultDescription: document.getElementById("result-description"),
    resultStrengths: document.getElementById("result-strengths"),
    resultWeaknesses: document.getElementById("result-weaknesses"),
    resultMatch: document.getElementById("result-match"),
    retryBtn: document.getElementById("retry-btn"),
    shareBtn: document.getElementById("share-btn")
  };

  function showScreen(name) {
    [el.startScreen, el.quizScreen, el.resultScreen].forEach((s) =>
      s.classList.remove("active")
    );
    if (name === "start") el.startScreen.classList.add("active");
    if (name === "quiz") el.quizScreen.classList.add("active");
    if (name === "result") el.resultScreen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderQuestion() {
    const idx = state.currentIndex;
    const q = QUESTIONS[idx];

    el.qIndex.textContent = idx + 1;
    el.qText.textContent = q.text;
    el.currentQ.textContent = idx + 1;
    el.totalQ.textContent = QUESTIONS.length;

    const pct = (idx / QUESTIONS.length) * 100;
    el.progressFill.style.width = pct + "%";

    el.answers.innerHTML = "";
    q.answers.forEach((a, aIdx) => {
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.textContent = a.text;
      if (state.answers[idx] === aIdx) btn.classList.add("selected");
      btn.addEventListener("click", () => handleAnswer(aIdx));
      el.answers.appendChild(btn);
    });

    el.prevBtn.disabled = idx === 0;
  }

  function handleAnswer(answerIdx) {
    state.answers[state.currentIndex] = answerIdx;

    const buttons = el.answers.querySelectorAll(".answer-btn");
    buttons.forEach((b, i) => {
      b.classList.toggle("selected", i === answerIdx);
    });

    setTimeout(() => {
      if (state.currentIndex < QUESTIONS.length - 1) {
        state.currentIndex += 1;
        renderQuestion();
      } else {
        showResult();
      }
    }, 250);
  }

  function calculateType() {
    const score = { EI: 0, SN: 0, TF: 0, JP: 0 };

    QUESTIONS.forEach((q, idx) => {
      const pick = state.answers[idx];
      if (pick === null) return;
      score[q.dim] += q.answers[pick].score;
    });

    const type =
      (score.EI >= 0 ? "E" : "I") +
      (score.SN >= 0 ? "S" : "N") +
      (score.TF >= 0 ? "T" : "F") +
      (score.JP >= 0 ? "J" : "P");

    return type;
  }

  function showResult() {
    const type = calculateType();
    const info = RESULTS[type];

    el.resultType.textContent = type;
    el.resultNickname.textContent = info.nickname;
    el.resultDescription.textContent = info.description;

    el.resultStrengths.innerHTML = "";
    info.strengths.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      el.resultStrengths.appendChild(li);
    });

    el.resultWeaknesses.innerHTML = "";
    info.weaknesses.forEach((w) => {
      const li = document.createElement("li");
      li.textContent = w;
      el.resultWeaknesses.appendChild(li);
    });

    el.resultMatch.textContent = info.match;

    el.progressFill.style.width = "100%";
    showScreen("result");
  }

  function startQuiz() {
    state.currentIndex = 0;
    state.answers = new Array(QUESTIONS.length).fill(null);
    renderQuestion();
    showScreen("quiz");
  }

  function goPrev() {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      renderQuestion();
    }
  }

  async function shareResult() {
    const type = el.resultType.textContent;
    const nickname = el.resultNickname.textContent;
    const shareText = `나의 MBTI는 ${type} (${nickname})!\n너도 해보자 👇`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "MBTI 찐테스트", text: shareText, url: shareUrl });
        return;
      } catch (_) {
        // fallthrough to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      el.shareBtn.textContent = "링크가 복사됐어요!";
      setTimeout(() => (el.shareBtn.textContent = "결과 공유하기"), 1800);
    } catch (_) {
      alert(`${shareText}\n${shareUrl}`);
    }
  }

  el.startBtn.addEventListener("click", startQuiz);
  el.prevBtn.addEventListener("click", goPrev);
  el.retryBtn.addEventListener("click", () => {
    showScreen("start");
    el.progressFill.style.width = "0%";
  });
  el.shareBtn.addEventListener("click", shareResult);

  el.totalQ.textContent = QUESTIONS.length;
})();
