import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/message';

/**
 * グローバルエラーハンドラーミドルウェア
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // エラーログを出力
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // エラーメッセージからエラーコードを判定
  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';

  if (error.message.includes('APIキーが無効')) {
    statusCode = 500;
    errorCode = 'INVALID_API_KEY';
  } else if (error.message.includes('リクエスト制限')) {
    statusCode = 429;
    errorCode = 'RATE_LIMIT_EXCEEDED';
  } else if (error.message.includes('OpenAI')) {
    statusCode = 502;
    errorCode = 'OPENAI_API_ERROR';
  }

  // エラーレスポンスを返す
  const errorResponse: ErrorResponse = {
    error: {
      message: error.message || 'サーバーエラーが発生しました',
      code: errorCode,
    },
  };

  res.status(statusCode).json(errorResponse);
}
