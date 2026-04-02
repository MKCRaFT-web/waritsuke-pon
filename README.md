# 割付ポンっ（GitHub Pages）

## GA4 測定IDの設定場所
1. `analytics.js` を開きます。
2. 先頭の `GA4_MEASUREMENT_ID` に本番測定ID `G-EP58TWLTJY` を設定済みです（必要ならここを差し替えてください）。

```js
const GA4_MEASUREMENT_ID = "G-EP58TWLTJY";
```

> 別のプロパティで使う場合はこのIDだけ差し替えれば運用できます。

## 送信イベント
- `page_view`: 各ページ表示時（GA4の`gtag("config", ...)`で自動送信）
- `app_open`: Stable/Betaアプリを開いたとき
- `pdf_loaded`: PDF読み込み完了時
- `layout_started`: 「4. グリッド生成」を押して割付開始したとき
- `layout_finished`: 「5. グリッド確定」で割付結果を確定表示したとき

## GitHub Pages での動作
- クライアントサイド（静的ファイル）だけで完結します。
- サーバーサイド実装は不要です。
