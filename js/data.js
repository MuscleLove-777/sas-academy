/* ============================================
   SASプログラミングアカデミー - データ定義
   ============================================ */

/* --- SAS基礎構文 --- */
var SYNTAX_BASICS = [
  {
    id: "datastep-basic",
    name: "DATA STEP 基本",
    category: "datastep",
    syntax: "DATA データセット名;\n  /* 処理 */\nRUN;",
    description: "SASの基本的なデータ処理単位。新しいデータセットを作成・加工する。PDV（Program Data Vector）を通じて1オブザベーションずつ処理される。",
    example: "DATA work.sample;\n  x = 1;\n  y = 'Hello';\n  z = x * 10;\nRUN;\n\nPROC PRINT DATA=work.sample;\nRUN;",
    output: "Obs    x    y        z\n 1     1    Hello    10",
    tips: "DATA _NULL_ を使うとデータセットを作成せずに処理だけ実行できる。レポート出力やマクロ変数の設定に便利。"
  },
  {
    id: "set-statement",
    name: "SET ステートメント",
    category: "datastep",
    syntax: "DATA 出力データセット;\n  SET 入力データセット;\nRUN;",
    description: "既存のデータセットを読み込む。複数データセットを指定すると縦結合（APPEND）になる。WHERE=やKEEP=などのデータセットオプションと組み合わせて使う。",
    example: "DATA work.male;\n  SET sashelp.class;\n  WHERE sex = 'M';\nRUN;\n\nPROC PRINT DATA=work.male;\nRUN;",
    output: "Obs    Name       Sex    Age    Height    Weight\n 1     Alfred      M      14     69.0      112.5\n 2     Henry       M      14     63.5      102.5\n 3     James       M      12     57.3       83.0\n ...",
    tips: "SET ds1 ds2; で2つのデータセットを縦に結合。NOBS=オプションでオブザベーション数を取得可能。"
  },
  {
    id: "merge-by",
    name: "MERGE / BY（横結合）",
    category: "datastep",
    syntax: "DATA 出力;\n  MERGE データセットA(IN=a)\n        データセットB(IN=b);\n  BY キー変数;\n  IF a AND b; /* Inner Join */\nRUN;",
    description: "BY変数をキーとして複数データセットを横結合する。IN=オプションでマッチ状況を判定し、結合タイプ（Inner/Left/Right/Full）を制御できる。事前にSORTが必要。",
    example: "PROC SORT DATA=adsl; BY usubjid; RUN;\nPROC SORT DATA=adae; BY usubjid; RUN;\n\nDATA work.ae_with_demo;\n  MERGE adsl(IN=a KEEP=usubjid age sex)\n        adae(IN=b);\n  BY usubjid;\n  IF a AND b;\nRUN;",
    output: "/* adslの人口統計情報とadaeの有害事象が\n   usubjidで結合されたデータセット */",
    tips: "MERGEの前に必ずBY変数でSORT。IN=変数を使いこなすことが臨床データ結合の基本。1:多の結合に注意。"
  },
  {
    id: "if-then-else",
    name: "IF-THEN / ELSE",
    category: "datastep",
    syntax: "IF 条件 THEN 処理;\nELSE IF 条件 THEN 処理;\nELSE 処理;",
    description: "条件分岐処理。SELECT-WHEN文でも同様の分岐が可能。臨床試験ではカテゴリ変数の導出（年齢グループ、BMIカテゴリ等）に頻繁に使用。",
    example: "DATA work.classified;\n  SET sashelp.class;\n  LENGTH agegrp $10;\n  IF age < 13 THEN agegrp = '<13';\n  ELSE IF age <= 14 THEN agegrp = '13-14';\n  ELSE agegrp = '>=15';\nRUN;",
    output: "Obs    Name       Age    agegrp\n 1     Alice       13     13-14\n 2     Barbara     13     13-14\n 3     Carol       14     13-14\n 4     Henry       14     13-14\n 5     Philip      16     >=15",
    tips: "WHERE文との違い: IFはPDV上で条件判定（読み込み後）、WHEREはデータセットから読み込む段階でフィルタ。WHEREの方がメモリ効率が良い。"
  },
  {
    id: "do-loop",
    name: "DO LOOP（反復処理）",
    category: "datastep",
    syntax: "DO 変数 = 開始 TO 終了 BY 増分;\n  /* 処理 */\nEND;",
    description: "反復処理を行う。DO WHILE / DO UNTIL も利用可能。シミュレーションデータの生成やアキュムレーション処理に使用。",
    example: "DATA work.visits;\n  DO visitnum = 1 TO 5;\n    visitdt = '01JAN2024'd + (visitnum - 1) * 28;\n    OUTPUT;\n  END;\n  FORMAT visitdt DATE9.;\nRUN;",
    output: "Obs    visitnum    visitdt\n 1        1       01JAN2024\n 2        2       29JAN2024\n 3        3       26FEB2024\n 4        4       25MAR2024\n 5        5       22APR2024",
    tips: "OUTPUT文を明示的に書かないとループ終了時に1回だけOUTPUT。ループ内でOUTPUTを書くと各反復で出力される。"
  },
  {
    id: "array",
    name: "ARRAY（配列）",
    category: "datastep",
    syntax: "ARRAY 配列名{次元} <$> <長さ> 変数リスト;\nDO i = 1 TO DIM(配列名);\n  /* 配列名{i} で参照 */\nEND;",
    description: "複数の変数をまとめて処理する仕組み。同じ処理を多数の変数に適用する場合に非常に効率的。臨床試験では複数の検査値やフラグの一括処理に活用。",
    example: "DATA work.converted;\n  SET sashelp.class;\n  ARRAY heights{1} height;\n  ARRAY weights{1} weight;\n  /* ポンド→キログラム、インチ→センチ */\n  height_cm = height * 2.54;\n  weight_kg = weight * 0.4536;\nRUN;",
    output: "Obs  Name     Height  Weight  height_cm  weight_kg\n 1   Alice     56.5    84.0    143.51     38.10\n 2   Barbara   65.3    98.0    165.86     44.45",
    tips: "ARRAY temp{7} mon1-mon7; のように連番変数を簡潔に指定可能。_TEMPORARY_ 配列はデータセットに出力されない一時変数。"
  },
  {
    id: "format-informat",
    name: "FORMAT / INFORMAT",
    category: "datastep",
    syntax: "FORMAT 変数 フォーマット名.;\nINFORMAT 変数 インフォーマット名.;",
    description: "FORMAT：データの表示形式を指定（内部値は変えない）。INFORMAT：外部データの読み込み形式を指定。臨床試験では日付処理（DATE9., IS8601DA.等）で必須。",
    example: "DATA work.dates;\n  visit_date = '15MAR2024'd;\n  FORMAT visit_date YYMMDD10.\n         visit_date DATE9.\n         visit_date IS8601DA.;\n  /* 同じ内部値を異なるフォーマットで表示 */\nRUN;\n\n/* 結果: 2024-03-15 / 15MAR2024 / 2024-03-15 */",
    output: "/* DATE9.    → 15MAR2024\n   YYMMDD10. → 2024-03-15\n   IS8601DA. → 2024-03-15\n   内部値は同じSAS日付値（23,450） */",
    tips: "CDISC準拠ではIS8601フォーマットが標準。ユーザー定義フォーマットはPROC FORMATで作成。"
  },
  {
    id: "input-put-functions",
    name: "INPUT / PUT 関数",
    category: "datastep",
    syntax: "数値 = INPUT(文字変数, インフォーマット.);\n文字 = PUT(数値変数, フォーマット.);",
    description: "INPUT関数：文字→数値への型変換。PUT関数：数値→文字への型変換。SASでは暗黙の型変換を避け、明示的にこれらの関数を使うことが推奨される。",
    example: "DATA work.convert;\n  char_age = '25';\n  num_age = INPUT(char_age, BEST.);\n\n  num_visit = 3;\n  char_visit = PUT(num_visit, Z2.);\n  /* char_visit = '03' */\nRUN;",
    output: "Obs  char_age  num_age  num_visit  char_visit\n 1   25        25       3          03",
    tips: "型変換の警告（NOTE: Numeric to character conversion）はINPUT/PUT関数で解消できる。不完全な日付文字列の変換にはANYDTDTE.インフォーマットが便利。"
  },
  {
    id: "retain",
    name: "RETAIN（値の保持）",
    category: "datastep",
    syntax: "RETAIN 変数 <初期値>;",
    description: "DATA STEPでは通常、各オブザベーション処理の開始時に変数がリセットされるが、RETAINで宣言するとPDV上の値を次のオブザベーションに引き継ぐ。累積計算やLOCF処理に必須。",
    example: "DATA work.cumulative;\n  SET sashelp.class;\n  BY sex;\n  RETAIN cum_count 0;\n  IF FIRST.sex THEN cum_count = 0;\n  cum_count + 1;\n  /* SUM文 (cum_count + 1) は暗黙的にRETAIN */\nRUN;",
    output: "Obs  Name      Sex  cum_count\n 1   Alice      F      1\n 2   Barbara    F      2\n 3   Carol      F      3\n ...\n 10  Alfred     M      1\n 11  Henry      M      2",
    tips: "SUM文（変数 + 値;）は暗黙的にRETAIN＋初期値0を設定する便利な記法。FIRST./LAST.変数と組み合わせてグループ内の累積処理が可能。"
  },
  {
    id: "length-statement",
    name: "LENGTH ステートメント",
    category: "datastep",
    syntax: "LENGTH 変数 <$> 長さ;",
    description: "変数の長さ（バイト数）を明示的に指定する。文字変数は$付き。DATA STEP冒頭で指定することで変数の格納長を制御し、切り捨てを防ぐ。",
    example: "DATA work.demo;\n  LENGTH subjid $20 trt $50 age 8;\n  subjid = '001-001-0001';\n  trt = 'Investigational Drug 100mg';\n  age = 45;\nRUN;",
    output: "Obs  subjid          trt                         age\n 1   001-001-0001    Investigational Drug 100mg   45",
    tips: "LENGTH文はDATA STEPの最初に書くのがベスト。後から書くと既に長さが決定されている場合がある。変数の出力順序にも影響する。"
  },
  {
    id: "first-last",
    name: "FIRST. / LAST.（BY処理）",
    category: "datastep",
    syntax: "DATA 出力;\n  SET 入力;\n  BY グループ変数;\n  IF FIRST.グループ変数 THEN /* グループ先頭 */;\n  IF LAST.グループ変数 THEN /* グループ末尾 */;",
    description: "BY処理で各グループの最初/最後のオブザベーションを判定する自動変数。BY変数でソート済みが前提。臨床試験ではベースライン/最終値の特定に頻繁に使用。",
    example: "PROC SORT DATA=work.vitals;\n  BY usubjid visitnum;\nRUN;\n\nDATA work.baseline;\n  SET work.vitals;\n  BY usubjid;\n  IF FIRST.usubjid;\n  /* 各被験者の最初のレコードのみ保持 */\nRUN;",
    output: "/* 各被験者(usubjid)の最初の来院データのみが\n   出力される */",
    tips: "FIRST.とLAST.は同時にTRUE（=1）になることもある（グループに1レコードしかない場合）。複数BY変数ではネストされた判定になる。"
  },
  {
    id: "output-statement",
    name: "OUTPUT ステートメント",
    category: "datastep",
    syntax: "OUTPUT <データセット名>;",
    description: "現在のPDVの内容をデータセットに明示的に出力する。OUTPUT文がない場合、DATA STEPの末尾で自動的に出力される。複数データセットへの振り分けやDOループ内での出力に使用。",
    example: "DATA work.high work.low;\n  SET sashelp.class;\n  IF height >= 60 THEN OUTPUT work.high;\n  ELSE OUTPUT work.low;\nRUN;\n\nPROC PRINT DATA=work.high(OBS=3);\nRUN;",
    output: "/* work.high: 身長60以上 */\nObs  Name      Height  Weight\n 1   Alfred     69.0   112.5\n 2   Barbara    65.3    98.0\n 3   Henry      63.5   102.5",
    tips: "1つのDATA STEPで複数のデータセットを作成する場合は明示的なOUTPUT文が必要。条件に合致しないレコードはどこにも出力されないので注意。"
  }
];

