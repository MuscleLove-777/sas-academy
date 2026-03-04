/* ============================================
   SASプログラミングアカデミー - メインJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initHamburgerMenu();
  initNavDropdown();
  initRoadmapPreview();
  initSyntaxPreview();
  initTipsPreview();
  initSmoothScroll();
  initFadeInAnimation();
});

/* --- ハンバーガーメニュー開閉 --- */
function initHamburgerMenu() {
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobile-menu");

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    var isOpen = mobileMenu.classList.contains("active");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  var links = mobileMenu.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "メニューを開く");
      document.body.style.overflow = "";
    });
  });
}

/* --- デスクトップナビ ドロップダウン --- */
function initNavDropdown() {
  var dropdowns = document.querySelectorAll(".nav-dropdown");

  dropdowns.forEach(function (dropdown) {
    var toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdowns.forEach(function (other) {
        if (other !== dropdown) {
          other.classList.remove("active");
        }
      });
      dropdown.classList.toggle("active");
    });

    dropdown.addEventListener("mouseenter", function () {
      if (window.innerWidth >= 1024) {
        dropdown.classList.add("active");
      }
    });

    dropdown.addEventListener("mouseleave", function () {
      if (window.innerWidth >= 1024) {
        dropdown.classList.remove("active");
      }
    });
  });

  document.addEventListener("click", function () {
    dropdowns.forEach(function (dropdown) {
      dropdown.classList.remove("active");
    });
  });
}

/* --- ロードマップ プレビュー --- */
function initRoadmapPreview() {
  var container = document.getElementById("roadmap-preview");
  if (!container || typeof GUIDE_STEPS === "undefined") return;

  var html = "";
  GUIDE_STEPS.forEach(function (step) {
    html +=
      '<div class="card text-center">' +
        '<div class="card-icon" style="color: var(--color-primary); font-size: 2rem; font-weight: 700;">Step ' + step.step + '</div>' +
        '<h3 class="card-title">' + escapeHtml(step.title) + '</h3>' +
        '<p class="card-text">' + escapeHtml(step.description) + '</p>' +
        '<span class="badge badge-datastep">' + escapeHtml(step.duration) + '</span>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- 構文プレビュー（先頭4つ） --- */
function initSyntaxPreview() {
  var container = document.getElementById("syntax-cards");
  if (!container || typeof SYNTAX_BASICS === "undefined") return;

  var preview = SYNTAX_BASICS.slice(0, 4);
  var html = "";

  preview.forEach(function (item) {
    html +=
      '<div class="card">' +
        '<h3 class="card-title">' + escapeHtml(item.name) + '</h3>' +
        '<p class="card-text">' + escapeHtml(item.description).substring(0, 80) + '...</p>' +
        '<div class="code-block"><pre>' + escapeHtml(item.syntax) + '</pre></div>' +
        '<a href="datastep/index.html#' + item.id + '" class="card-link">詳細を見る &rarr;</a>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- TIPS プレビュー（先頭4つ） --- */
function initTipsPreview() {
  var container = document.getElementById("tips-cards");
  if (!container || typeof TIPS_DATA === "undefined") return;

  var preview = TIPS_DATA.slice(0, 4);
  var html = "";

  preview.forEach(function (item) {
    html +=
      '<div class="card tip-card">' +
        '<div class="tip-category">' + escapeHtml(item.category) + '</div>' +
        '<div class="tip-title">' + escapeHtml(item.title) + '</div>' +
        '<p class="card-text">' + escapeHtml(item.content) + '</p>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- スムーズスクロール --- */
function initSmoothScroll() {
  var links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href === "#") return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector(".site-header")
          ? document.querySelector(".site-header").offsetHeight
          : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });
}

/* --- フェードインアニメーション --- */
function initFadeInAnimation() {
  var fadeElements = document.querySelectorAll(".fade-in");
  if (fadeElements.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    fadeElements.forEach(function (el) {
      el.classList.add("visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });
}

/* --- ユーティリティ: HTMLエスケープ --- */
function escapeHtml(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* --- ユーティリティ: SASシンタックスハイライト --- */
function highlightSAS(code) {
  if (!code) return "";
  var escaped = escapeHtml(code);

  // コメント
  escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="sas-comment">$1</span>');

  // 文字列
  escaped = escaped.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;|"[^"]*?"|'[^']*?')/g, '<span class="sas-string">$1</span>');

  // マクロ
  escaped = escaped.replace(/(%[A-Z_]+)/gi, '<span class="sas-macro">$1</span>');
  escaped = escaped.replace(/(&amp;\w+\.?|&\w+\.?)/g, '<span class="sas-macro">$1</span>');

  // PROCキーワード
  escaped = escaped.replace(/\b(PROC\s+\w+)\b/gi, '<span class="sas-proc">$1</span>');

  // SASキーワード
  var keywords = ['DATA', 'RUN', 'QUIT', 'SET', 'MERGE', 'BY', 'IF', 'THEN', 'ELSE', 'DO', 'END',
    'OUTPUT', 'RETAIN', 'LENGTH', 'FORMAT', 'INFORMAT', 'LABEL', 'KEEP', 'DROP', 'WHERE',
    'ARRAY', 'INPUT', 'PUT', 'DELETE', 'RETURN', 'STOP', 'TITLE', 'FOOTNOTE', 'LIBNAME',
    'OPTIONS', 'ODS', 'CLASS', 'VAR', 'TABLES', 'SELECT', 'FROM', 'CREATE', 'TABLE', 'AS',
    'INTO', 'GROUP', 'ORDER', 'HAVING', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'JOIN', 'ON',
    'DISTINCT', 'COUNT', 'COLUMN', 'DEFINE', 'COMPUTE', 'NOPRINT', 'NOWD', 'DESCENDING',
    'NODUPKEY', 'NWAY', 'NOT', 'AND', 'OR', 'IN', 'MISSING', 'NULL', 'FIRST', 'LAST',
    'CALL', 'SYMPUT', 'SYMPUTX', 'VALUE', 'OTHER', 'LOW', 'HIGH', 'DATALINES', 'CARDS'];
  var kwRegex = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g');
  escaped = escaped.replace(kwRegex, '<span class="sas-keyword">$1</span>');

  // 数値
  escaped = escaped.replace(/\b(\d+\.?\d*)\b/g, '<span class="sas-number">$1</span>');

  return escaped;
}
