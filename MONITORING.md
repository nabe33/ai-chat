# 監視とメンテナンスガイド

このドキュメントでは、AI プログラミングアシスタントの監視とメンテナンス方法について説明します。

## 1. アクセス解析（Vercel Analytics）

### 概要
Vercel Analyticsが有効化されており、以下の情報を収集します：
- ページビュー数
- ユニークビジター数
- デバイス・ブラウザ情報
- 地理的分布

### アクセス方法
1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. プロジェクト「frontend」を選択
3. 「Analytics」タブをクリック

### 確認すべき指標
- **日次アクセス数**: アプリの利用状況
- **エラー率**: 問題の早期発見
- **パフォーマンス**: Core Web Vitalsの推移

---

## 2. エラーログの監視

### バックエンドエラーログ

#### Vercelログの確認方法
```bash
# CLIからログを確認
vercel logs https://backend-blue-two-90.vercel.app

# または特定のデプロイメントのログ
vercel logs <deployment-url>
```

#### Vercel Dashboardでの確認
1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. プロジェクト「backend」を選択
3. 「Deployments」タブから該当のデプロイメントを選択
4. 「Logs」セクションでリアルタイムログを確認

#### 監視すべきエラー
- **500エラー**: サーバー内部エラー
- **OpenAI API エラー**: API制限、認証エラー
- **CORS エラー**: オリジン設定の問題
- **環境変数エラー**: 設定の欠落や誤り

### フロントエンドエラーログ

#### ブラウザコンソールでの確認
本番環境でエラーが発生した場合：
1. ブラウザの開発者ツールを開く（F12）
2. 「Console」タブを確認
3. エラーメッセージとスタックトレースを記録

#### Vercel Analyticsでのエラー確認
Vercel Analyticsの「Errors」セクションで、クライアント側のエラーを確認できます。

---

## 3. OpenAI API 使用量の監視

### OpenAI Platformでの確認

#### アクセス方法
1. [OpenAI Platform](https://platform.openai.com/)にログイン
2. 「Usage」セクションを開く

#### 監視すべき指標
- **日次トークン使用量**: API利用状況
- **コスト**: 月次予算の管理
- **レート制限**: 429エラーの発生状況
- **エラー率**: APIの成功率

#### 推奨アクション
- **アラート設定**: 月次予算の80%到達時に通知
- **使用量制限**: OpenAI Platformで月次制限を設定
- **コスト最適化**: 必要に応じてモデルをgpt-3.5-turboからgpt-4-turbo-previewに変更

### コスト予測

#### GPT-3.5-turbo 価格（2025年1月時点）
- Input: $0.50 / 1M tokens
- Output: $1.50 / 1M tokens

#### 使用量の目安
平均的な会話（5ターン）:
- Input: 約1,000トークン
- Output: 約500トークン
- コスト: 約$0.0013/会話

月間1,000会話の場合: 約$1.30/月

---

## 4. パフォーマンス監視

### Lighthouse定期監査

#### 実行方法
```bash
# CLIからLighthouse実行
npx lighthouse https://frontend-nu-ten-17.vercel.app \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=html \
  --output-path=./lighthouse-report.html
```

#### 目標スコア
- Performance: 85以上
- Accessibility: 85以上
- Best Practices: 95以上
- SEO: 85以上

### Core Web Vitals

Vercel Analyticsで以下の指標を監視：
- **LCP (Largest Contentful Paint)**: 2.5秒以下
- **FID (First Input Delay)**: 100ms以下
- **CLS (Cumulative Layout Shift)**: 0.1以下

---

## 5. セキュリティ監視

### 環境変数の確認

#### 定期的にチェックすべき項目
```bash
# バックエンドの環境変数確認
vercel env ls

# 重要な変数が設定されているか確認
# - OPENAI_API_KEY
# - ALLOWED_ORIGINS
# - NODE_ENV
```

#### セキュリティベストプラクティス
- APIキーは定期的にローテーション（3-6ヶ月ごと）
- `.env`ファイルがGitにコミットされていないか確認
- CORS設定が適切か確認

### 依存関係の脆弱性チェック

```bash
# バックエンド
cd backend
npm audit

# フロントエンド
cd frontend
npm audit

# 自動修正（安全な場合）
npm audit fix
```

---

## 6. アラート設定（推奨）

### Vercelアラート
Vercel Dashboardで設定可能：
- デプロイメント失敗時
- エラー率の急上昇時
- パフォーマンス低下時

### OpenAI アラート
OpenAI Platformで設定：
- 使用量が予算の80%に達した時
- レート制限エラーが頻発した時

---

## 7. 定期メンテナンススケジュール

### 日次
- [ ] Vercel Analyticsでアクセス状況を確認
- [ ] エラーログをチェック

### 週次
- [ ] OpenAI API使用量を確認
- [ ] コストを確認

### 月次
- [ ] 依存関係の脆弱性チェック（`npm audit`）
- [ ] Lighthouse監査実行
- [ ] パフォーマンス指標のレビュー

### 四半期ごと
- [ ] OpenAI APIキーのローテーション
- [ ] 依存関係のアップデート（メジャーバージョン）
- [ ] セキュリティパッチの適用

---

## 8. トラブルシューティング

### よくある問題と解決方法

#### 問題: CORSエラー
**症状**: ブラウザコンソールに "CORS policy violation"
**解決**:
```bash
# ALLOWED_ORIGINSを確認
vercel env ls

# 正しい値に更新
vercel env rm ALLOWED_ORIGINS production
printf "https://frontend-nu-ten-17.vercel.app" | vercel env add ALLOWED_ORIGINS production
vercel --prod  # 再デプロイ
```

#### 問題: OpenAI APIエラー
**症状**: 500エラー、"OpenAI API error"
**解決**:
1. OpenAI Platformで使用量を確認
2. APIキーが有効か確認
3. レート制限に達していないか確認

#### 問題: パフォーマンス低下
**症状**: ページ読み込みが遅い
**解決**:
1. Lighthouseでボトルネックを特定
2. Vercel Analyticsでパフォーマンス指標を確認
3. 必要に応じてコード分割や画像最適化を実施

---

## 9. 連絡先・リソース

### ドキュメント
- [Vercel Documentation](https://vercel.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [React Documentation](https://react.dev/)

### サポート
- Vercelサポート: https://vercel.com/support
- OpenAIサポート: https://help.openai.com/

---

**最終更新**: 2025-12-09
