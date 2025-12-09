# AI チャットボット 実行計画

## プロジェクト概要
教育用AIチャットボットの構築（フロントエンド: React + Vite、バックエンド: Express + OpenAI API）

---

## Phase 1: プロジェクトセットアップ

### 1.1 環境準備
- [x] Node.js (v18以上) がインストールされているか確認
- [x] npm が最新版か確認
- [x] Git リポジトリの初期化
- [x] `.gitignore` ファイルの作成

### 1.2 バックエンドのセットアップ
- [x] `backend` ディレクトリの作成
- [x] `npm init -y` でバックエンドの初期化
- [x] TypeScript と必要な型定義のインストール
  ```bash
  npm install -D typescript @types/node @types/express ts-node nodemon
  ```
- [x] 必要なパッケージのインストール
  ```bash
  npm install express cors dotenv openai
  npm install -D @types/cors
  ```
- [x] `tsconfig.json` の作成と設定
- [x] ディレクトリ構造の作成（`src/`, `src/routes/`, `src/services/`, `src/middleware/`, `src/types/`）
- [x] `.env.example` ファイルの作成
- [x] `.env` ファイルの作成（OpenAI API Key を設定）
- [x] `package.json` に開発・ビルドスクリプトを追加

### 1.3 フロントエンドのセットアップ
- [x] Vite + React + TypeScript プロジェクトの作成
  ```bash
  npm create vite@latest frontend -- --template react-ts
  ```
- [x] フロントエンドディレクトリに移動して依存関係をインストール
- [x] Tailwind CSS のインストールと設定
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [x] Tailwind CSS の設定ファイル編集（`tailwind.config.js`）
- [x] `src/index.css` に Tailwind ディレクティブを追加
- [x] 必要なライブラリのインストール
  ```bash
  npm install react-markdown react-syntax-highlighter axios
  npm install -D @types/react-syntax-highlighter
  ```
- [x] ディレクトリ構造の作成（`src/components/`, `src/hooks/`, `src/types/`, `src/utils/`）

---

## Phase 2: バックエンド実装

### 2.1 型定義の作成
- [x] `src/types/message.ts` の作成
  - Message インターフェースの定義
  - ChatRequest, ChatResponse の型定義

### 2.2 OpenAI サービスの実装
- [x] `src/services/openai.ts` の作成
- [x] OpenAI クライアントの初期化
- [x] システムプロンプトの定義
- [x] チャット補完関数の実装
  - 会話履歴を受け取り、OpenAI API を呼び出す
  - エラーハンドリングを含める

### 2.3 API ルートの実装
- [x] `src/routes/chat.ts` の作成
- [x] POST `/api/chat` エンドポイントの実装
  - リクエストバリデーション
  - OpenAI サービスの呼び出し
  - レスポンスの整形
- [x] GET `/api/health` エンドポイントの実装

### 2.4 ミドルウェアの実装
- [x] `src/middleware/errorHandler.ts` の作成
  - グローバルエラーハンドラーの実装
  - エラーレスポンスの統一フォーマット

### 2.5 サーバーの実装
- [x] `src/server.ts` の作成
- [x] Express アプリケーションの設定
  - CORS の設定
  - JSON パーサーの設定
  - ルートの登録
  - エラーハンドラーの登録
- [x] サーバー起動処理

### 2.6 バックエンドのテスト
- [x] 開発サーバーの起動確認
- [x] `/api/health` エンドポイントの動作確認
- [x] `/api/chat` エンドポイントの動作確認（Postman or curl）
- [x] エラーハンドリングの確認

---

## Phase 3: フロントエンド実装

### 3.1 型定義の作成
- [x] `src/types/message.ts` の作成
  - Message インターフェースの定義
  - ChatState の型定義

### 3.2 基本コンポーネントの実装

#### MessageInput コンポーネント
- [x] `src/components/MessageInput.tsx` の作成
- [x] テキストエリアの実装
- [x] Enter キーでの送信機能（Shift+Enter で改行）
- [x] 送信ボタンの実装
- [x] 送信中の無効化処理
- [x] スタイリング（Tailwind CSS）

#### CodeBlock コンポーネント
- [x] `src/components/CodeBlock.tsx` の作成
- [x] react-syntax-highlighter を使用したシンタックスハイライト
- [x] コピーボタンの実装
- [x] コピー成功時のフィードバック表示
- [x] スタイリング

#### ErrorMessage コンポーネント
- [x] `src/components/ErrorMessage.tsx` の作成
- [x] エラーメッセージの表示
- [x] 閉じるボタンの実装
- [x] スタイリング

#### Message コンポーネント
- [x] `src/components/Message.tsx` の作成
- [x] ユーザーメッセージと AI メッセージの区別表示
- [x] react-markdown を使用したマークダウンレンダリング
- [x] カスタムコンポーネント（code ブロックは CodeBlock を使用）
- [x] スタイリング

