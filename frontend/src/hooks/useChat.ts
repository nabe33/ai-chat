import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from '../utils/api';
import type { Message, ChatState } from '../types/message';

const MAX_MESSAGES = 10; // 5ターン = 10メッセージ（ユーザー5 + アシスタント5）

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  /**
   * メッセージを送信し、AI応答を取得
   */
  const sendMessage = useCallback(async (content: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // ユーザーメッセージを追加
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }));

      // API呼び出し用のメッセージ履歴を準備
      // 最新のMAX_MESSAGESメッセージのみを送信
      const messagesToSend = [...state.messages, userMessage]
        .slice(-MAX_MESSAGES)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // バックエンドAPIにリクエスト
      const response = await apiClient.post('/chat', {
        messages: messagesToSend,
      });

      // AI応答を追加
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response.data.message.content,
        timestamp: new Date(),
      };

      setState((prev) => ({
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'メッセージの送信に失敗しました',
      }));
    }
  }, [state.messages]);

  /**
   * エラーをクリア
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearError,
  };
}
