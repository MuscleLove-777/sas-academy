/* ============================================
   SASプログラミングアカデミー - 基礎ページJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initBasicsContent();
});

function initBasicsContent() {
  var container = document.getElementById("basics-content");
  if (!container) return;

  var html = "";

  /* --- SASとは --- */
  html +=
    '<div class="concept-card" id="what-is-sas">' +
      '<h3>SASとは</h3>' +
      '<p>SAS（Statistical Analysis System）は、データ管理・統計解析・レポート作成のための統合ソフトウェアシステムです。1976年にSAS Institute（現SAS）により開発され、製薬業界・金融・政府機関など幅広い分野で利用されています。</p>' +
      '<h4 style="color: var(--color-primary-light); margin-top: 1.5rem;">臨床試験での位置づけ</h4>' +
      '<p>製薬業界では、SASは臨床試験データの解析における業界標準です。FDA（米国食品医薬品局）やPMDA（医薬品医療機器総合機構）への申請データの作成に広く使用されています。</p>' +
      '<ul style="list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem;">' +
        '<li style="margin-bottom: 0.5rem;">CDISC標準（SDTM/ADaM）に基づくデータセット作成</li>' +
        '<li style="margin-bottom: 0.5rem;">TLF（Table, Listing, Figure）の作成</li>' +
        '<li style="margin-bottom: 0.5rem;">統計解析の実行とバリデーション</li>' +
        '<li style="margin-bottom: 0.5rem;">FDA電子申請（eCTD）用データセットの準備</li>' +
      '</ul>' +
      '<div class="code-block">' +
        '<div class="code-block-header"><span class="lang-label">SAS</span><span>基本的なSASプログラム</span></div>' +
        '<pre>/* これはSASプログラムの基本形です */\n\n/* DATAステップ: データの作成・加工 */\nDATA work.sample;\n  SET sashelp.class;\n  WHERE age >= 14;\nRUN;\n\n/* PROCステップ: データの分析・出力 */\nPROC PRINT DATA=work.sample;\n  VAR name age sex height weight;\nRUN;</pre>' +
      '</div>' +
    '</div>';

  /* --- プログラム構成 --- */
  html +=
    '<div class="concept-card" id="program-structure">' +
      '<h3>SASプログラムの構成</h3>' +
      '<p>SASプログラムは主に3つの要素で構成されます。</p>' +

      '<div class="grid grid-3" style="margin: 1.5rem 0;">' +
        '<div class="card" style="border-top: 4px solid var(--color-primary);">' +
          '<h4 style="color: var(--color-primary);">DATA ステップ</h4>' +
          '<p class="text-sm">データの読み込み、作成、加工を行う。SASデータセットを入出力の単位として処理する。</p>' +
          '<div class="code-block"><pre>DATA work.output;\n  SET work.input;\n  /* データ加工処理 */\nRUN;</pre></div>' +
        '</div>' +
        '<div class="card" style="border-top: 4px solid var(--color-primary-light);">' +
          '<h4 style="color: var(--color-primary-light);">PROC ステップ</h4>' +
          '<p class="text-sm">データの分析、集計、レポート作成を行う。目的別に多数のPROCが用意されている。</p>' +
          '<div class="code-block"><pre>PROC MEANS DATA=work.input;\n  VAR height weight;\n  CLASS sex;\nRUN;</pre></div>' +
        '</div>' +
        '<div class="card" style="border-top: 4px solid var(--color-accent);">' +
          '<h4 style="color: var(--color-accent);">グローバルステートメント</h4>' +
          '<p class="text-sm">TITLE, FOOTNOTE, OPTIONS, LIBNAME等。DATA/PROCステップの外で指定し、以降の処理に影響する。</p>' +
          '<div class="code-block"><pre>TITLE "Study Report";\nFOOTNOTE "Confidential";\nOPTIONS NOCENTER;\nLIBNAME adam "/data";</pre></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  /* --- データセットの概念 --- */
  html +=
    '<div class="concept-card" id="dataset-concept">' +
      '<h3>データセットの概念</h3>' +
      '<p>SASデータセットは行（オブザベーション）と列（変数）で構成される2次元のデータ構造です。Excelのスプレッドシートや、リレーショナルデータベースのテーブルに相当します。</p>' +

      '<div class="grid grid-3" style="margin: 1.5rem 0;">' +
        '<div class="card text-center">' +
          '<div class="card-icon">&#x1F4CA;</div>' +
          '<h4>変数（Variable）</h4>' +
          '<p class="text-sm">列に相当。数値型（Numeric）と文字型（Character）の2種類。名前、型、長さ、ラベル、フォーマットの属性を持つ。</p>' +
        '</div>' +
        '<div class="card text-center">' +
          '<div class="card-icon">&#x1F4C4;</div>' +
          '<h4>オブザベーション（Obs）</h4>' +
          '<p class="text-sm">行に相当。1人の被験者、1回の来院、1つのイベント等の1レコードを表す。</p>' +
        '</div>' +
        '<div class="card text-center">' +
          '<div class="card-icon">&#x2699;&#xFE0F;</div>' +
          '<h4>PDV（Program Data Vector）</h4>' +
          '<p class="text-sm">DATA STEPの処理で使われるメモリ上の一時的な領域。1オブザベーションずつ処理される。自動変数（_N_, _ERROR_等）も含む。</p>' +
        '</div>' +
      '</div>' +

      '<div class="table-wrapper">' +
        '<table class="data-table">' +
          '<thead>' +
            '<tr><th>変数名</th><th>型</th><th>長さ</th><th>ラベル</th><th>例</th></tr>' +
          '</thead>' +
          '<tbody>' +
            '<tr><td data-label="変数名">USUBJID</td><td data-label="型">文字</td><td data-label="長さ">$20</td><td data-label="ラベル">Unique Subject ID</td><td data-label="例">001-001-0001</td></tr>' +
            '<tr><td data-label="変数名">AGE</td><td data-label="型">数値</td><td data-label="長さ">8</td><td data-label="ラベル">Age</td><td data-label="例">45</td></tr>' +
            '<tr><td data-label="変数名">SEX</td><td data-label="型">文字</td><td data-label="長さ">$1</td><td data-label="ラベル">Sex</td><td data-label="例">M</td></tr>' +
            '<tr><td data-label="変数名">TRTSDT</td><td data-label="型">数値</td><td data-label="長さ">8</td><td data-label="ラベル">Treatment Start Date</td><td data-label="例">15MAR2024 (DATE9.)</td></tr>' +
          '</tbody>' +
        '</table>' +
      '</div>' +
    '</div>';

  /* --- ライブラリとLIBNAME --- */
  html +=
    '<div class="concept-card" id="library">' +
      '<h3>ライブラリとLIBNAME</h3>' +
      '<p>SASライブラリは、SASデータセットを格納するディレクトリ（フォルダ）への参照名です。LIBNAMEステートメントでライブラリを定義し、<code>ライブラリ名.データセット名</code>の形式でアクセスします。</p>' +

      '<div class="code-block">' +
        '<div class="code-block-header"><span class="lang-label">SAS</span><span>ライブラリの定義と使用</span></div>' +
        '<pre>/* ライブラリの定義 */\nLIBNAME sdtm "/project/data/sdtm";\nLIBNAME adam "/project/data/adam";\nLIBNAME raw  "/project/data/raw";\n\n/* ライブラリ経由でデータセットにアクセス */\nPROC CONTENTS DATA=sdtm.dm;\nRUN;\n\n/* WORKライブラリ（一時ライブラリ）*/\n/* セッション終了時に自動削除 */\nDATA work.temp;  /* = DATA temp; と同じ */\n  SET sdtm.dm;\nRUN;</pre>' +
      '</div>' +

      '<div class="grid grid-2" style="margin-top: 1.5rem;">' +
        '<div class="card">' +
          '<h4 style="color: var(--color-primary);">WORK ライブラリ</h4>' +
          '<p class="text-sm">一時ライブラリ。セッション終了時に自動削除される。ライブラリ名を省略するとWORKが使用される。<code>DATA temp;</code> = <code>DATA work.temp;</code></p>' +
        '</div>' +
        '<div class="card">' +
          '<h4 style="color: var(--color-primary);">SASHELP ライブラリ</h4>' +
          '<p class="text-sm">SASが提供するサンプルデータセット。学習やテストに使用。<code>sashelp.class</code>（生徒の身体測定データ）が代表的。</p>' +
        '</div>' +
      '</div>' +
    '</div>';

  /* --- 基本的な入出力 --- */
  html +=
    '<div class="concept-card" id="io">' +
      '<h3>基本的な入出力</h3>' +
      '<p>SASでのデータの入出力方法を理解することは、プログラミングの第一歩です。</p>' +

      '<h4 style="color: var(--color-primary-light); margin-top: 1.5rem;">データの入力</h4>' +
      '<div class="code-block">' +
        '<div class="code-block-header"><span class="lang-label">SAS</span><span>データ入力の方法</span></div>' +
        '<pre>/* 方法1: DATALINES（インライン入力） */\nDATA work.patients;\n  INPUT subjid $ age sex $ weight;\n  DATALINES;\n001 45 M 72.5\n002 38 F 58.0\n003 52 M 80.3\n;\nRUN;\n\n/* 方法2: 外部ファイルから読み込み */\nDATA work.rawdata;\n  INFILE "/data/raw/patients.csv" DLM="," FIRSTOBS=2;\n  INPUT subjid $ age sex $ weight;\nRUN;\n\n/* 方法3: 既存のSASデータセットから */\nDATA work.subset;\n  SET sdtm.dm;\n  WHERE age >= 18;\nRUN;</pre>' +
      '</div>' +

      '<h4 style="color: var(--color-primary-light); margin-top: 1.5rem;">データの出力</h4>' +
      '<div class="code-block">' +
        '<div class="code-block-header"><span class="lang-label">SAS</span><span>データ出力の方法</span></div>' +
        '<pre>/* 画面/リストへの出力 */\nPROC PRINT DATA=work.patients;\nRUN;\n\n/* CSVファイルへの出力 */\nPROC EXPORT DATA=work.patients\n  OUTFILE="/output/patients.csv"\n  DBMS=CSV REPLACE;\nRUN;\n\n/* SASデータセットとして保存 */\nDATA adam.adsl;\n  SET work.adsl_final;\nRUN;</pre>' +
      '</div>' +
    '</div>';

  container.innerHTML = html;
}
