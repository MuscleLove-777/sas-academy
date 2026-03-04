/* ============================================
   SASプログラミングアカデミー - マクロページJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initMacroPage();
});

function initMacroPage() {
  initScopeDiagram();
  initMacroList();
}

/* --- マクロ変数スコープ図解 --- */
function initScopeDiagram() {
  var container = document.getElementById("scope-diagram");
  if (!container) return;

  var html =
    '<div class="scope-diagram">' +
      '<div class="scope-box global" style="flex: 1;">' +
        '<span class="scope-label global">GLOBAL スコープ</span>' +
        '<p class="text-sm mb-2">プログラム全体からアクセス可能なマクロ変数</p>' +
        '<div class="code-block" style="margin-bottom: 0.5rem;"><pre>%LET study = ABC-001;    /* グローバル */\n%LET cutoff = 15MAR2024; /* グローバル */\n\n%PUT &amp;study;  /* → ABC-001 */</pre></div>' +
        '<ul style="list-style: disc; padding-left: 1.5rem;">' +
          '<li class="text-sm">%LETでオープンコードで定義</li>' +
          '<li class="text-sm">CALL SYMPUTX(name, value, "G")で定義</li>' +
          '<li class="text-sm">全てのマクロ内からアクセス可能</li>' +
        '</ul>' +
      '</div>' +
      '<div class="scope-box local" style="flex: 1;">' +
        '<span class="scope-label local">LOCAL スコープ</span>' +
        '<p class="text-sm mb-2">定義されたマクロ内のみでアクセス可能</p>' +
        '<div class="code-block" style="margin-bottom: 0.5rem;"><pre>%MACRO test(ds=);\n  %LET n = 10;  /* ローカル */\n  /* &amp;ds もローカル */\n  %PUT &amp;ds &amp;n;\n%MEND;\n\n/* マクロ外からは &amp;n にアクセス不可 */</pre></div>' +
        '<ul style="list-style: disc; padding-left: 1.5rem;">' +
          '<li class="text-sm">マクロパラメータは自動的にローカル</li>' +
          '<li class="text-sm">マクロ内の%LETはローカル（同名グローバルがない場合）</li>' +
          '<li class="text-sm">マクロ終了時に削除される</li>' +
        '</ul>' +
      '</div>' +
    '</div>';

  container.innerHTML = html;
}

/* --- マクロトピック一覧 --- */
function initMacroList() {
  var container = document.getElementById("macro-list");
  if (!container || typeof MACRO_DATA === "undefined") return;

  var html = '<h2 class="section-title">マクロ構文リファレンス</h2>';

  MACRO_DATA.forEach(function (item) {
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