/* --- 主要PROC --- */
var PROC_DATA = [
  {
    id: "proc-sort",
    name: "PROC SORT",
    category: "data",
    purpose: "データセットのソート（並び替え）",
    syntax: "PROC SORT DATA=データセット <OUT=出力先>\n          <NODUPKEY> <DUPOUT=重複先>;\n  BY <DESCENDING> 変数;\nRUN;",
    commonOptions: [
      "NODUPKEY - BY変数の重複を削除",
      "NODUPRECS - 完全重複レコードを削除",
      "DUPOUT= - 削除された重複を出力",
      "OUT= - ソート結果の出力先",
      "DESCENDING - 降順ソート"
    ],
    example: "/* 被験者・来院でソート、重複除外 */\nPROC SORT DATA=work.vitals\n          OUT=work.vitals_sorted\n          NODUPKEY\n          DUPOUT=work.vitals_dup;\n  BY usubjid visitnum;\nRUN;",
    output: "NOTE: 150 observations were read.\nNOTE: 5 duplicate observations were deleted.\nNOTE: 145 observations written to work.vitals_sorted.\nNOTE: 5 observations written to work.vitals_dup.",
    clinicalUse: "MERGE前の事前ソート、重複チェック（NODUPKEY + DUPOUT）、データクリーニングの基本操作。全てのBY処理の前提条件。"
  },
  {
    id: "proc-freq",
    name: "PROC FREQ",
    category: "statistics",
    purpose: "度数分布表・クロス集計表の作成",
    syntax: "PROC FREQ DATA=データセット;\n  TABLES 変数 / オプション;\n  TABLES 行変数 * 列変数 / CHISQ;\nRUN;",
    commonOptions: [
      "NOCUM - 累積統計量を非表示",
      "NOPERCENT - パーセントを非表示",
      "NOROW / NOCOL - 行/列パーセント非表示",
      "CHISQ - カイ二乗検定",
      "FISHER - Fisher正確検定",
      "OUT= - 度数テーブルを出力",
      "ORDER=FREQ - 度数順に並べ替え"
    ],
    example: "/* 治療群別有害事象発現率 */\nPROC FREQ DATA=work.adae;\n  TABLES trta * aesev / CHISQ NOROW NOCOL;\n  WHERE saffl = 'Y';\nRUN;\n\n/* 度数テーブルをデータセットに出力 */\nPROC FREQ DATA=work.adsl NOPRINT;\n  TABLES trta * sex / OUT=work.demo_freq;\nRUN;",
    output: "Table of trta by aesev\n\n              aesev\ntrta      MILD  MODERATE  SEVERE  Total\nDrug A      25       12       3     40\nPlacebo     18        8       2     28\nTotal       43       20       5     68",
    clinicalUse: "人口統計テーブルのカテゴリ変数集計、有害事象テーブル、カイ二乗検定/Fisher検定によるp値算出。NOPRINTで結果をデータセットに出力し後処理に使用。"
  },
  {
    id: "proc-means",
    name: "PROC MEANS / SUMMARY",
    category: "statistics",
    purpose: "記述統計量（平均値・標準偏差・中央値等）の算出",
    syntax: "PROC MEANS DATA=データセット\n  N MEAN STD MEDIAN MIN MAX;\n  CLASS グループ変数;\n  VAR 分析変数;\n  OUTPUT OUT=出力データセット;\nRUN;",
    commonOptions: [
      "N - 非欠測オブザベーション数",
      "MEAN - 平均値",
      "STD - 標準偏差",
      "MEDIAN - 中央値",
      "MIN / MAX - 最小値/最大値",
      "Q1 / Q3 - 四分位数",
      "CLM - 平均の信頼区間",
      "MAXDEC= - 小数点以下桁数",
      "NWAY - 最も詳細なクラス組合せのみ"
    ],
    example: "/* 治療群別のバイタルサイン要約統計 */\nPROC MEANS DATA=work.advs NWAY NOPRINT;\n  CLASS trta visitnum;\n  VAR aval;\n  OUTPUT OUT=work.vs_stats\n    N=n MEAN=mean STD=std\n    MEDIAN=median MIN=min MAX=max;\nRUN;",
    output: "trta      visitnum  n   mean    std    median  min    max\nDrug A       1      50  120.5   15.3   119.0   90.0   158.0\nDrug A       2      48  118.2   14.1   117.5   88.0   152.0\nPlacebo      1      50  121.0   16.0   120.0   89.0   160.0\nPlacebo      2      49  120.8   15.8   120.0   88.0   159.0",
    clinicalUse: "連続変数の要約統計（人口統計テーブルの年齢・BMI、有効性エンドポイント等）。PROC SUMMARYはPROC MEANSとほぼ同等だがデフォルトでNOPRINT。"
  },
  {
    id: "proc-print",
    name: "PROC PRINT",
    category: "report",
    purpose: "データセットの内容をリスト形式で表示",
    syntax: "PROC PRINT DATA=データセット <(OBS=n)>\n  <NOOBS> <LABEL>;\n  VAR 変数リスト;\n  WHERE 条件;\nRUN;",
    commonOptions: [
      "NOOBS - オブザベーション番号を非表示",
      "LABEL - 変数ラベルをヘッダーに使用",
      "OBS=n - 先頭nオブザベーションのみ",
      "VAR - 表示する変数を指定",
      "WHERE - 表示条件の指定",
      "BY - グループごとに区切って表示",
      "SUM - 合計行を追加"
    ],
    example: "PROC PRINT DATA=work.adsl(OBS=10) NOOBS LABEL;\n  VAR usubjid age sex race trta;\n  WHERE saffl = 'Y';\nRUN;",
    output: "Subject    Age  Sex  Race      Treatment\n001-001     45   M    WHITE     Drug A\n001-002     38   F    ASIAN     Placebo\n001-003     52   M    BLACK     Drug A\n...",
    clinicalUse: "データ確認・デバッグの基本ツール。リスティング（被験者一覧、AE一覧等）の作成にも使用。OBS=オプションで大量データの先頭だけを確認。"
  },
  {
    id: "proc-report",
    name: "PROC REPORT",
    category: "report",
    purpose: "カスタマイズ可能な帳票・テーブルの作成",
    syntax: "PROC REPORT DATA=データセット NOWD;\n  COLUMN 変数リスト;\n  DEFINE 変数 / タイプ オプション;\n  COMPUTE ブロック;\nRUN;",
    commonOptions: [
      "NOWD - ウィンドウモード無効",
      "COLUMN - 表示列の定義",
      "DEFINE / DISPLAY - 表示列",
      "DEFINE / GROUP - グループ化",
      "DEFINE / ANALYSIS - 分析（統計量算出）",
      "DEFINE / ACROSS - クロス方向展開",
      "COMPUTE - 計算列の追加",
      "BREAK / RBREAK - 小計・合計行"
    ],
    example: "PROC REPORT DATA=work.demo_summary NOWD;\n  COLUMN trta category stat_value;\n  DEFINE trta / GROUP 'Treatment';\n  DEFINE category / GROUP 'Category';\n  DEFINE stat_value / DISPLAY 'Value';\nRUN;",
    output: "Treatment   Category        Value\nDrug A      Age, Mean(SD)   45.2 (12.3)\n            Sex, n(%)       \n              Male           25 (50.0%)\n              Female         25 (50.0%)\nPlacebo     Age, Mean(SD)   44.8 (11.9)\n            Sex, n(%)       \n              Male           24 (48.0%)\n              Female         26 (52.0%)",
    clinicalUse: "TLF（Table, Listing, Figure）作成の中核PROC。RTFやPDF出力と組み合わせて臨床試験の正式な帳票を作成。COMPUTEブロックでセル単位のカスタマイズが可能。"
  },
  {
    id: "proc-transpose",
    name: "PROC TRANSPOSE",
    category: "data",
    purpose: "データセットの行列転置（縦持ち/横持ち変換）",
    syntax: "PROC TRANSPOSE DATA=入力 OUT=出力\n  <PREFIX=接頭辞> <NAME=名前変数>;\n  BY グループ変数;\n  ID 転置後の変数名に使う変数;\n  VAR 転置する変数;\nRUN;",
    commonOptions: [
      "OUT= - 出力データセット名",
      "PREFIX= - 転置後の変数名接頭辞",
      "NAME= - 元の変数名を格納する変数名",
      "LABEL= - 元のラベルを格納する変数名",
      "ID - 転置後の列名に使用する変数",
      "BY - グループ化変数",
      "VAR - 転置対象の変数"
    ],
    example: "/* 縦持ち→横持ち変換 */\nPROC TRANSPOSE DATA=work.vs_long\n  OUT=work.vs_wide(DROP=_NAME_)\n  PREFIX=visit;\n  BY usubjid paramcd;\n  ID visitnum;\n  VAR aval;\nRUN;",
    output: "usubjid    paramcd  visit1   visit2   visit3\n001-001    SYSBP    120.0    118.5    116.0\n001-001    DIABP     80.0     78.0     76.0\n001-002    SYSBP    130.0    125.0    122.0",
    clinicalUse: "ADaM BDS構造（縦持ち）からテーブル出力用の横持ちへの変換。来院ごとのデータを横に展開する場合に必須。"
  },
  {
    id: "proc-sql",
    name: "PROC SQL",
    category: "data",
    purpose: "SQLによるデータ操作・結合・集計",
    syntax: "PROC SQL;\n  CREATE TABLE 出力 AS\n  SELECT 列\n  FROM テーブル\n  WHERE 条件\n  GROUP BY グループ\n  HAVING 集計条件\n  ORDER BY ソート;\nQUIT;",
    commonOptions: [
      "CREATE TABLE AS - 結果をデータセットに保存",
      "SELECT DISTINCT - 重複排除",
      "INNER/LEFT/RIGHT/FULL JOIN - 結合",
      "GROUP BY - グループ化",
      "HAVING - グループ条件",
      "CALCULATED - SELECT内で定義した変数を参照",
      "INTO : - マクロ変数への格納",
      "CASE WHEN - 条件分岐"
    ],
    example: "PROC SQL;\n  CREATE TABLE work.ae_summary AS\n  SELECT\n    a.trta,\n    b.aebodsys,\n    b.aedecod,\n    COUNT(DISTINCT b.usubjid) AS n_subj,\n    CALCULATED n_subj / a.n_total * 100\n      AS pct FORMAT=5.1\n  FROM\n    (SELECT trta, COUNT(DISTINCT usubjid) AS n_total\n     FROM work.adsl\n     WHERE saffl='Y'\n     GROUP BY trta) a\n  INNER JOIN work.adae b\n    ON a.trta = b.trta\n  GROUP BY a.trta, b.aebodsys, b.aedecod\n  ORDER BY a.trta, n_subj DESC;\nQUIT;",
    output: "trta      aebodsys              aedecod          n_subj   pct\nDrug A    Gastrointestinal      Nausea              12    24.0\nDrug A    Gastrointestinal      Vomiting             8    16.0\nDrug A    Nervous system        Headache            15    30.0\nPlacebo   Gastrointestinal      Nausea               6    12.0",
    clinicalUse: "複雑な結合（MERGEが面倒な場合）、サブクエリによる集計、マクロ変数への値格納（INTO :）。SQLに慣れた人には可読性が高い。"
  },
  {
    id: "proc-format",
    name: "PROC FORMAT",
    category: "data",
    purpose: "ユーザー定義フォーマットの作成",
    syntax: "PROC FORMAT;\n  VALUE フォーマット名\n    値 = 'ラベル'\n    値 = 'ラベル';\n  VALUE $文字フォーマット名\n    '値' = 'ラベル';\nRUN;",
    commonOptions: [
      "VALUE - 数値フォーマット定義",
      "VALUE $ - 文字フォーマット定義",
      "LOW-HIGH - 範囲指定",
      "OTHER - その他の値",
      "CNTLIN= - データセットからフォーマット作成",
      "LIBRARY= - フォーマット格納先",
      "FMTLIB - フォーマット一覧表示"
    ],
    example: "PROC FORMAT;\n  VALUE agegrpf\n    LOW-<18  = '<18'\n    18-<65   = '18-64'\n    65-HIGH  = '>=65';\n  VALUE $sexf\n    'M' = 'Male'\n    'F' = 'Female';\n  VALUE $ynf\n    'Y' = 'Yes'\n    'N' = 'No';\nRUN;\n\nDATA work.adsl;\n  SET work.adsl;\n  FORMAT agegr1 agegrpf. sex $sexf.;",
    output: "/* agegr1の値:\n   17 → '<18'\n   45 → '18-64'\n   70 → '>=65'\n   sexの値:\n   'M' → 'Male'\n   'F' → 'Female' */",
    clinicalUse: "CDISC Controlled Terminologyに基づく表示値の定義、テーブル出力用のカテゴリラベル作成。CNTLINオプションでメタデータからフォーマットを自動生成。"
  },
  {
    id: "proc-compare",
    name: "PROC COMPARE",
    category: "data",
    purpose: "2つのデータセットの比較・差異検出",
    syntax: "PROC COMPARE\n  BASE=ベースデータセット\n  COMPARE=比較データセット\n  <LISTALL> <CRITERION=許容値>;\n  ID キー変数;\nRUN;",
    commonOptions: [
      "LISTALL - 全差異をリスト表示",
      "CRITERION= - 数値の許容差（デフォルト0.00001）",
      "METHOD= - 比較方法",
      "ID - レコードの対応付け変数",
      "OUT= - 差異をデータセットに出力",
      "OUTNOEQUAL - 差異のあるレコードのみ出力",
      "TRANSPOSE - 差異をレコード形式で出力"
    ],
    example: "/* QCプログラムとの比較 */\nPROC COMPARE\n  BASE=work.t_14_1_1\n  COMPARE=qc.t_14_1_1\n  LISTALL CRITERION=0.0001;\n  ID usubjid trta;\nRUN;",
    output: "Number of Observations: 150 vs 150\nNumber of Variables: 12 vs 12\n\nAll values compared are exactly equal.",
    clinicalUse: "QC（品質管理）のダブルプログラミングで必須。プログラマーとQCプログラマーの出力を比較し、一致を確認。CRITERIONオプションで浮動小数点誤差を許容。"
  },
  {
    id: "proc-contents",
    name: "PROC CONTENTS",
    category: "data",
    purpose: "データセットのメタデータ（構造情報）を表示",
    syntax: "PROC CONTENTS DATA=データセット\n  <OUT=出力> <VARNUM> <SHORT>;\nRUN;",
    commonOptions: [
      "VARNUM - 変数を作成順に表示",
      "SHORT - 変数名のみ簡易表示",
      "OUT= - メタデータをデータセットに出力",
      "NODS - データセット一覧（ライブラリ指定時）",
      "DIRECTORY - ライブラリ内の全データセット情報",
      "MEMTYPE= - メンバタイプの指定"
    ],
    example: "PROC CONTENTS DATA=work.adsl VARNUM;\nRUN;\n\n/* ライブラリ全体の確認 */\nPROC CONTENTS DATA=adam._ALL_ NODS;\nRUN;",
    output: "Data Set Name: WORK.ADSL\nObservations: 150\nVariables: 25\n\n#  Variable   Type  Len  Format     Label\n1  STUDYID    Char   12             Study Identifier\n2  USUBJID    Char   20             Unique Subject ID\n3  SUBJID     Char    8             Subject ID\n4  AGE        Num     8             Age\n5  SEX        Char    1  $SEXf.     Sex",
    clinicalUse: "define.xmlとの整合性確認、変数のラベル・フォーマット・長さの確認、データセット構造の文書化。CDISC準拠の確認作業に必須。"
  }
];

