# AI チャットボット プロジェクト仕様書

## プロジェクト概要

### 目的
プログラム開発とWebサイト作成の学習を支援する教育用AIチャットボット

### 主要利用者
授業の受講者（プログラミング初学者〜中級者）

### 専門分野
- JavaScript
- HTML
- CSS
- Web開発全般

---

## 機能要件

### 必須機能（v1.0）

#### 1. チャット機能
- マルチターン会話対応（直近5ターンの会話履歴を保持）
- リアルタイムでのメッセージ送受信
- ユーザーメッセージとAI応答の明確な区別表示

#### 2. 会話履歴管理
- セッション中のみ会話を保持（ブラウザメモリ内）
- ブラウザリロードまたはタブを閉じると履歴はクリア
- 永続化は不要

#### 3. コンテンツ表示機能
- マークダウン形式のレンダリング
- シンタックスハイライト（JavaScript、HTML、CSS、その他主要言語）
- コードブロックごとにコピーボタンを配置
- インラインコード表示対応

#### 4. エラーハンドリング
- API呼び出し失敗時にユーザーフレンドリーなエラーメッセージを表示
- ネットワークエラー、APIエラー、レート制限エラーの区別
- エラー発生時も会話履歴は維持

#### 5. レスポンシブデザイン
- デスクトップ、タブレット、スマートフォンに対応
- モバイルファーストのアプローチ
- 画面サイズに応じたレイアウト調整

### 非機能要件

#### パフォーマンス
- 初回ロード時間：3秒以内
- メッセージ送信後のAPI応答表示：ストリーミングまたはローディング表示

#### ユーザビリティ
- 直感的なUI/UX
- キーボードショートカット対応（例：Enter で送信）
- 送信中の視覚的フィードバック

#### セキュリティ
- APIキーはサーバーサイドで管理（クライアントに露出しない）
- CORS設定の適切な管理
- XSS対策（マークダウンレンダリング時のサニタイズ）

---

## 技術スタック

### フロントエンド
- **フレームワーク**: React (with TypeScript)
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **パッケージマネージャー**: npm
- **ランタイム**: Node.js (v18以上推奨)

#### 主要ライブラリ
- `react-markdown`: マークダウンレンダリング
- `react-syntax-highlighter`: シンタックスハイライト
- `axios` または `fetch API`: HTTP通信

### バックエンド
- **フレームワーク**: Express.js (TypeScript)
- **ランタイム**: Node.js
- **API通信**: OpenAI API

#### 主要ライブラリ
- `express`: サーバーフレームワーク
- `openai`: OpenAI公式SDKまたはAPIクライアント
- `cors`: CORS設定
- `dotenv`: 環境変数管理

### デプロイ
- **プラットフォーム**: Vercel
- **フロントエンド**: Vercelに静的サイトとしてデプロイ
- **バックエンド**: Vercel Serverless Functions または 別途APIサーバー

### AI/LLM
- **プロバイダー**: OpenAI
- **モデル**: GPT-4 または GPT-3.5-turbo（コスト効率により選択）
- **APIキー**: 取得済み（環境変数で管理）

---

## システム構成

### アーキテクチャ
```
[フロントエンド (React + Vite)]
         ↓ HTTP/HTTPS
[バックエンド (Express API)]
         ↓ HTTPS
[OpenAI API]
```

### ディレクトリ構造（推奨）
```
ai-chat/
├── frontend/                 # フロントエンド
│   ├── src/
│   │   ├── components/       # Reactコンポーネント
│   │   │   ├── Chat.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── hooks/            # カスタムフック
│   │   │   └── useChat.ts
│   │   ├── types/            # 型定義
│   │   │   └── message.ts
│   │   ├── utils/            # ユーティリティ関数
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                  # バックエンド
│   ├── src/
│   │   ├── routes/           # APIルート
│   │   │   └── chat.ts
│   │   ├── services/         # ビジネスロジック
│   │   │   └── openai.ts
│   │   ├── middleware/       # ミドルウェア
│   │   │   └── errorHandler.ts
│   │   ├── types/            # 型定義
│   │   ├── utils/            # ユーティリティ関数
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── README.md                 # プロジェクト全体のドキュメント
```

---

## API設計

### エンドポイント

#### POST /api/chat
チャットメッセージを送信し、AI応答を取得

**リクエスト**
```json
{
  "messages": [
    {
      "role": "user" | "assistant",
      "content": "string"
    }
  ]
}
```

**レスポンス（成功時）**
```json
{
  "message": {
    "role": "assistant",
    "content": "string"
  }
}
```

