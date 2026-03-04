/* ============================================
   SASプログラミングアカデミー - PROC ページJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initProcsPage();
});

function initProcsPage() {
  var overviewContainer = document.getElementById("proc-overview");
  var detailContainer = document.getElementById("proc-detail");
  var filterContainer = document.getElementById("proc-filters");
  var countEl = document.getElementById("proc-count");
  if (!overviewContainer || typeof PROC_DATA === "undefined") return;

  var currentFilter = "all";

  var categories = {
    all: "全て",
    data: "データ操作系",
    statistics: "統計系",
    report: "レポート系"
  };

  function getCategoryLabel(cat) {
    return categories[cat] || cat;
  }

  function getCategoryBadge(cat) {
    return "badge-" + cat;
  }

  /* --- フィルターボタン生成 --- */
  function renderFilters() {
    if (!filterContainer) return;
    var html = "";
    Object.keys(categories).forEach(function (key) {
      html += '<button class="filter-btn' + (key === currentFilter ? ' active' : '') +
              '" data-filter="' + key + '">' + categories[key] + '</button>';
    });
    filterContainer.innerHTML = html;

    filterContainer.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentFilter = this.getAttribute("data-filter");
        renderFilters();
        renderOverview();
      });
    });
  }

  /* --- 一覧表示 --- */
  function renderOverview() {
    var filtered = PROC_DATA;
    if (currentFilter !== "all") {
      filtered = PROC_DATA.filter(function (p) {
        return p.category === currentFilter;
      });
    }

    if (countEl) {
      countEl.textContent = filtered.length + " 件のPROC";
    }

    var html = '<div class="grid grid-2">';
    filtered.forEach(function (proc) {
      html +=
        '<div class="card" style="cursor: pointer;" data-proc-id="' + proc.id + '">' +
          '<div class="flex-between mb-2">' +
            '<h3 class="card-title" style="margin-bottom: 0;">' + escapeHtml(proc.name) + '</h3>' +
            '<span class="badge ' + getCategoryBadge(proc.category) + '">' + getCategoryLabel(proc.category) + '</span>' +
          '</div>' +
          '<p class="card-text">' + escapeHtml(proc.purpose) + '</p>' +
          '<p class="text-sm text-light" style="margin-bottom: 0.5rem;"><strong>臨床試験:</strong> ' + escapeHtml(proc.clinicalUse).substring(0, 60) + '...</p>' +
          '<span class="card-link">詳細を見る &rarr;</span>' +
        '</div>';
    });
    html += '</div>';

    overviewContainer.innerHTML = html;
    overviewContainer.style.display = "block";
    detailContainer.style.display = "none";

    overviewContainer.querySelectorAll("[data-proc-id]").forEach(function (card) {
      card.addEventListener("click", function () {
        var id = this.getAttribute("data-proc-id");
        showDetail(id);
      });
    });
  }

  /* --- 詳細表示 --- */
  function showDetail(id) {
    var proc = PROC_DATA.find(function (p) { return p.id === id; });
    if (!proc) return;

    window.location.hash = id;

    var optionsHtml = "";
    if (proc.commonOptions && proc.commonOptions.length > 0) {
      optionsHtml = '<ul>';
      proc.commonOptions.forEach(function (opt) {
        optionsHtml += '<li>' + escapeHtml(opt) + '</li>';
      });
      optionsHtml += '</ul>';
    }

    var html =
      '<button class="btn btn-outline btn-sm mb-4" id="back-to-list">&larr; 一覧に戻る</button>' +

      '<div class="detail-panel">' +
        '<div class="flex-between mb-3" style="flex-wrap: wrap; gap: 0.5rem;">' +
          '<h2 style="margin-bottom: 0;">' + escapeHtml(proc.name) + '</h2>' +
          '<span class="badge ' + getCategoryBadge(proc.category) + '">' + getCategoryLabel(proc.category) + '</span>' +
        '</div>' +
        '<p><strong>' + escapeHtml(proc.purpose) + '</strong></p>' +

        '<div class="detail-section">' +
          '<h4>構文（Syntax）</h4>' +
          '<div class="code-block"><pre>' + highlightSAS(proc.syntax) + '</pre></div>' +
        '</div>' +

        '<div class="detail-section">' +
          '<h4>主要オプション</h4>' +
          optionsHtml +
        '</div>' +

        '<div class="detail-section">' +
          '<h4>コード例</h4>' +
          '<div class="code-block">' +
            '<div class="code-block-header"><span class="lang-label">SAS</span><span>' + escapeHtml(proc.name) + '</span></div>' +
            '<pre>' + highlightSAS(proc.example) + '</pre>' +
          '</div>' +
        '</div>' +

        '<div class="detail-section">' +
          '<h4>出力結果</h4>' +
          '<div class="output-block">' +
            '<span class="output-label">OUTPUT</span>' +
            '<pre>' + escapeHtml(proc.output) + '</pre>' +
          '</div>' +
        '</div>' +

        '<div class="detail-section">' +
          '<h4>臨床試験での活用</h4>' +
          '<div class="card tip-card" style="margin: 0;">' +
            '<p class="card-text" style="margin: 0;">' + escapeHtml(proc.clinicalUse) + '</p>' +
          '</div>' +
        '</div>' +
      '</div>';

    detailContainer.innerHTML = html;
    overviewContainer.style.display = "none";
    detailContainer.style.display = "block";

    document.getElementById("back-to-list").addEventListener("click", function () {
      window.location.hash = "";
      renderOverview();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* --- 初期化 --- */
  renderFilters();

  // URLハッシュがあれば詳細表示
  if (window.location.hash) {
    var hashId = window.location.hash.substring(1);
    var found = PROC_DATA.find(function (p) { return p.id === hashId; });
    if (found) {
      showDetail(hashId);
    } else {
      renderOverview();
    }
  } else {
    renderOverview();
  }

  // hashchange対応
  window.addEventListener("hashchange", function () {
    if (window.location.hash) {
      var id = window.location.hash.substring(1);
      var proc = PROC_DATA.find(function (p) { return p.id === id; });
      if (proc) {
        showDetail(id);
      }
    } else {
      renderOverview();
    }
  });
}