#### MessageList コンポーネント
- [x] `src/components/MessageList.tsx` の作成
- [x] メッセージ配列のマッピング
- [x] 自動スクロール機能（新メッセージ時に最下部へ）
- [x] ローディング表示
- [x] スタイリング

#### Chat コンポーネント
- [x] `src/components/Chat.tsx` の作成
- [x] ヘッダーの実装（タイトル、説明）
- [x] MessageList の配置
- [x] MessageInput の配置
- [x] ErrorMessage の配置
- [x] レイアウトの実装
- [x] レスポンシブデザインの調整

### 3.3 カスタムフックの実装
- [x] `src/hooks/useChat.ts` の作成
- [x] 状態管理（messages, isLoading, error）
- [x] メッセージ送信関数の実装
  - バックエンド API への POST リクエスト
  - 会話履歴の管理（最新5ターン = 10メッセージ）
  - エラーハンドリング
- [x] エラークリア関数の実装

### 3.4 ユーティリティ関数の実装
- [x] `src/utils/api.ts` の作成
  - API ベース URL の設定
  - axios インスタンスの作成
- [x] 必要に応じて他のユーティリティ関数を追加

### 3.5 メインアプリケーションの実装
- [x] `src/App.tsx` の更新
  - Chat コンポーネントの配置
  - グローバルレイアウトの設定
- [x] `src/main.tsx` の確認
- [x] 不要なデフォルトファイルの削除

### 3.6 環境変数の設定
- [x] `.env` ファイルの作成
- [x] `VITE_API_URL` の設定
- [x] `.env.example` の作成

### 3.7 フロントエンドのテスト
- [x] 開発サーバーの起動確認
- [x] UI の表示確認
- [x] メッセージ送信機能の動作確認
- [x] マークダウン表示の確認
- [x] コードブロックのシンタックスハイライト確認
- [x] コピーボタンの動作確認
- [x] エラー表示の確認
- [x] レスポンシブデザインの確認（各画面サイズ）

---

## Phase 4: 統合とテスト

### 4.1 フロントエンドとバックエンドの統合
- [x] フロントエンドとバックエンドを同時起動
- [x] CORS 設定の確認
- [x] エンドツーエンドでの動作確認

### 4.2 機能テスト
- [x] 正常系テスト
  - [x] ユーザーがメッセージを送信し、AI 応答を受け取れる
  - [x] マルチターン会話が機能する
  - [x] コードブロックが正しく表示される
  - [x] コピー機能が動作する
  - [x] マークダウンが正しくレンダリングされる

- [x] 異常系テスト
  - [x] 空のメッセージを送信しようとした場合の処理
  - [x] API エラー時のエラーメッセージ表示
  - [x] ネットワークエラー時の処理
  - [x] OpenAI API のレート制限エラー時の処理

- [x] 境界値テスト
  - [x] 会話履歴が5ターンを超えた場合の動作
  - [x] 非常に長いメッセージの送信
  - [x] 特殊文字を含むメッセージの処理
  - [x] コードブロック内の特殊文字の処理

### 4.3 ブラウザ互換性テスト
- [x] Chrome での動作確認
- [ ] Firefox での動作確認
- [ ] Safari での動作確認
- [ ] Edge での動作確認（可能であれば）

### 4.4 パフォーマンステスト
- [x] 初回ロード時間の測定
- [x] メッセージ送受信のレスポンスタイム確認
- [ ] 長時間使用時のメモリリーク確認

### 4.5 セキュリティチェック
- [x] API キーがフロントエンドに露出していないか確認
- [x] `.env` ファイルが `.gitignore` に含まれているか確認
- [x] XSS 対策の確認（マークダウンレンダリング）
- [x] CORS 設定の確認

---

## Phase 5: ドキュメント作成

### 5.1 README.md の作成
- [x] プロジェクト概要の記述
- [x] 機能一覧の記述
- [x] 技術スタックの記述
- [x] セットアップ手順の記述
  - [x] 前提条件
  - [x] インストール手順
  - [x] 環境変数の設定方法
- [x] 開発サーバーの起動方法
- [x] ビルド方法
- [x] デプロイ方法
- [x] トラブルシューティング
- [x] ライセンス情報

### 5.2 コードコメントの追加
- [x] 複雑なロジックへのコメント追加
- [x] 型定義への説明コメント追加
- [x] 関数の JSDoc コメント追加（必要に応じて）

### 5.3 その他ドキュメント
- [x] `backend/.env.example` の詳細説明を追加
- [x] `frontend/.env.example` の詳細説明を追加
- [x] API 仕様書の作成（オプション）

---

## Phase 6: デプロイ準備

### 6.1 ビルドの確認
- [x] バックエンドのビルド確認
  ```bash
  cd backend
  npm run build
  ```
