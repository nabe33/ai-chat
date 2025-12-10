# GitHub Actions 自動デプロイ - クイックセットアップ

## 取得済みの情報

以下の情報を使用してGitHubシークレットを設定してください：

### Organization ID
```
team_ilQq2HWNP2PoXz88dKv5wNsv
```

### Frontend Project ID
```
prj_kcvK6hcJSAjmyj0o0i1e0tBgMkzv
```

### Backend Project ID
```
prj_TQdpRfb8xGbLKyUZ7BVgLxaS3aAm
```

---

## セットアップ手順（3ステップ）

### ステップ1: Vercel APIトークンを取得

1. [Vercel Settings - Tokens](https://vercel.com/account/tokens) にアクセス
2. **Create Token** をクリック
3. Token Name: `github-actions-ai-chat`
4. Scope: **Full Account** を選択
5. **Create** をクリック
6. 表示されたトークンをコピー（⚠️ 一度しか表示されません）

### ステップ2: GitHubシークレットを設定

1. https://github.com/nabe33/ai-chat/settings/secrets/actions にアクセス
2. 以下の4つのシークレットを追加：

#### 1. VERCEL_TOKEN
- Name: `VERCEL_TOKEN`
- Value: ステップ1で取得したトークン

#### 2. VERCEL_ORG_ID
- Name: `VERCEL_ORG_ID`
- Value: `team_ilQq2HWNP2PoXz88dKv5wNsv`

#### 3. VERCEL_FRONTEND_PROJECT_ID
- Name: `VERCEL_FRONTEND_PROJECT_ID`
- Value: `prj_kcvK6hcJSAjmyj0o0i1e0tBgMkzv`

#### 4. VERCEL_BACKEND_PROJECT_ID
- Name: `VERCEL_BACKEND_PROJECT_ID`
- Value: `prj_TQdpRfb8xGbLKyUZ7BVgLxaS3aAm`

### ステップ3: 動作確認

この手順書をコミット・プッシュして動作を確認：

```bash
git add .
git commit -m "Add GitHub Actions deployment workflows"
git push
```

GitHubの [Actions タブ](https://github.com/nabe33/ai-chat/actions) で実行状況を確認できます。

---

## 自動デプロイの動作

### いつデプロイされるか

- **フロントエンド**: `frontend/`ディレクトリ内のファイルが変更されて`main`にプッシュされた時
- **バックエンド**: `backend/`ディレクトリ内のファイルが変更されて`main`にプッシュされた時

### デプロイURL

- **フロントエンド**: https://frontend-nu-ten-17.vercel.app
- **バックエンド**: https://backend-blue-two-90.vercel.app

エイリアスは自動的に設定されます。

---

## トラブルシューティング

### ワークフローが実行されない
- `frontend/`または`backend/`ディレクトリ内のファイルが変更されているか確認
- `.github/workflows/`のファイルも一緒にプッシュされているか確認

### デプロイが失敗する
1. [Actions タブ](https://github.com/nabe33/ai-chat/actions)でエラーログを確認
2. シークレットが正しく設定されているか確認
3. Vercelトークンが有効か確認

---

詳細な手順は [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md) を参照してください。
