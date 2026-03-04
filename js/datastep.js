/* ============================================
   SASプログラミングアカデミー - DATA STEP ページJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initDatastepPage();
});

function initDatastepPage() {
  var container = document.getElementById("datastep-list");
  var searchInput = document.getElementById("datastep-search");
  var countEl = document.getElementById("datastep-count");
  if (!container || typeof SYNTAX_BASICS === "undefined") return;

  function render(filter) {
    var filtered = SYNTAX_BASICS;
    if (filter) {
      var lower = filter.toLowerCase();
      filtered = SYNTAX_BASICS.filter(function (item) {
        return (
          item.name.toLowerCase().indexOf(lower) !== -1 ||
          item.description.toLowerCase().indexOf(lower) !== -1 ||
          item.syntax.toLowerCase().indexOf(lower) !== -1 ||
          item.example.toLowerCase().indexOf(lower) !== -1 ||
          (item.tips && item.tips.toLowerCase().indexOf(lower) !== -1)
        );
      });
    }

    if (countEl) {
      countEl.textContent = filtered.length + " 件の構文";
    }

    if (filtered.length === 0) {
      container.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-icon">&#x1F50D;</div>' +
          '<p>該当する構文が見つかりませんでした。</p>' +
        '</div>';
      return;
    }

    var html = "";
    filtered.forEach(function (item) {
      html +=
        '<div class="detail-panel" id="' + item.id + '">' +
          '<h2>' + escapeHtml(item.name) + '</h2>' +
          '<p>' + escapeHtml(item.description) + '</p>' +

          '<div class="detail-section">' +
            '<h4>構文（Syntax）</h4>' +
            '<div class="code-block"><pre>' + highlightSAS(item.syntax) + '</pre></div>' +
          '</div>' +

          '<div class="detail-section">' +
            '<h4>コード例</h4>' +
            '<div class="code-block">' +
              '<div class="code-block-header"><span class="lang-label">SAS</span><span>' + escapeHtml(item.name) + '</span></div>' +
              '<pre>' + highlightSAS(item.example) + '</pre>' +
            '</div>' +
          '</div>' +

          '<div class="detail-section">' +
            '<h4>出力結果</h4>' +
            '<div class="output-block">' +
              '<span class="output-label">OUTPUT</span>' +
              '<pre>' + escapeHtml(item.output) + '</pre>' +
            '</div>' +
          '</div>' +

          (item.tips ?
          '<div class="detail-section">' +
            '<h4>TIPS</h4>' +
            '<div class="card tip-card" style="margin: 0;">' +
              '<p class="card-text" style="margin: 0;">' + escapeHtml(item.tips) + '</p>' +
            '</div>' +
          '</div>' : '') +

        '</div>';
    });

    container.innerHTML = html;
  }

  render("");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      render(this.value.trim());
    });
  }

  // URLハッシュでスクロール
  if (window.location.hash) {
    var target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(function () {
        var headerHeight = document.querySelector(".site-header") ? document.querySelector(".site-header").offsetHeight : 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20,
          behavior: "smooth"
        });
      }, 300);
    }
  }
}
