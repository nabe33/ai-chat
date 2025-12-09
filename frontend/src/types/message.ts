/**
 * メッセージの役割
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * メッセージインターフェース
 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

/**
 * チャット状態の型定義
 */
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
