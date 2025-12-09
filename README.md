# AI プログラミングアシスタント

プログラム開発とWebサイト作成の学習を支援する教育用AIチャットボット

## 概要

このアプリケーションは、JavaScript・HTML・CSSを学ぶ学生をサポートするために開発された教育用AIチャットボットです。OpenAI APIを使用し、プログラミング学習に特化した会話を提供します。

### 主な特徴

- マルチターン会話対応（直近5ターンの会話履歴を保持）
- マークダウン形式のレスポンス表示
- シンタックスハイライト機能
- コードブロックのワンクリックコピー機能
- レスポンシブデザイン（デスクトップ・タブレット・スマートフォン対応）
- 日本語IME入力対応

## 技術スタック

### フロントエンド
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- react-markdown
- react-syntax-highlighter
- axios

### バックエンド
- Node.js
- Express.js + TypeScript
- OpenAI API (GPT-3.5-turbo)
- CORS, dotenv

## 前提条件

- Node.js v18以上
- npm
- OpenAI APIキー

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd ai-chat
```

### 2. バックエンドのセットアップ

```bash
cd backend
npm install
```

`.env`ファイルを作成し、以下の環境変数を設定：

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### 3. フロントエンドのセットアップ

```bash
cd ../frontend
npm install
```

`.env`ファイルを作成し、以下の環境変数を設定：

```bash
VITE_API_URL=http://localhost:3001
```

## 開発サーバーの起動

### バックエンド

```bash
cd backend
npm run dev
```

サーバーは http://localhost:3001 で起動します。

### フロントエンド

```bash
cd frontend
npm run dev
```

アプリケーションは http://localhost:5173 で起動します。

## ビルド

### バックエンド

```bash
cd backend
npm run build
```

ビルド成果物は`dist/`ディレクトリに生成されます。

### フロントエンド

```bash
cd frontend
npm run build
```

ビルド成果物は`dist/`ディレクトリに生成されます。

## プロジェクト構造

```
ai-chat/
├── backend/
│   ├── src/
│   │   ├── middleware/      # エラーハンドラーなどのミドルウェア
│   │   ├── routes/          # APIルート定義
│   │   ├── services/        # OpenAI APIサービス
│   │   ├── types/           # TypeScript型定義
│   │   └── server.ts        # Expressサーバーエントリーポイント
│   ├── .env                 # 環境変数（gitignore対象）
│   ├── .env.example         # 環境変数テンプレート
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reactコンポーネント
│   │   ├── hooks/           # カスタムフック
│   │   ├── types/           # TypeScript型定義
│   │   ├── utils/           # ユーティリティ関数
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env                 # 環境変数（gitignore対象）
│   ├── .env.example         # 環境変数テンプレート
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── CLAUDE.md                # プロジェクト仕様書
├── TODO.md                  # 実行計画
└── README.md                # このファイル
```

## API仕様

### POST /api/chat

チャットメッセージを送信し、AI応答を取得します。

**リクエスト:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "JavaScriptの変数宣言について教えてください"
    }
  ]
}
```

**レスポンス:**

```json
{
  "message": {
    "role": "assistant",
    "content": "JavaScriptでは、変数を宣言する方法として..."
  }
}
```

**エラーレスポンス:**

```json
{
  "error": {
    "message": "エラーメッセージ",
    "code": "ERROR_CODE"
  }
}
```

### GET /api/health

サーバーのヘルスチェック用エンドポイント。

**レスポンス:**

```json
{
  "status": "ok"
}
```

## 使用方法

1. 開発サーバーを起動後、ブラウザで http://localhost:5173 にアクセス
2. テキストエリアにプログラミングに関する質問を入力
3. Enterキーまたは「送信」ボタンでメッセージを送信
4. AIからの応答を確認
5. コードブロックの「コピー」ボタンでコードをクリップボードにコピー可能

### キーボードショートカット

- `Enter`: メッセージを送信
- `Shift + Enter`: 改行を挿入

## トラブルシューティング

### Tailwind CSSのスタイルが適用されない

Tailwind CSS v4では`@import "tailwindcss";`を使用する必要があります。`index.css`を確認してください。

### CORS エラーが発生する

バックエンドの`.env`ファイルの`ALLOWED_ORIGINS`にフロントエンドのURLが含まれているか確認してください。

### OpenAI API エラーが発生する

- APIキーが正しく設定されているか確認
- OpenAI APIの使用量制限を確認
- ネットワーク接続を確認

### 日本語入力時にEnterキーで送信されてしまう

`MessageInput.tsx`でIME（Input Method Editor）の変換中を検知する`onCompositionStart`/`onCompositionEnd`が実装されています。最新のコードを使用しているか確認してください。

## デプロイ

### Vercelへのデプロイ

詳細は[TODO.md](TODO.md)のPhase 7を参照してください。

基本的な手順：

1. Vercel CLIをインストール
2. バックエンドとフロントエンドをそれぞれデプロイ
3. 環境変数を設定
4. 本番環境でのテスト

## ライセンス

このプロジェクトは教育目的で作成されています。

## 参考リソース

- [React公式ドキュメント](https://react.dev/)
- [Vite公式ドキュメント](https://vitejs.dev/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/)
- [OpenAI API公式ドキュメント](https://platform.openai.com/docs)
- [Express.js公式ドキュメント](https://expressjs.com/)

## 貢献

プロジェクトの改善提案やバグ報告は、GitHubのIssueまたはPull Requestでお願いします。

---

**作成日**: 2025-12-09
**バージョン**: 1.0.0