/* --- マクロ基礎 --- */
var MACRO_DATA = [
  {
    id: "macro-let",
    name: "%LET（マクロ変数の定義）",
    syntax: "%LET マクロ変数名 = 値;",
    description: "マクロ変数を定義・値を代入する。マクロ変数は&で参照。プログラム全体で使う定数（試験番号、カットオフ日等）を一元管理するのに使用。",
    example: "%LET study = ABC-001;\n%LET cutoff = 15MAR2024;\n%LET trtvar = trta;\n\nTITLE \"Study &study - Data Cutoff: &cutoff\";\n\nPROC FREQ DATA=work.adsl;\n  TABLES &trtvar * sex;\nRUN;",
    tips: "マクロ変数の値にはクォートを含めない（%LET x = Hello; であり %LET x = 'Hello'; ではない）。&変数名. のピリオドは区切り記号。"
  },
  {
    id: "macro-def",
    name: "%MACRO / %MEND（マクロ定義）",
    syntax: "%MACRO マクロ名(パラメータ=デフォルト値);\n  /* SASコード */\n%MEND マクロ名;",
    description: "再利用可能なコードブロックをマクロとして定義。パラメータで動的に値を変更可能。臨床試験では各テーブル・リスティングの共通テンプレートをマクロ化する。",
    example: "%MACRO freq_table(inds=, var=, trtvar=trta);\n  PROC FREQ DATA=&inds NOPRINT;\n    TABLES &trtvar * &var / OUT=work._freq;\n  RUN;\n\n  PROC REPORT DATA=work._freq NOWD;\n    COLUMN &var &trtvar count percent;\n    DEFINE &var / GROUP;\n    DEFINE &trtvar / ACROSS;\n  RUN;\n%MEND freq_table;\n\n%freq_table(inds=work.adsl, var=sex);",
    tips: "パラメータには位置パラメータ（カンマ区切り）とキーワードパラメータ（名前=デフォルト値）がある。キーワードパラメータを推奨。"
  },
  {
    id: "macro-variable-ref",
    name: "&マクロ変数参照",
    syntax: "&マクロ変数名\n&&間接参照\n&マクロ変数名.",
    description: "マクロ変数の値を参照（解決）する。&は1レベルの解決、&&は2レベルの間接参照。ピリオド(.)は区切り文字として使い、変数名の終端を明示する。",
    example: "%LET dsname = adsl;\n%LET lib = adam;\n\n/* 基本参照 */\nPROC PRINT DATA=&lib..&dsname;\nRUN;\n/* → PROC PRINT DATA=adam.adsl; */\n\n/* 間接参照 */\n%LET var1 = age;\n%LET var2 = sex;\n%DO i = 1 %TO 2;\n  %PUT &&var&i;  /* var1→age, var2→sex */\n%END;",
    tips: "ライブラリ.データセットの参照では &lib..&ds のようにピリオドが2つ必要（1つ目はマクロ変数の区切り、2つ目はSASの区切り）。"
  },
  {
    id: "macro-if",
    name: "%IF / %THEN / %ELSE",
    syntax: "%IF 条件 %THEN %DO;\n  /* 処理 */\n%END;\n%ELSE %DO;\n  /* 処理 */\n%END;",
    description: "マクロ内での条件分岐。コンパイル時に評価され、実行するSASコードを動的に切り替える。DATA STEPのIF文とは異なり、マクロプロセッサが処理する。",
    example: "%MACRO report(type=);\n  %IF &type = SAFETY %THEN %DO;\n    TITLE 'Safety Analysis';\n    PROC FREQ DATA=work.adae;\n      TABLES aebodsys * aedecod;\n    RUN;\n  %END;\n  %ELSE %IF &type = EFFICACY %THEN %DO;\n    TITLE 'Efficacy Analysis';\n    PROC MEANS DATA=work.adeff;\n      VAR chg;\n      CLASS trta;\n    RUN;\n  %END;\n%MEND;\n\n%report(type=SAFETY);",
    tips: "%IF文はマクロ内でのみ使用可能（オープンコードでは使えない、SAS 9.4M5以降では%IF文のオープンコード使用が可能）。"
  },
  {
    id: "macro-do",
    name: "%DO ループ",
    syntax: "%DO i = 1 %TO n;\n  /* 処理 */\n%END;\n\n%DO %WHILE(条件);\n%DO %UNTIL(条件);",
    description: "マクロ内での反復処理。同じ構造のテーブルを複数パラメータで繰り返し生成する場合に使用。%DO %WHILEや%DO %UNTILも利用可能。",
    example: "%MACRO multi_table;\n  %LET params = SYSBP DIABP PULSE TEMP;\n  %LET n = 4;\n\n  %DO i = 1 %TO &n;\n    %LET param = %SCAN(&params, &i, %STR( ));\n\n    PROC MEANS DATA=work.advs NWAY;\n      WHERE paramcd = \"&param\";\n      CLASS trta visitnum;\n      VAR aval chg;\n      OUTPUT OUT=work.stats_&param;\n    RUN;\n  %END;\n%MEND;\n\n%multi_table;",
    tips: "%SCAN関数でリストから要素を取得。%SYSFUNC()でDATA STEP関数をマクロ内で使用可能。"
  },
  {
    id: "call-symput",
    name: "CALL SYMPUT / SYMPUTX",
    syntax: "CALL SYMPUT('マクロ変数名', 値);\nCALL SYMPUTX('マクロ変数名', 値, 'G');",
    description: "DATA STEP内からマクロ変数に値を設定する。SYMPUTXは先頭・末尾の空白を自動除去。第3引数でスコープ（G:グローバル, L:ローカル）を指定可能。",
    example: "/* 被験者数をマクロ変数に格納 */\nDATA _NULL_;\n  SET work.adsl NOBS=nobs;\n  CALL SYMPUTX('total_n', nobs);\n  STOP;\nRUN;\n\n%PUT Total subjects: &total_n;\n\n/* 治療群ごとのN数 */\nPROC SQL NOPRINT;\n  SELECT COUNT(DISTINCT usubjid)\n  INTO :n_drug, :n_placebo\n  FROM work.adsl\n  WHERE saffl = 'Y'\n  GROUP BY trta;\nQUIT;",
    tips: "CALL SYMPUTはDATA STEP実行後に値が確定するため、同一DATA STEP内では参照不可。SYMPUTXの方が扱いやすい。"
  },
  {
    id: "proc-sql-into",
    name: "PROC SQL INTO:（SQLからマクロ変数へ）",
    syntax: "PROC SQL NOPRINT;\n  SELECT 列\n  INTO :マクロ変数\n  FROM テーブル\n  WHERE 条件;\nQUIT;",
    description: "PROC SQLの結果をマクロ変数に格納。複数値をカンマ区切りで格納したり、動的なIN句を生成したりできる。NOPRINTで出力を抑制。",
    example: "/* 複数値をマクロ変数に格納 */\nPROC SQL NOPRINT;\n  SELECT DISTINCT usubjid\n  INTO :subj_list SEPARATED BY \"', '\"\n  FROM work.adae\n  WHERE aeser = 'Y';\nQUIT;\n\n/* 動的なIN句で使用 */\nPROC PRINT DATA=work.adsl;\n  WHERE usubjid IN (\"&subj_list\");\nRUN;\n\n/* カウントの格納 */\nPROC SQL NOPRINT;\n  SELECT COUNT(DISTINCT usubjid)\n  INTO :n_ae TRIMMED\n  FROM work.adae;\nQUIT;",
    tips: "SEPARATED BYで複数値を1つのマクロ変数に連結。TRIMMEDオプションで前後空白を除去（SAS 9.4以降）。"
  },
  {
    id: "macro-debug",
    name: "マクロデバッグ",
    syntax: "OPTIONS MPRINT MLOGIC SYMBOLGEN;\n\n%PUT _ALL_;     /* 全マクロ変数を表示 */\n%PUT _LOCAL_;   /* ローカル変数のみ */\n%PUT _GLOBAL_;  /* グローバル変数のみ */",
    description: "マクロのデバッグに使用するオプションとツール。MPRINT（生成コード表示）、MLOGIC（マクロロジック追跡）、SYMBOLGEN（マクロ変数解決表示）で問題を特定。",
    example: "OPTIONS MPRINT MLOGIC SYMBOLGEN;\n\n%MACRO test(ds=, var=);\n  %PUT NOTE: Processing dataset=&ds variable=&var;\n\n  %IF &ds = %THEN %DO;\n    %PUT ERROR: Dataset not specified;\n    %RETURN;\n  %END;\n\n  PROC MEANS DATA=&ds;\n    VAR &var;\n  RUN;\n%MEND;\n\n%test(ds=work.adsl, var=age);\n\n/* デバッグ後はオプションをオフに */\nOPTIONS NOMPRINT NOMLOGIC NOSYMBOLGEN;",
    tips: "本番環境ではMPRINT等をオフにすること（ログが膨大になる）。%PUT ERROR: でカスタムエラーメッセージを出力可能。"
  }
];

