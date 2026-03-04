/* ============================================
   SASプログラミングアカデミー - クイズページJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initQuizPage();
});

function initQuizPage() {
  var container = document.getElementById("quiz-container");
  if (!container || typeof QUIZ_DATA === "undefined") return;

  var currentQuestion = 0;
  var score = 0;
  var answers = [];
  var answered = false;

  function renderQuestion() {
    var q = QUIZ_DATA[currentQuestion];
    var progress = ((currentQuestion) / QUIZ_DATA.length) * 100;

    var html =
      '<div class="quiz-progress">' +
        '<div class="quiz-progress-bar">' +
          '<div class="quiz-progress-fill" style="width: ' + progress + '%;"></div>' +
        '</div>' +
        '<span class="quiz-progress-text">' + (currentQuestion + 1) + ' / ' + QUIZ_DATA.length + '</span>' +
      '</div>' +

      '<div class="quiz-question">' +
        '<h3>Q' + (currentQuestion + 1) + '. ' + escapeHtml(q.question) + '</h3>' +
        '<div class="quiz-options">';

    q.options.forEach(function (option, i) {
      html += '<button class="quiz-option" data-index="' + i + '">' +
                escapeHtml(option) +
              '</button>';
    });

    html +=
        '</div>' +
        '<div class="quiz-explanation" id="quiz-explanation">' +
          '<p style="margin: 0;">' + escapeHtml(q.explanation) + '</p>' +
        '</div>' +
      '</div>' +

      '<div class="quiz-nav">' +
        '<div></div>' +
        '<button class="btn btn-primary" id="quiz-next" style="display: none;">次の問題 &rarr;</button>' +
      '</div>';

    container.innerHTML = html;
    answered = false;

    // 選択肢のイベント
    container.querySelectorAll(".quiz-option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (answered) return;
        answered = true;

        var selectedIndex = parseInt(this.getAttribute("data-index"));
        var correct = q.answer;

        answers.push(selectedIndex);

        // 全選択肢を無効化
        container.querySelectorAll(".quiz-option").forEach(function (opt) {
          opt.classList.add("disabled");
          var idx = parseInt(opt.getAttribute("data-index"));
          if (idx === correct) {
            opt.classList.add("correct");
          }
        });

        if (selectedIndex === correct) {
          this.classList.add("correct");
          score++;
        } else {
          this.classList.add("incorrect");
        }

        // 解説表示
        document.getElementById("quiz-explanation").classList.add("show");

        // 次へボタン表示
        var nextBtn = document.getElementById("quiz-next");
        if (currentQuestion < QUIZ_DATA.length - 1) {
          nextBtn.textContent = "次の問題 \u2192";
        } else {
          nextBtn.textContent = "結果を見る";
        }
        nextBtn.style.display = "inline-block";

        nextBtn.addEventListener("click", function () {
          currentQuestion++;
          if (currentQuestion < QUIZ_DATA.length) {
            renderQuestion();
          } else {
            renderResult();
          }
        });
      });
    });
  }

  function renderResult() {
    var result = null;
    if (typeof QUIZ_RESULTS !== "undefined") {
      for (var i = 0; i < QUIZ_RESULTS.length; i++) {
        if (score >= QUIZ_RESULTS[i].min && score <= QUIZ_RESULTS[i].max) {
          result = QUIZ_RESULTS[i];
          break;
        }
      }
    }

    var html =
      '<div class="quiz-result">' +
        '<div class="quiz-progress mb-4">' +
          '<div class="quiz-progress-bar">' +
            '<div class="quiz-progress-fill" style="width: 100%;"></div>' +
          '</div>' +
          '<span class="quiz-progress-text">完了</span>' +
        '</div>' +

        '<div class="score">' + score + ' / ' + QUIZ_DATA.length + '</div>' +
        (result ?
          '<div class="level" style="color: ' + result.color + ';">' + escapeHtml(result.level) + '</div>' +
          '<p class="message">' + escapeHtml(result.message) + '</p>'
          : '') +

        '<div style="margin-top: 2rem;">';

    // 各問の正誤一覧
    html += '<h3 style="margin-bottom: 1rem; text-align: left;">回答一覧</h3>';
    QUIZ_DATA.forEach(function (q, i) {
      var isCorrect = answers[i] === q.answer;
      html +=
        '<div class="card mb-2" style="text-align: left; border-left: 4px solid ' + (isCorrect ? 'var(--color-success)' : 'var(--color-warning)') + ';">' +
          '<p class="text-sm" style="margin-bottom: 0.5rem;"><strong>Q' + (i + 1) + '.</strong> ' + escapeHtml(q.question) + '</p>' +
          '<p class="text-sm" style="margin-bottom: 0.25rem; color: ' + (isCorrect ? 'var(--color-success)' : 'var(--color-warning)') + ';">' +
            (isCorrect ? '正解' : '不正解 (あなたの回答: ' + escapeHtml(q.options[answers[i]]) + ')') +
          '</p>' +
          '<p class="text-sm text-light" style="margin: 0;">正解: ' + escapeHtml(q.options[q.answer]) + '</p>' +
        '</div>';
    });

    html +=
        '</div>' +

        '<div style="margin-top: 2rem;">' +
          '<button class="btn btn-primary btn-lg" id="quiz-retry">もう一度挑戦する</button>' +
          '<a href="../guide/index.html" class="btn btn-outline btn-lg" style="margin-left: 1rem;">学習ガイドへ</a>' +
        '</div>' +
      '</div>';

    container.innerHTML = html;

    document.getElementById("quiz-retry").addEventListener("click", function () {
      currentQuestion = 0;
      score = 0;
      answers = [];
      renderQuestion();
    });
  }

  // 開始画面
  var startHtml =
    '<div class="quiz-result">' +
      '<div class="card-icon" style="font-size: 4rem; margin-bottom: 1rem;">&#x1F4DD;</div>' +
      '<h2 style="margin-bottom: 1rem;">SAS理解度クイズ</h2>' +
      '<p class="text-light mb-4">12問の問題に答えて、あなたのSASプログラミングの理解度をチェックしましょう。<br>DATA STEP、PROC、マクロ、臨床試験プログラミングの知識を問います。</p>' +
      '<button class="btn btn-primary btn-lg" id="quiz-start">クイズを開始する</button>' +
    '</div>';

  container.innerHTML = startHtml;

  document.getElementById("quiz-start").addEventListener("click", function () {
    renderQuestion();
  });
}
