/* ============================================
   SASプログラミングアカデミー - 学習ガイドページJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initGuidePage();
});

function initGuidePage() {
  initRoadmap();
  initClinicalPatterns();
}

/* --- ロードマップ表示 --- */
function initRoadmap() {
  var container = document.getElementById("roadmap-content");
  if (!container || typeof GUIDE_STEPS === "undefined") return;

  var html = '<div class="roadmap">';

  GUIDE_STEPS.forEach(function (step) {
    var topicsHtml = '';
    if (step.topics && step.topics.length > 0) {
      topicsHtml = '<div class="roadmap-topics">';
      step.topics.forEach(function (topic) {
        topicsHtml += '<span class="topic-tag">' + escapeHtml(topic) + '</span>';
      });
      topicsHtml += '</div>';
    }

    html +=
      '<div class="roadmap-step">' +
        '<div class="roadmap-number">' + step.step + '</div>' +
        '<span class="duration">' + escapeHtml(step.duration) + '</span>' +
        '<h3>' + escapeHtml(step.title) + '</h3>' +
        '<p class="text-sm">' + escapeHtml(step.description) + '</p>' +
        topicsHtml +
        (step.link ? '<a href="../' + step.link + '" class="card-link" style="margin-top: 0.5rem; display: inline-block;">学習する &rarr;</a>' : '') +
      '</div>';
  });

  html += '</div>';
  container.innerHTML = html;
}

/* --- 臨床試験パターン表示 --- */
function initClinicalPatterns() {
  var container = document.getElementById("clinical-patterns");
  if (!container || typeof CLINICAL_PATTERNS === "undefined") return;

  var html = "";

  CLINICAL_PATTERNS.forEach(function (pattern) {
    html +=
      '<div class="detail-panel" id="' + pattern.id + '">' +
        '<h2>' + escapeHtml(pattern.name) + '</h2>' +
        '<p>' + escapeHtml(pattern.description) + '</p>' +

        '<div class="detail-section">' +
          '<h4>コード例</h4>' +
          '<div class="code-block">' +
            '<div class="code-block-header"><span class="lang-label">SAS</span><span>' + escapeHtml(pattern.name) + '</span></div>' +
            '<pre>' + highlightSAS(pattern.code) + '</pre>' +
          '</div>' +
        '</div>' +

        '<div class="detail-section">' +
          '<h4>解説</h4>' +
          '<div class="card tip-card" style="margin: 0;">' +
            '<p class="card-text" style="margin: 0;">' + escapeHtml(pattern.explanation) + '</p>' +
          '</div>' +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;
}