/* --- 臨床試験パターン --- */
var CLINICAL_PATTERNS = [
  {
    id: "adsl-creation",
    name: "ADSL（被験者レベルデータセット）作成",
    description: "ADaM ADSLは全ての臨床試験解析の基盤。人口統計、治療情報、フラグ変数を含む被験者レベルのデータセット。SDTMのDM, DS, EX, SV等から導出。",
    code: "/* ===== ADSL作成の基本パターン ===== */\n\n/* 1. DMドメインからベース取得 */\nPROC SORT DATA=sdtm.dm OUT=work.dm;\n  BY usubjid;\nRUN;\n\n/* 2. 治療情報の導出(EXドメイン) */\nPROC SQL;\n  CREATE TABLE work.trt AS\n  SELECT usubjid,\n    MIN(exstdtc) AS trtsdt FORMAT=DATE9.,\n    MAX(exendtc) AS trtedt FORMAT=DATE9.\n  FROM sdtm.ex\n  WHERE exdose > 0\n  GROUP BY usubjid;\nQUIT;\n\n/* 3. ADSL作成 */\nDATA adam.adsl;\n  MERGE work.dm(IN=a)\n        work.trt(IN=b);\n  BY usubjid;\n  IF a;\n\n  /* 年齢グループ */\n  LENGTH agegr1 $10;\n  IF age < 18 THEN agegr1 = '<18';\n  ELSE IF age < 65 THEN agegr1 = '18-64';\n  ELSE agegr1 = '>=65';\n\n  /* Safety Flag */\n  IF b AND NOT MISSING(trtsdt) THEN saffl = 'Y';\n  ELSE saffl = 'N';\n\n  /* ITT Flag */\n  IF NOT MISSING(randdt) THEN ittfl = 'Y';\n  ELSE ittfl = 'N';\n\n  LABEL\n    agegr1 = 'Age Group'\n    saffl  = 'Safety Population Flag'\n    ittfl  = 'Intent-to-Treat Population Flag'\n    trtsdt = 'Date of First Exposure to Treatment'\n    trtedt = 'Date of Last Exposure to Treatment';\nRUN;",
    explanation: "ADSLはADaMの中核データセット。SDTMの各ドメイン（DM, EX, DS等）からMERGE/SQLで結合し、導出変数（年齢グループ、各種フラグ等）を追加する。全ての解析データセット作成時にADSLとマージして人口統計情報を付加する。"
  },
  {
    id: "adae-creation",
    name: "ADAE（有害事象解析データセット）作成",
    description: "有害事象の解析用データセット。SDTMのAEドメインにADSLの情報を付加し、治療との時間関係（TRTEMFL）、重症度、因果関係等の導出変数を追加。",
    code: "/* ===== ADAE作成パターン ===== */\nPROC SORT DATA=sdtm.ae OUT=work.ae;\n  BY usubjid;\nRUN;\n\nDATA adam.adae;\n  MERGE work.ae(IN=a)\n        adam.adsl(IN=b KEEP=usubjid age sex race\n          trta trtsdt trtedt saffl);\n  BY usubjid;\n  IF a AND b;\n\n  /* 日付の数値変換 */\n  IF LENGTH(aestdtc) >= 10 THEN\n    astdt = INPUT(aestdtc, E8601DA.);\n  IF LENGTH(aeendtc) >= 10 THEN\n    aendt = INPUT(aeendtc, E8601DA.);\n  FORMAT astdt aendt DATE9.;\n\n  /* Treatment Emergent Flag */\n  IF NOT MISSING(astdt) AND NOT MISSING(trtsdt) THEN DO;\n    IF astdt >= trtsdt THEN trtemfl = 'Y';\n    ELSE trtemfl = 'N';\n  END;\n\n  /* 重症度の数値変換 */\n  IF UPCASE(aesev) = 'MILD' THEN aesevn = 1;\n  ELSE IF UPCASE(aesev) = 'MODERATE' THEN aesevn = 2;\n  ELSE IF UPCASE(aesev) = 'SEVERE' THEN aesevn = 3;\n\n  /* 安全性解析対象のみ */\n  IF saffl = 'Y';\n\n  LABEL\n    astdt   = 'Analysis Start Date'\n    aendt   = 'Analysis End Date'\n    trtemfl = 'Treatment Emergent Flag'\n    aesevn  = 'Severity (N)';\nRUN;",
    explanation: "ADAEはAEドメインをベースにADSLの情報をマージ。Treatment Emergent（投与開始後に発現）の判定、日付変換、重症度の数値化が主な導出ロジック。安全性解析の基盤となるデータセット。"
  },
  {
    id: "demog-table",
    name: "人口統計テーブル（Table 14.1.1）",
    description: "被験者の人口統計情報（年齢、性別、人種等）を治療群別に集計するテーブル。連続変数はN/Mean/SD/Median/Min/Max、カテゴリ変数はn(%)で表示。",
    code: "/* ===== 人口統計テーブル作成パターン ===== */\n\n/* 治療群ごとのN数取得 */\nPROC SQL NOPRINT;\n  SELECT COUNT(DISTINCT usubjid)\n  INTO :n_total, :n_drug, :n_placebo\n  FROM adam.adsl\n  WHERE ittfl = 'Y'\n  GROUP BY trta;\nQUIT;\n\n/* 連続変数の要約 (年齢) */\nPROC MEANS DATA=adam.adsl NWAY NOPRINT;\n  WHERE ittfl = 'Y';\n  CLASS trta;\n  VAR age;\n  OUTPUT OUT=work.age_stats\n    N=n MEAN=mean STD=std\n    MEDIAN=median MIN=min MAX=max;\nRUN;\n\n/* 表示用に整形 */\nDATA work.age_display;\n  SET work.age_stats;\n  LENGTH col1 $40 stat_label $30;\n\n  stat_label = 'Age (years)';\n  col1 = CATX(' ',\n    PUT(n, 3.),\n    '/',\n    STRIP(PUT(mean, 5.1)) || ' (' ||\n    STRIP(PUT(std, 5.2)) || ')');\n  OUTPUT;\nRUN;\n\n/* カテゴリ変数の集計 (性別) */\nPROC FREQ DATA=adam.adsl NOPRINT;\n  WHERE ittfl = 'Y';\n  TABLES trta * sex / OUT=work.sex_freq;\nRUN;\n\nDATA work.sex_display;\n  SET work.sex_freq;\n  LENGTH col1 $40;\n  col1 = STRIP(PUT(count, 4.)) || ' (' ||\n         STRIP(PUT(percent, 5.1)) || '%)';\nRUN;",
    explanation: "人口統計テーブルはPhase I-IVの全試験で作成する基本テーブル。PROC MEANSで連続変数、PROC FREQでカテゴリ変数を集計し、表示用に整形。治療群のN数をヘッダーに含める。"
  },
  {
    id: "ae-table",
    name: "有害事象テーブル（Table 14.3.1）",
    description: "有害事象をSOC（器官別大分類）とPT（基本語）で集計する安全性テーブル。治療群別の発現被験者数と発現率を表示。",
    code: "/* ===== AEサマリーテーブル作成パターン ===== */\n\n/* Big N (各治療群の安全性解析対象者数) */\nPROC SQL NOPRINT;\n  SELECT COUNT(DISTINCT usubjid)\n  INTO :n_drug TRIMMED, :n_placebo TRIMMED\n  FROM adam.adsl\n  WHERE saffl = 'Y'\n  GROUP BY trta;\nQUIT;\n\n/* SOC/PT別の被験者数集計 */\nPROC SQL;\n  CREATE TABLE work.ae_count AS\n  SELECT\n    trta,\n    aebodsys,\n    aedecod,\n    COUNT(DISTINCT usubjid) AS n_subj\n  FROM adam.adae\n  WHERE trtemfl = 'Y'\n  GROUP BY trta, aebodsys, aedecod\n  ORDER BY aebodsys, aedecod, trta;\nQUIT;\n\n/* パーセント算出 */\nDATA work.ae_pct;\n  SET work.ae_count;\n  LENGTH col $20;\n  IF trta = 'Drug A' THEN\n    col = STRIP(PUT(n_subj, 4.)) || ' (' ||\n          STRIP(PUT(n_subj/INPUT(\"&n_drug\",BEST.)*100, 5.1))\n          || '%)';\n  ELSE\n    col = STRIP(PUT(n_subj, 4.)) || ' (' ||\n          STRIP(PUT(n_subj/INPUT(\"&n_placebo\",BEST.)*100, 5.1))\n          || '%)';\nRUN;",
    explanation: "AEテーブルはTreatment Emergent AEをSOC/PT別に集計。Big N（母数）は安全性解析集団の被験者数。同一被験者が同じAEを複数回経験しても1回とカウント（COUNT DISTINCT）。"
  },
  {
    id: "locf",
    name: "LOCF（Last Observation Carried Forward）",
    description: "欠測値の補完法の一つ。最後に観測された値を欠測時点に引き継ぐ。臨床試験では中止・脱落後の有効性評価によく使用される（ただし近年はMMRMが主流）。",
    code: "/* ===== LOCF実装パターン ===== */\n\n/* 方法1: RETAINを使用 */\nPROC SORT DATA=work.advs;\n  BY usubjid paramcd visitnum;\nRUN;\n\nDATA work.advs_locf;\n  SET work.advs;\n  BY usubjid paramcd;\n  RETAIN last_aval;\n\n  IF FIRST.paramcd THEN last_aval = .;\n\n  IF NOT MISSING(aval) THEN last_aval = aval;\n  ELSE aval = last_aval;\n\n  IF NOT MISSING(aval) THEN locffl = 'Y';\n  ELSE locffl = 'N';\n\n  DROP last_aval;\nRUN;\n\n/* 方法2: PROC SQLを使用 */\nPROC SQL;\n  CREATE TABLE work.advs_locf2 AS\n  SELECT a.*,\n    COALESCE(a.aval,\n      (SELECT b.aval\n       FROM work.advs b\n       WHERE b.usubjid = a.usubjid\n         AND b.paramcd = a.paramcd\n         AND b.visitnum < a.visitnum\n         AND b.aval IS NOT NULL\n       ORDER BY b.visitnum DESC\n       LIMIT 1)\n    ) AS aval_locf\n  FROM work.advs a;\nQUIT;",
    explanation: "LOCFはRETAIN文を使う方法が最も一般的。BY変数のFIRST.で初期化し、非欠測値が来たらlast_avalを更新、欠測の場合はlast_avalで補完。SAPで指定された場合のみ使用し、不適切な使用は避ける。"
  },
  {
    id: "baseline-def",
    name: "ベースライン定義",
    description: "治療開始前の測定値をベースラインとして定義する。一般的には「投与開始日以前の最後の非欠測値」。ベースラインからの変化量（CHG = AVAL - BASE）が主要な有効性評価指標。",
    code: "/* ===== ベースライン定義パターン ===== */\n\n/* ADSLから投与開始日を取得 */\nPROC SQL;\n  CREATE TABLE work.vs_base AS\n  SELECT a.*, b.trtsdt\n  FROM work.advs a\n  INNER JOIN adam.adsl b\n    ON a.usubjid = b.usubjid;\nQUIT;\n\n/* ベースライン値の特定 */\nPROC SORT DATA=work.vs_base;\n  BY usubjid paramcd adt;\nRUN;\n\nDATA work.advs_bl;\n  SET work.vs_base;\n  BY usubjid paramcd;\n\n  /* ベースラインフラグ: 投与開始日以前の最後の値 */\n  IF adt <= trtsdt AND NOT MISSING(aval) THEN\n    ablfl = 'Y';\n  ELSE ablfl = '';\nRUN;\n\n/* 最後のベースライン値のみ保持 */\nDATA work.baseline;\n  SET work.advs_bl;\n  BY usubjid paramcd;\n  WHERE ablfl = 'Y';\n  IF LAST.paramcd;\n  KEEP usubjid paramcd aval;\n  RENAME aval = base;\nRUN;\n\n/* ベースラインをマージしてCHG算出 */\nDATA work.advs_final;\n  MERGE work.advs(IN=a)\n        work.baseline(IN=b);\n  BY usubjid paramcd;\n  IF a;\n\n  /* ベースラインからの変化量 */\n  IF NOT MISSING(aval) AND NOT MISSING(base) THEN\n    chg = aval - base;\nRUN;",
    explanation: "ベースラインの定義はSAP（統計解析計画書）で規定される。一般的には「投与開始日以前かつ最も近い非欠測値」。BASEをマージしてCHG（変化量）を算出。ADaM BDSデータセットの基本構造。"
  },
  {
    id: "visit-window",
    name: "来院ウィンドウ（Visit Windowing）",
    description: "実際の来院日が予定日からずれた場合に、最も近いスケジュール来院に割り当てる処理。解析時の来院タイミングの標準化に使用。",
    code: "/* ===== 来院ウィンドウパターン ===== */\n\n/* 来院スケジュール定義 */\nDATA work.visit_schedule;\n  INPUT visitnum target_day lower upper;\n  DATALINES;\n1    1    -3    1\n2   15    11   18\n3   29    22   36\n4   57    50   64\n5   85    78   92\n;\nRUN;\n\n/* 投与開始日からの日数を算出 */\nDATA work.vs_days;\n  MERGE work.advs(IN=a)\n        adam.adsl(IN=b KEEP=usubjid trtsdt);\n  BY usubjid;\n  IF a AND b;\n  ady = adt - trtsdt + (adt >= trtsdt);\n  /* Day 0をスキップ: 投与日=Day 1 */\nRUN;\n\n/* 来院ウィンドウの割り当て */\nPROC SQL;\n  CREATE TABLE work.vs_windowed AS\n  SELECT a.*, b.visitnum AS avisit,\n    ABS(a.ady - b.target_day) AS day_diff\n  FROM work.vs_days a\n  INNER JOIN work.visit_schedule b\n    ON a.ady BETWEEN b.lower AND b.upper\n  ORDER BY a.usubjid, a.paramcd, b.visitnum, day_diff;\nQUIT;\n\n/* 同一ウィンドウ内で最も近い値を選択 */\nDATA work.vs_final;\n  SET work.vs_windowed;\n  BY usubjid paramcd avisit;\n  IF FIRST.avisit;\nRUN;",
    explanation: "来院ウィンドウはプロトコルで定義されたスケジュールに基づく。各実測日をウィンドウに割り当て、同一ウィンドウ内に複数測定がある場合は予定日に最も近い値を選択する。"
  },
  {
    id: "impute-date",
    name: "不完全日付の補完（Date Imputation）",
    description: "臨床データでは日付が不完全な場合がある（月のみ、年のみ等）。CDISCルールに従い、保守的な補完（安全性に不利にならない方向）を行う。",
    code: "/* ===== 不完全日付の補完パターン ===== */\n\n/* ISO8601形式の不完全日付を処理 */\nDATA work.imputed;\n  SET work.ae_raw;\n  LENGTH aestdtc_imp $10;\n\n  /* 完全な日付 (YYYY-MM-DD) */\n  IF LENGTH(aestdtc) = 10 THEN DO;\n    astdt = INPUT(aestdtc, E8601DA.);\n    dtimpfl = '';\n  END;\n\n  /* 年月のみ (YYYY-MM) → 月初日で補完 */\n  ELSE IF LENGTH(aestdtc) = 7 THEN DO;\n    astdt = INPUT(CATS(aestdtc, '-01'), E8601DA.);\n    dtimpfl = 'M';  /* Month imputed */\n  END;\n\n  /* 年のみ (YYYY) → 1月1日で補完 */\n  ELSE IF LENGTH(aestdtc) = 4 THEN DO;\n    astdt = INPUT(CATS(aestdtc, '-01-01'), E8601DA.);\n    dtimpfl = 'Y';  /* Year imputed */\n  END;\n\n  /* 終了日の補完（保守的: 月末日） */\n  IF LENGTH(aeendtc) = 7 THEN DO;\n    aendt = INTNX('MONTH',\n      INPUT(CATS(aeendtc, '-01'), E8601DA.),\n      0, 'E');\n    /* 月の最終日を設定 */\n  END;\n\n  FORMAT astdt aendt DATE9.;\nRUN;",
    explanation: "不完全日付の補完ルールはSAPで定義される。開始日は保守的に早い日付（月初）、終了日は遅い日付（月末）で補完するのが一般的。INTNX関数の'E'アライメントで月末日を取得。DTIMPFLフラグで補完の有無を記録。"
  }
];