**レスポンス（エラー時）**
```json
{
  "error": {
    "message": "string",
    "code": "string"
  }
}
```

#### GET /api/health
ヘルスチェック用エンドポイント

**レスポンス**
```json
{
  "status": "ok"
}
```

---

## データモデル

### Message型
```typescript
interface Message {
  id: string;              // 一意のメッセージID
  role: 'user' | 'assistant' | 'system';
  content: string;         // メッセージ本文
  timestamp: Date;         // 送信日時
}
```

### ChatState型（フロントエンド）
```typescript
interface ChatState {
  messages: Message[];     // 会話履歴（最大5ターン = 10メッセージ）
  isLoading: boolean;      // 送信中フラグ
  error: string | null;    // エラーメッセージ
}
```

---

## システムプロンプト

OpenAI APIに送信する初期システムプロンプト：

```
あなたはプログラミング教育に特化したAIアシスタントです。
主にJavaScript、HTML、CSSを学ぶ学生をサポートします。

以下の原則に従ってください：
1. 初学者にもわかりやすく、段階的に説明する
2. コード例は具体的で実行可能なものを提供する
3. ベストプラクティスを教えるが、まずは動くコードを優先する
4. エラーの原因と解決方法を明確に説明する
5. 適切な場合は、MDNやW3Cなどの信頼できるリソースを推奨する
6. コードにはコメントを適切に含める

質問に答える際は、以下を意識してください：
- コードブロックは```言語名で囲む
- 重要な概念はマークダウンの**太字**で強調
- リスト形式で整理された情報を提供
```

---

## UI/UX仕様

### カラースキーム（Tailwind CSS）
- **背景**: bg-gray-50（ライトモード）
- **チャットエリア**: bg-white、shadow、rounded
- **ユーザーメッセージ**: bg-blue-500、text-white
- **AIメッセージ**: bg-gray-200、text-gray-800
- **コードブロック**: bg-gray-900、text-gray-100
- **エラーメッセージ**: bg-red-100、text-red-700

### レイアウト
```
+----------------------------------+
|         ヘッダー                  |
|  (タイトル、説明)                 |
+----------------------------------+
|                                  |
|    メッセージ表示エリア           |
|    (スクロール可能)               |
|                                  |
|    [ユーザーメッセージ]           |
|    [AIメッセージ]                 |
|    [コードブロック + コピーボタン] |
|                                  |
+----------------------------------+
|  [入力フィールド] [送信ボタン]    |
+----------------------------------+
```

### コンポーネント仕様

#### MessageInput
- テキストエリア（複数行対応）
- Enter キーで送信（Shift+Enterで改行）
- 送信中は入力を無効化
- 最小高さ: 3行、最大高さ: 10行（自動拡張）

#### CodeBlock
- 言語名の表示
- シンタックスハイライト
- 右上にコピーボタン配置
- コピー成功時に視覚的フィードバック（「コピーしました」）

#### ErrorMessage
- 画面上部または入力エリア上部に表示
- 閉じるボタン付き
- 自動で5秒後に消える（オプション）

---

## 開発フロー

### 1. セットアップ
```bash
# フロントエンド
cd frontend
npm install

# バックエンド
cd backend
npm install
cp .env.example .env
# .envファイルにOPENAI_API_KEYを設定
```

### 2. 開発サーバー起動
```bash
# フロントエンド（ポート: 5173）
cd frontend
npm run dev

# バックエンド（ポート: 3001）
cd backend
npm run dev
```

### 3. ビルド
```bash
# フロントエンド
cd frontend
npm run build

# バックエンド
cd backend
npm run build
```

### 4. デプロイ（Vercel）

#### フロントエンド
```bash
cd frontend
vercel --prod
```

#### バックエンド
- Vercel Serverless Functionsとして構成
- または別途APIサーバーをデプロイ（Railway、Render等）

---

## 環境変数

### バックエンド (.env)
```bash
# OpenAI API
OPENAI_API_KEY=sk-...

# サーバー設定
PORT=3001
NODE_ENV=development

