# GitHub Actions自動デプロイ設定ガイド

このドキュメントでは、GitHub Actionsを使用したVercelへの自動デプロイの設定方法を説明します。

## 必要なシークレット情報

以下のシークレットをGitHubリポジトリに設定する必要があります：

1. **VERCEL_TOKEN**: Vercel APIトークン
2. **VERCEL_ORG_ID**: VercelのOrganization ID
3. **VERCEL_FRONTEND_PROJECT_ID**: フロントエンドプロジェクトID
4. **VERCEL_BACKEND_PROJECT_ID**: バックエンドプロジェクトID

---

## ステップ1: Vercel APIトークンの取得

### 1.1 Vercelにログイン
1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. アカウントにログイン

### 1.2 トークンの作成
1. 右上のアカウントアイコンをクリック
2. **Settings** > **Tokens** を選択
3. **Create Token** をクリック
4. トークン名を入力（例: `github-actions`）
5. Scope: **Full Account**を選択
6. Expiration: 用途に応じて設定（推奨: No Expiration）
7. **Create** をクリック
8. 表示されたトークンをコピー（**一度しか表示されません！**）

**重要**: このトークンは後で使用するため、安全な場所に保存してください。

---

## ステップ2: Organization IDの取得

### 方法1: Vercel CLI
```bash
vercel whoami
```

出力例:
```
> nabe33s-projects
> Email: your-email@example.com
```

この場合、`nabe33s-projects`がOrganization IDです。

### 方法2: Vercel Dashboard
1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. Settings > General
3. "Team ID"をコピー

---

## ステップ3: プロジェクトIDの取得

### フロントエンドプロジェクトID

#### 方法1: Vercel CLI
```bash
cd frontend
vercel link
# プロジェクトをリンク後
cat .vercel/project.json
```

出力例:
```json
{
  "orgId": "team_xxxx",
  "projectId": "prj_yyyy"
}
```

`projectId`の値をコピーしてください。

#### 方法2: Vercel Dashboard
1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. フロントエンドプロジェクト（`frontend`）を選択
3. Settings > General
4. "Project ID"をコピー

### バックエンドプロジェクトID

同様の手順でバックエンドプロジェクト（`backend`）のIDを取得します。

```bash
cd backend
vercel link
cat .vercel/project.json
```

---

## ステップ4: GitHubシークレットの設定

### 4.1 GitHubリポジトリにアクセス
1. GitHubリポジトリ https://github.com/nabe33/ai-chat にアクセス
2. **Settings** タブをクリック

### 4.2 シークレットの追加
1. 左サイドバーの **Secrets and variables** > **Actions** をクリック
2. **New repository secret** をクリック

### 4.3 各シークレットを追加

#### VERCEL_TOKEN
- Name: `VERCEL_TOKEN`
- Secret: ステップ1で取得したトークン
- **Add secret** をクリック

#### VERCEL_ORG_ID
- Name: `VERCEL_ORG_ID`
- Secret: ステップ2で取得したOrganization ID（例: `team_ilQq2HWNP2PoXz88dKv5wNsv`）
- **Add secret** をクリック

#### VERCEL_FRONTEND_PROJECT_ID
- Name: `VERCEL_FRONTEND_PROJECT_ID`
- Secret: フロントエンドのプロジェクトID（例: `prj_xxxx`）
- **Add secret** をクリック

#### VERCEL_BACKEND_PROJECT_ID
- Name: `VERCEL_BACKEND_PROJECT_ID`
- Secret: バックエンドのプロジェクトID（例: `prj_yyyy`）
- **Add secret** をクリック

---

## ステップ5: 動作確認

### 5.1 ワークフローファイルの確認
以下のファイルが存在することを確認：
- `.github/workflows/deploy-frontend.yml`
- `.github/workflows/deploy-backend.yml`

### 5.2 テストデプロイ

#### フロントエンドの変更をテスト
```bash
# 小さな変更を加える
cd frontend
echo "// Test change" >> src/App.tsx

# コミット＆プッシュ
git add .
git commit -m "Test: Trigger frontend deployment"
git push
```

#### バックエンドの変更をテスト
```bash
# 小さな変更を加える
cd backend
echo "// Test change" >> src/server.ts

# コミット＆プッシュ
git add .
git commit -m "Test: Trigger backend deployment"
git push
```

### 5.3 GitHub Actionsの確認
1. GitHubリポジトリの **Actions** タブにアクセス
2. 実行中のワークフローを確認
3. 緑色のチェックマークが表示されれば成功

---

## ワークフローの動作

### トリガー条件

#### フロントエンド (`deploy-frontend.yml`)
- **本番デプロイ**: `main`ブランチへのプッシュ + `frontend/`ディレクトリの変更
- **プレビューデプロイ**: `main`ブランチへのPR + `frontend/`ディレクトリの変更

#### バックエンド (`deploy-backend.yml`)
- **本番デプロイ**: `main`ブランチへのプッシュ + `backend/`ディレクトリの変更
- **プレビューデプロイ**: `main`ブランチへのPR + `backend/`ディレクトリの変更

### デプロイフロー

1. **コードチェックアウト**: リポジトリのコードを取得
2. **Node.jsセットアップ**: Node.js v22をインストール
3. **依存関係インストール**: `npm ci`で依存関係を高速インストール
4. **ビルド**: `npm run build`でプロジェクトをビルド
5. **Vercelデプロイ**: Vercelにデプロイ
6. **エイリアス設定**: 本番環境の場合、固定URLにエイリアスを設定

---

## トラブルシューティング

### 問題: ワークフローが失敗する

#### エラー: "Invalid token"
**原因**: VERCEL_TOKENが正しくない
**解決**:
1. Vercelで新しいトークンを作成
2. GitHubシークレットを更新

#### エラー: "Project not found"
**原因**: プロジェクトIDが間違っている
**解決**:
1. `vercel link`でプロジェクトIDを再確認
2. GitHubシークレットを更新

#### エラー: "Build failed"
**原因**: ビルドエラー
**解決**:
1. ローカルで`npm run build`を実行してエラーを確認
2. エラーを修正してから再度プッシュ

### 問題: デプロイは成功するがエイリアスが設定されない

**原因**: `vercel alias`コマンドの権限不足
**解決**:
1. Vercel Dashboardで手動でエイリアスを確認
2. 必要に応じて手動で設定

---

## セキュリティのベストプラクティス

### シークレットの管理
1. **トークンの定期的なローテーション**: 3-6ヶ月ごとに新しいトークンを作成
2. **最小権限の原則**: 必要な権限のみを付与
3. **トークンの共有禁止**: チームメンバーとトークンを共有しない

### アクセス制限
1. GitHub ActionsはmainブランチからのみVercelにデプロイ
2. PRはプレビュー環境にのみデプロイ
3. 本番環境へのデプロイには承認プロセスを追加（オプション）

---

## 高度な設定

### デプロイ前のテスト実行

ワークフローにテストステップを追加：

```yaml
- name: Run tests
  run: |
    cd frontend
    npm test
```

### Slack通知の追加

デプロイ成功・失敗時にSlackに通知：

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Frontend deployment completed'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 環境変数の動的設定

Vercel環境変数をGitHub Actionsから設定：

```yaml
- name: Set environment variables
  run: |
    vercel env add VITE_API_URL production --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 参考リソース

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [amondnet/vercel-action](https://github.com/amondnet/vercel-action)

---

**最終更新**: 2025-12-09
**ステータス**: 設定完了