/* --- SAS TIPS / ベストプラクティス --- */
var TIPS_DATA = [
  {
    id: "tip-1",
    title: "常にLENGTH文を先頭に",
    content: "DATA STEPでは最初に代入された値で変数の長さが決まる。LENGTH文をDATA STEPの最初に書いて、意図しない切り捨てを防止する。",
    category: "coding"
  },
  {
    id: "tip-2",
    title: "WHEREとIFの使い分け",
    content: "WHERE：データセット読み込み時にフィルタ（インデックス使用可能、効率的）。IF：PDV上でフィルタ（MERGE/SET後の条件判定に必要）。パフォーマンスを考慮してWHEREを優先。",
    category: "performance"
  },
  {
    id: "tip-3",
    title: "MERGEの前は必ずSORT",
    content: "MERGE BY文を使う場合、両方のデータセットがBY変数でソートされている必要がある。PROC SORTを忘れるとエラーまたは不正な結果になる。",
    category: "coding"
  },
  {
    id: "tip-4",
    title: "NOPRINTとOUT=の活用",
    content: "PROC MEANS/FREQ等でNOPRINTとOUT=を使い、結果をデータセットに出力。後続の処理で整形・結合が可能になり、柔軟なテーブル作成ができる。",
    category: "coding"
  },
  {
    id: "tip-5",
    title: "PUTLOG/PUT文でデバッグ",
    content: "DATA STEPでのデバッグにはPUT文やPUTLOG文を活用。PUTLOG 'NOTE: ' variable=; でログに変数値を出力。_ALL_を指定すると全変数を出力。",
    category: "debug"
  },
  {
    id: "tip-6",
    title: "PROC COMPAREでQC",
    content: "ダブルプログラミング（2人が独立にプログラム作成）後、PROC COMPAREで結果を比較。CRITERION=で浮動小数点の微小差を許容。",
    category: "quality"
  },
  {
    id: "tip-7",
    title: "マクロ変数は%LETで一元管理",
    content: "プログラム冒頭で%LETを使い、試験番号・カットオフ日・パス等を定義。変更時に1箇所だけ修正すれば全体に反映される。",
    category: "coding"
  },
  {
    id: "tip-8",
    title: "ログの確認を習慣化",
    content: "WARNING/ERRORだけでなく、NOTE（特にNumeric to character conversion、MERGE with repeated BY values等）も確認。暗黙の型変換は明示的にINPUT/PUT関数で解消。",
    category: "quality"
  },
  {
    id: "tip-9",
    title: "ラベルを必ず設定",
    content: "全変数にLABEL文でラベルを設定。ADaMデータセットではCDISC標準のラベルを使用。PROC CONTENTSで定義を確認。",
    category: "standard"
  },
  {
    id: "tip-10",
    title: "KEEP/DROPでメモリ最適化",
    content: "必要な変数のみKEEP=で指定し、不要変数はDROP=で除外。大規模データセットでは処理速度とメモリ使用量に大きく影響する。",
    category: "performance"
  }
];

