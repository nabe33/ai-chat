import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat';
import { errorHandler } from './middleware/errorHandler';

// 環境変数の読み込み
dotenv.config();

// Expressアプリケーションの作成
const app: Application = express();
const PORT = process.env.PORT || 3001;

// CORS設定
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // originがundefinedの場合（同じオリジンからのリクエスト）は許可
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation'));
      }
    },
    credentials: true,
  })
);

// JSONパーサーの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルートの登録
app.use('/api', chatRoutes);

// ルートエンドポイント
app.get('/', (_req, res) => {
  res.json({
    message: 'AI Chat Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      chat: 'POST /api/chat',
    },
  });
});

// エラーハンドラーの登録（最後に配置）
app.use(errorHandler);

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);

  // 環境変数のチェック
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  Warning: OPENAI_API_KEY is not set in environment variables');
  } else {
    console.log('✅ OpenAI API key is configured');
  }
});

export default app;
