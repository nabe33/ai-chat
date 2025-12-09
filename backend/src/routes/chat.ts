import { Router, Request, Response, NextFunction } from 'express';
import { getChatCompletion } from '../services/openai';
import { ChatRequest, ChatResponse, ErrorResponse } from '../types/message';

const router = Router();

/**
 * POST /api/chat
 * チャットメッセージを送信し、AI応答を取得
 */
router.post('/chat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messages }: ChatRequest = req.body;

    // リクエストバリデーション
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      const errorResponse: ErrorResponse = {
        error: {
          message: 'メッセージが指定されていません',
          code: 'INVALID_REQUEST',
        },
      };
      return res.status(400).json(errorResponse);
    }

    // 各メッセージのバリデーション
    for (const message of messages) {
      if (!message.role || !message.content) {
        const errorResponse: ErrorResponse = {
          error: {
            message: 'メッセージの形式が不正です',
            code: 'INVALID_MESSAGE_FORMAT',
          },
        };
        return res.status(400).json(errorResponse);
      }

      if (!['user', 'assistant'].includes(message.role)) {
        const errorResponse: ErrorResponse = {
          error: {
            message: 'メッセージのroleは "user" または "assistant" である必要があります',
            code: 'INVALID_ROLE',
          },
        };
        return res.status(400).json(errorResponse);
      }
    }

    // OpenAI APIを呼び出し
    const assistantMessage = await getChatCompletion(messages);

    // レスポンスを返す
    const response: ChatResponse = {
      message: assistantMessage,
    };

    res.json(response);
  } catch (error: any) {
    // エラーハンドリングは次のミドルウェアに委譲
    next(error);
  }
});

/**
 * GET /api/health
 * ヘルスチェックエンドポイント
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default router;