/* --- 学習ロードマップ --- */
var GUIDE_STEPS = [
  {
    step: 1,
    title: "SAS基礎を理解する",
    description: "SASの基本概念（データセット、変数、オブザベーション、PDV）とプログラム構造（DATAステップ、PROCステップ）を学ぶ。",
    topics: ["SASプログラムの構造", "データセットの概念", "ライブラリとLIBNAME", "基本的な入出力"],
    link: "basics/index.html",
    duration: "1-2週間"
  },
  {
    step: 2,
    title: "DATA STEPをマスターする",
    description: "データ処理の中核であるDATA STEPの各構文を習得。SET、MERGE、IF-THEN、DO LOOP、ARRAY、RETAIN等。",
    topics: ["SET/MERGE/BY", "IF-THEN/ELSE", "DO LOOP", "ARRAY", "RETAIN", "FIRST./LAST."],
    link: "datastep/index.html",
    duration: "2-3週間"
  },
  {
    step: 3,
    title: "主要PROCを使いこなす",
    description: "PROC SORT, FREQ, MEANS, PRINT, REPORT, TRANSPOSE, SQL, FORMAT, COMPARE, CONTENTSを習得。",
    topics: ["PROC SORT/PRINT", "PROC FREQ/MEANS", "PROC SQL", "PROC REPORT", "PROC TRANSPOSE"],
    link: "procs/index.html",
    duration: "2-3週間"
  },
  {
    step: 4,
    title: "マクロプログラミング",
    description: "マクロ変数、マクロ定義、条件分岐、ループ処理を学び、再利用可能なコードを書けるようになる。",
    topics: ["%LET", "%MACRO/%MEND", "%IF/%THEN", "%DO", "CALL SYMPUT", "デバッグ"],
    link: "macro/index.html",
    duration: "2-3週間"
  },
  {
    step: 5,
    title: "臨床試験プログラミング応用",
    description: "CDISC標準（SDTM/ADaM）を理解し、実際の臨床試験データセット作成とTLF作成パターンを習得。",
    topics: ["ADSL作成", "ADAE作成", "人口統計テーブル", "AEテーブル", "ベースライン定義", "LOCF"],
    link: "guide/index.html#clinical",
    duration: "3-4週間"
  },
  {
    step: 6,
    title: "実践・品質管理",
    description: "ダブルプログラミング、PROC COMPARE、コードレビュー、バリデーションのベストプラクティスを身につける。",
    topics: ["PROC COMPARE", "ダブルプログラミング", "ログ確認", "コーディング規約", "CDISC準拠"],
    link: "guide/index.html#practice",
    duration: "継続的"
  }
];

