# SAS Programming Academy

SASの基礎から臨床試験プログラミングまでを体系的に学べる日本語の学習サイトです。

## 概要

臨床試験SASプログラマーを目指す方向けの教育サイトです。実践的なコード例と詳細な解説で、SAS基礎からDATA STEP、PROC、マクロ、臨床試験プログラミングパターンまでを網羅しています。

## 主な機能

- **SAS基礎**: SASの基本概念、プログラム構成、データセット、ライブラリ
- **DATA STEPリファレンス**: SET、MERGE、IF-THEN、DO LOOP、ARRAY、RETAIN等の12構文を詳細解説
- **PROCリファレンス**: PROC SORT、FREQ、MEANS、PRINT、REPORT、TRANSPOSE、SQL、FORMAT、COMPARE、CONTENTSの10 PROCを解説
- **マクロプログラミング**: %LET、%MACRO、マクロ変数、%IF/%THEN、%DO、CALL SYMPUT等の8トピック
- **臨床試験パターン**: ADSL/ADAE作成、人口統計テーブル、AEテーブル、LOCF、ベースライン定義等の8パターン
- **学習ロードマップ**: 6ステップで臨床試験プログラマーを目指すガイド
- **コード例検索**: 全コード例の横断検索機能
- **理解度クイズ**: 12問のクイズで知識をチェック

## 技術スタック

- HTML / CSS / JavaScript（フレームワーク不使用）
- レスポンシブデザイン
- SASシンタックスハイライト
- GitHub Pages対応

## ディレクトリ構成

```
sas-academy/
├── index.html              # トップページ
├── css/
│   └── style.css           # 共通CSS
├── js/
│   ├── data.js             # 全データ定義
│   ├── main.js             # 共通JS
│   ├── basics.js           # 基礎ページJS
│   ├── datastep.js         # DATA STEPページJS
│   ├── procs.js            # PROCページJS
│   ├── macro.js            # マクロページJS
│   ├── guide.js            # 学習ガイドJS
│   ├── search.js           # 検索ページJS
│   └── quiz.js             # クイズページJS
├── basics/
│   └── index.html          # SAS基礎
├── datastep/
│   └── index.html          # DATA STEPリファレンス
├── procs/
│   └── index.html          # PROCリファレンス
├── macro/
│   └── index.html          # マクロプログラミング
├── guide/
│   └── index.html          # 学習ロードマップ
├── tools/
│   ├── search.html         # コード例検索
│   └── quiz.html           # 理解度クイズ
└── README.md
```

## ローカルでの確認

任意のHTTPサーバーで `index.html` を開いてください。

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

## ライセンス

学習目的で作成されたサイトです。実際のSASプログラミングではSAP（統計解析計画書）およびプロジェクト固有のガイドラインに従ってください。
