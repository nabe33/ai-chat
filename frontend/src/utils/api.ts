import axios from 'axios';

// API ベース URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// axios インスタンスの作成
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30秒タイムアウト
});

// リクエストインターセプター（必要に応じて認証トークンなどを追加）
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（エラーハンドリング）
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // サーバーがエラーレスポンスを返した場合
      const errorMessage = error.response.data?.error?.message || 'サーバーエラーが発生しました';
      throw new Error(errorMessage);
    } else if (error.request) {
      // リクエストは送信されたがレスポンスがない
      throw new Error('サーバーに接続できません。ネットワーク接続を確認してください');
    } else {
      // リクエストの設定中にエラーが発生
      throw new Error('リクエストの処理中にエラーが発生しました');
    }
  }
);