/* --- クイズデータ --- */
var QUIZ_DATA = [
  {
    id: 1,
    question: "SASのDATA STEPで、既存のデータセットを読み込むために使用するステートメントはどれか？",
    options: ["INPUT", "SET", "READ", "LOAD"],
    answer: 1,
    explanation: "SETステートメントは既存のSASデータセットを読み込む基本的なステートメントです。INPUTは生データ（テキストファイル等）の読み込みに使用します。"
  },
  {
    id: 2,
    question: "MERGE文を使用する前に必須の操作は何か？",
    options: ["PROC PRINT", "PROC SORT", "PROC MEANS", "PROC FORMAT"],
    answer: 1,
    explanation: "MERGE BY文を使用する場合、マージする全てのデータセットがBY変数でソートされている必要があります。PROC SORTで事前にソートしておく必要があります。"
  },
  {
    id: 3,
    question: "文字変数を数値に変換する関数はどれか？",
    options: ["PUT()", "INPUT()", "CONVERT()", "CAST()"],
    answer: 1,
    explanation: "INPUT関数は文字→数値への型変換に使用します。PUT関数は逆に数値→文字への変換。CONVERT()やCAST()はSQLの関数であり、SAS DATA STEPでは使用しません。"
  },
  {
    id: 4,
    question: "PROC FREQで度数テーブルをデータセットとして出力するためのオプションの組み合わせはどれか？",
    options: [
      "NOPRINT + OUT=",
      "NOLIST + OUTPUT=",
      "NOPRINT + OUTDS=",
      "SILENT + SAVE="
    ],
    answer: 0,
    explanation: "NOPRINTで画面出力を抑制し、OUT=オプションで度数テーブルをSASデータセットとして出力できます。"
  },
  {
    id: 5,
    question: "RETAINステートメントの主な機能は何か？",
    options: [
      "変数をデータセットから削除する",
      "DATA STEPの反復間で変数の値を保持する",
      "変数のデータ型を変更する",
      "変数にラベルを設定する"
    ],
    answer: 1,
    explanation: "RETAINは、DATA STEPの各反復（各オブザベーションの処理）の開始時に変数の値がリセットされるのを防ぎ、前のオブザベーションの値を保持します。累積計算やLOCF処理に必須。"
  },
  {
    id: 6,
    question: "マクロ変数を参照するための記号はどれか？",
    options: ["% (パーセント)", "& (アンパサンド)", "# (ハッシュ)", "$ (ドル)"],
    answer: 1,
    explanation: "&（アンパサンド）がマクロ変数の参照に使用されます。%はマクロ文（%LET, %MACRO等）の接頭辞として使用されます。"
  },
  {
    id: 7,
    question: "ADaM ADSLデータセットの説明として正しいものはどれか？",
    options: [
      "有害事象の詳細データを格納するデータセット",
      "被験者レベルの基本情報・フラグを格納するデータセット",
      "検査値の経時データを格納するデータセット",
      "投薬履歴を格納するデータセット"
    ],
    answer: 1,
    explanation: "ADSLは「Subject-Level Analysis Dataset」の略で、被験者ごとに1レコードの構造を持ち、人口統計情報、治療情報、各種解析対象集団フラグ等を格納します。"
  },
  {
    id: 8,
    question: "Treatment Emergent AE（TEAE）の定義として一般的なものはどれか？",
    options: [
      "試験登録前に発現した有害事象",
      "治療開始日以降に発現した有害事象",
      "重篤な有害事象のみ",
      "治療と因果関係がある有害事象のみ"
    ],
    answer: 1,
    explanation: "TEAEは一般に「治療開始日（投与開始日）以降に新たに発現した、または悪化した有害事象」と定義されます。因果関係の有無は問いません。"
  },
  {
    id: 9,
    question: "PROC COMPAREの臨床試験プログラミングにおける主な用途は？",
    options: [
      "データのソート",
      "QC（品質管理）でのダブルプログラミング結果比較",
      "グラフの作成",
      "マクロの実行"
    ],
    answer: 1,
    explanation: "臨床試験プログラミングでは、メインプログラマーとQCプログラマーが独立にプログラムを作成し、PROC COMPAREで結果が一致するかを確認します。"
  },
  {
    id: 10,
    question: "PROC TRANSPOSEのID文の役割はどれか？",
    options: [
      "転置後の変数名を指定する入力変数を定義",
      "転置対象の変数を指定",
      "グループ化変数を指定",
      "出力データセット名を指定"
    ],
    answer: 0,
    explanation: "ID文は、転置後に列名（変数名）として使用する変数を指定します。VAR文は転置対象の変数、BY文はグループ化変数を指定します。"
  },
  {
    id: 11,
    question: "次のうち、DATA STEPのFIRST.変数について正しい説明はどれか？",
    options: [
      "データセットの最初のオブザベーションでのみTRUE",
      "BY変数で定義されたグループの最初のオブザベーションでTRUE",
      "変数の最初の文字を返す関数",
      "PROC SORTの最初のBY変数"
    ],
    answer: 1,
    explanation: "FIRST.変数はBYグループ処理で自動的に作成され、各グループの最初のオブザベーションで1（TRUE）となります。事前のソートとBY文が必要です。"
  },
  {
    id: 12,
    question: "LOCFの補完方法として正しいのはどれか？",
    options: [
      "欠測値を0で置換する",
      "欠測値を直前の非欠測値で補完する",
      "欠測値を平均値で補完する",
      "欠測値を削除する"
    ],
    answer: 1,
    explanation: "LOCF（Last Observation Carried Forward）は、欠測値を直前の非欠測の観測値で補完する方法です。RETAINステートメントを使って実装するのが一般的です。"
  }
];

/* --- クイズ結果判定 --- */
var QUIZ_RESULTS = [
  { min: 0,  max: 2,  level: "入門者", message: "SASの基礎から始めましょう。基礎セクションで基本概念を確認してください。", color: "#e53e3e" },
  { min: 3,  max: 5,  level: "初級者", message: "基本的な知識はありますが、まだ学ぶことが多いです。DATA STEPとPROCの学習を進めましょう。", color: "#dd6b20" },
  { min: 6,  max: 8,  level: "中級者", message: "良い成績です！マクロプログラミングと臨床応用の知識を深めるとさらにレベルアップできます。", color: "#d69e2e" },
  { min: 9,  max: 10, level: "上級者", message: "素晴らしい知識レベルです。臨床試験プログラミングのパターンを実践で活用しましょう。", color: "#38a169" },
  { min: 11, max: 12, level: "エキスパート", message: "完璧な理解度です！あなたは臨床試験SASプログラマーとして即戦力です。", color: "#004b87" }
];
