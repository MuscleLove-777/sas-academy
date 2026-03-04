/* ============================================
   SASプログラミングアカデミー - 検索ページJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initSearchPage();
});

function initSearchPage() {
  var searchInput = document.getElementById("global-search");
  var filterContainer = document.getElementById("search-filters");
  var countEl = document.getElementById("search-count");
  var resultsContainer = document.getElementById("search-results");
  if (!searchInput || !resultsContainer) return;

  var currentFilter = "all";
  var categories = {
    all: "全て",
    syntax: "DATA STEP構文",
    proc: "PROC",
    macro: "マクロ",
    clinical: "臨床パターン"
  };

  /* --- 全データを統合 --- */
  function getAllItems() {
    var items = [];

    if (typeof SYNTAX_BASICS !== "undefined") {
      SYNTAX_BASICS.forEach(function (item) {
        items.push({
          type: "syntax",
          typeName: "DATA STEP",
          name: item.name,
          description: item.description,
          code: item.example,
          output: item.output || "",
          tips: item.tips || "",
          link: "../datastep/index.html#" + item.id
        });
      });
    }

    if (typeof PROC_DATA !== "undefined") {
      PROC_DATA.forEach(function (item) {
        items.push({
          type: "proc",
          typeName: "PROC",
          name: item.name,
          description: item.purpose + " " + (item.clinicalUse || ""),
          code: item.example,
          output: item.output || "",
          tips: item.clinicalUse || "",
          link: "../procs/index.html#" + item.id
        });
      });
    }

    if (typeof MACRO_DATA !== "undefined") {
      MACRO_DATA.forEach(function (item) {
        items.push({
          type: "macro",
          typeName: "マクロ",
          name: item.name,
          description: item.description,
          code: item.example,
          output: "",
          tips: item.tips || "",
          link: "../macro/index.html#" + item.id
        });
      });
    }

    if (typeof CLINICAL_PATTERNS !== "undefined") {
      CLINICAL_PATTERNS.forEach(function (item) {
        items.push({
          type: "clinical",
          typeName: "臨床パターン",
          name: item.name,
          description: item.description + " " + item.explanation,
          code: item.code,
          output: "",
          tips: item.explanation || "",
          link: "../guide/index.html#" + item.id
        });
      });
    }

    return items;
  }

  var allItems = getAllItems();

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
        doSearch();
      });
    });
  }

  /* --- 検索実行 --- */
  function doSearch() {
    var query = searchInput.value.trim().toLowerCase();

    var filtered = allItems;

    // カテゴリフィルター
    if (currentFilter !== "all") {
      filtered = filtered.filter(function (item) {
        return item.type === currentFilter;
      });
    }

    // テキスト検索
    if (query) {
      filtered = filtered.filter(function (item) {
        return (
          item.name.toLowerCase().indexOf(query) !== -1 ||
          item.description.toLowerCase().indexOf(query) !== -1 ||
          item.code.toLowerCase().indexOf(query) !== -1 ||
          item.tips.toLowerCase().indexOf(query) !== -1
        );
      });
    }

    if (countEl) {
      countEl.textContent = filtered.length + " 件の結果" + (query ? ' （"' + searchInput.value.trim() + '"）' : "");
    }

    if (filtered.length === 0) {
      resultsContainer.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-icon">&#x1F50D;</div>' +
          '<p>該当するコード例が見つかりませんでした。</p>' +
          '<p class="text-sm text-light">キーワードを変えてお試しください。</p>' +
        '</div>';
      return;
    }

    var html = "";
    filtered.forEach(function (item) {
      var badgeClass = "badge-" + item.type;
      if (item.type === "syntax") badgeClass = "badge-datastep";

      html +=
        '<div class="card mb-3">' +
          '<div class="flex-between mb-2" style="flex-wrap: wrap; gap: 0.5rem;">' +
            '<h3 class="card-title" style="margin-bottom: 0;">' + escapeHtml(item.name) + '</h3>' +
            '<span class="badge ' + badgeClass + '">' + escapeHtml(item.typeName) + '</span>' +
          '</div>' +
          '<p class="card-text">' + escapeHtml(item.description).substring(0, 150) + (item.description.length > 150 ? '...' : '') + '</p>' +
          '<div class="code-block">' +
            '<div class="code-block-header"><span class="lang-label">SAS</span></div>' +
            '<pre>' + highlightSAS(item.code.substring(0, 500)) + (item.code.length > 500 ? '\n...' : '') + '</pre>' +
          '</div>' +
          '<a href="' + item.link + '" class="card-link">詳細を見る &rarr;</a>' +
        '</div>';
    });

    resultsContainer.innerHTML = html;
  }

  /* --- 初期化 --- */
  renderFilters();

  searchInput.addEventListener("input", function () {
    doSearch();
  });

  // 初回表示
  doSearch();
}