- [x] フロントエンドのビルド確認
  ```bash
  cd frontend
  npm run build
  ```
- [x] ビルドエラーの修正

### 6.2 本番環境用の設定
- [x] フロントエンドの `.env.production` 作成
- [x] バックエンドの本番環境用 CORS 設定
- [x] エラーログの設定確認

### 6.3 Vercel 設定ファイルの作成
- [x] フロントエンド用 `vercel.json` の作成（必要に応じて）
- [x] バックエンド用 `vercel.json` の作成（Serverless Functions として設定）

---

## Phase 7: デプロイ

### 7.1 バックエンドのデプロイ
- [x] Vercel CLI のインストール
  ```bash
  npm install -g vercel
  ```
- [x] Vercel にログイン
  ```bash
  vercel login
  ```
- [x] バックエンドのデプロイ
  ```bash
  cd backend
  vercel --prod
  ```
- [x] 環境変数の設定（Vercel Dashboard または CLI）
  - [x] `OPENAI_API_KEY` の設定
  - [x] `ALLOWED_ORIGINS` の設定
- [x] デプロイされた API の動作確認

### 7.2 フロントエンドのデプロイ
- [x] `.env.production` にバックエンドの本番 URL を設定
- [x] フロントエンドのデプロイ
  ```bash
  cd frontend
  vercel --prod
  ```
- [x] デプロイされたフロントエンドの動作確認

### 7.3 統合確認
- [x] 本番環境でのエンドツーエンドテスト
- [x] 各機能の動作確認
- [x] パフォーマンスの確認
- [x] エラーハンドリングの確認

---

## Phase 8: 最終チェックとリリース

### 8.1 成功基準の確認
- [ ] ユーザーがメッセージを送信し、AI 応答を受け取れる
- [ ] マークダウンとコードが正しく表示される
- [ ] コードのコピー機能が動作する
- [ ] レスポンシブデザインが実装されている
- [ ] エラーが適切に処理・表示される
- [ ] Vercel に正常にデプロイできている
- [ ] 主要ブラウザで動作する
- [ ] ドキュメントが整備されている

### 8.2 パフォーマンス最適化
- [ ] Lighthouse スコアの確認
- [ ] 必要に応じて最適化を実施
  - [ ] 画像の最適化（使用している場合）
  - [ ] Tailwind CSS の未使用クラス削除
  - [ ] コード分割の検討

### 8.3 最終ドキュメント更新
- [ ] README.md の最終確認と更新
- [ ] 本番環境の URL を README に追加
- [ ] スクリーンショットの追加（オプション）

### 8.4 リリース
- [ ] Git タグの作成（v1.0.0）
- [ ] リリースノートの作成
- [ ] プロジェクトの公開（必要に応じて）

---

## Phase 9: 運用とメンテナンス

### 9.1 監視設定
- [ ] Vercel Analytics の有効化
- [ ] エラーログの監視方法を確立
- [ ] OpenAI API 使用量の監視

### 9.2 メンテナンス計画
- [ ] 定期的な依存関係の更新
- [ ] セキュリティパッチの適用
- [ ] ユーザーフィードバックの収集方法を確立

### 9.3 今後の機能追加の準備
- [ ] v2.0 の機能要件の検討
- [ ] ユーザーからのフィードバック収集
- [ ] 優先順位の決定

---

## 推定作業時間

| Phase | 推定時間 | 説明 |
|-------|---------|------|
| Phase 1 | 2-3時間 | セットアップと環境構築 |
| Phase 2 | 3-4時間 | バックエンド実装 |
| Phase 3 | 6-8時間 | フロントエンド実装 |
| Phase 4 | 2-3時間 | 統合とテスト |
| Phase 5 | 1-2時間 | ドキュメント作成 |
| Phase 6 | 1時間 | デプロイ準備 |
| Phase 7 | 1-2時間 | デプロイ |
| Phase 8 | 1時間 | 最終チェック |
| **合計** | **17-25時間** | 初学者の場合はさらに時間がかかる可能性あり |

---

## Tips & Best Practices

### 開発中の注意点
- 各 Phase 終了後に Git コミットを作成する
- 問題が発生したら早めに解決する（先送りしない）
- こまめにテストを実行する
- コードレビューの時間を設ける（可能であれば）

### トラブルシューティング
- CORS エラーが発生した場合は、バックエンドの CORS 設定とフロントエンドの API URL を確認
- OpenAI API エラーが発生した場合は、API キーと使用量を確認
- ビルドエラーが発生した場合は、型エラーと依存関係を確認

### 参考リソース
- 困ったら CLAUDE.md の「参考リソース」セクションを参照
- 各ライブラリの公式ドキュメントを活用
- GitHub Issues や Stack Overflow で類似の問題を検索

---

**作成日**: 2025-12-09
**最終更新**: 2025-12-09
**ステータス**: 準備完了