# CORS設定
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app
```

### フロントエンド (.env)
```bash
# API URL
VITE_API_URL=http://localhost:3001/api  # 開発環境
# VITE_API_URL=https://your-backend.vercel.app/api  # 本番環境
```

---

## テスト要件

### 必須テスト項目

#### フロントエンド
1. **ユニットテスト**（推奨ツール: Vitest + React Testing Library）
   - コンポーネントのレンダリング
   - ユーザーインタラクション（メッセージ送信、コードコピー）
   - エラー表示

2. **手動テスト項目**
   - レスポンシブデザインの確認（Chrome DevTools）
   - 各ブラウザでの動作確認（Chrome、Firefox、Safari）
   - マークダウン表示の確認
   - シンタックスハイライトの確認

#### バックエンド
1. **ユニットテスト**（推奨ツール: Jest）
   - OpenAI APIクライアントのモック
   - エラーハンドリング
   - レスポンス形式の検証

2. **統合テスト**
   - エンドポイントの動作確認
   - CORS設定の確認

#### テストケース例

**正常系**
- ユーザーがメッセージを送信すると、AI応答が返ってくる
- コードブロックが正しくハイライトされる
- コピーボタンでコードがクリップボードにコピーされる

**異常系**
- API呼び出しが失敗した場合、エラーメッセージが表示される
- ネットワークエラー時の処理
- 空のメッセージを送信しようとした場合の処理

**境界値**
- 会話履歴が5ターンを超えた場合、古いメッセージが削除される
- 非常に長いメッセージの処理
- 特殊文字を含むメッセージの処理

---

## セキュリティ要件

### 必須対応
1. **APIキーの保護**
   - 環境変数で管理
   - クライアントサイドに露出させない
   - `.env`ファイルを`.gitignore`に追加

2. **CORS設定**
   - 許可するオリジンを明示的に指定
   - 本番環境では実際のドメインのみ許可

3. **入力のサニタイゼーション**
   - マークダウンレンダリング時のXSS対策
   - `react-markdown`の`allowedElements`オプション使用を検討

4. **レート制限（将来的な実装）**
   - API呼び出しの制限
   - DoS攻撃対策

---

## 今後の拡張機能（v2.0以降）

以下は初期バージョンでは実装せず、将来的に追加を検討する機能：

### 優先度: 高
- 会話履歴の永続化（ローカルストレージまたはデータベース）
- 会話のリセット機能
- プリセットプロンプト（よくある質問への素早いアクセス）
- ダークモード対応

### 優先度: 中
- ファイルアップロード機能（コードレビュー用）
- 複数の会話スレッド管理
- エクスポート機能（会話を保存）
- ストリーミングレスポンス（リアルタイムで応答を表示）

### 優先度: 低
- ユーザー認証・管理
- 利用統計の表示
- 多言語対応（日本語以外）
- 音声入力対応

---

## パフォーマンス最適化

### フロントエンド
- コンポーネントのメモ化（React.memo、useMemo、useCallback）
- コード分割（React.lazy、Suspense）
- 画像の最適化（必要に応じて）
- Tailwind CSSの未使用クラスの削除（purge設定）

### バックエンド
- OpenAI APIのレスポンスキャッシュ（同一質問の場合）
- 接続プーリング（データベース使用時）
- レスポンスの圧縮（gzip）

---

## 監視とロギング

### 推奨事項
- エラーログの記録（バックエンド）
- API使用量の監視（OpenAI Dashboard）
- パフォーマンスメトリクスの収集（Vercel Analytics）

---

## ドキュメント要件

### 必須ドキュメント
1. **README.md**
   - プロジェクト概要
   - セットアップ手順
   - 開発・デプロイ手順
   - 環境変数の説明

2. **コード内コメント**
   - 複雑なロジックの説明
   - 型定義の説明

3. **API仕様書**（オプション）
   - OpenAPI (Swagger) 形式での記述

---

## 開発ガイドライン

### TypeScript
- strict モード有効化
- 明示的な型定義を優先
- any 型の使用は最小限に

### コーディング規約
- ESLint + Prettier の使用
- 一貫したファイル命名規則（kebab-case または PascalCase）
- コンポーネントは単一責任の原則に従う

### Git ワークフロー
- ブランチ戦略: Git Flow または GitHub Flow
- コミットメッセージ: Conventional Commits 形式推奨
- プルリクエストでのコードレビュー

---

## 成功基準

### v1.0 リリース時の基準
- [ ] ユーザーがメッセージを送信し、AI応答を受け取れる
- [ ] マークダウンとコードが正しく表示される
- [ ] コードのコピー機能が動作する
- [ ] レスポンシブデザインが実装されている
- [ ] エラーが適切に処理・表示される
- [ ] Vercel に正常にデプロイできる
- [ ] 主要ブラウザで動作する
- [ ] 基本的なテストが実装されている

---

## 参考リソース

### 公式ドキュメント
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vercel Documentation](https://vercel.com/docs)

### ライブラリ
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)

---

## 連絡先・サポート

- プロジェクトオーナー: [あなたの名前/連絡先]
- 問題報告: GitHub Issues（リポジトリ作成後）

---

**最終更新日**: 2025-12-09
**バージョン**: 1.0
**ステータス**: 仕様確定、実装準備完了
