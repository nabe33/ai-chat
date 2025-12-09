/**
 * メッセージの役割
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * メッセージインターフェース
 */
export interface Message {
  role: MessageRole;
  content: string;
}

/**
 * チャットAPIのリクエスト型
 */
export interface ChatRequest {
  messages: Message[];
}

/**
 * チャットAPIのレスポンス型（成功時）
 */
export interface ChatResponse {
  message: Message;
}

/**
 * エラーレスポンス型
 */
export interface ErrorResponse {
  error: {
    message: string;
    code: string;
  };
}
