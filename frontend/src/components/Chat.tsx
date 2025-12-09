import { useChat } from '../hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ErrorMessage } from './ErrorMessage';

export function Chat() {
  const { messages, isLoading, error, sendMessage, clearError } = useChat();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">AI プログラミングアシスタント</h1>
        <p className="text-sm text-blue-100 mt-1">
          JavaScript・HTML・CSS の学習をサポートします
        </p>
      </header>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* エラーメッセージ */}
        {error && (
          <div className="px-4 pt-4">
            <ErrorMessage message={error} onClose={clearError} />
          </div>
        )}

        {/* メッセージリスト */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* 入力エリア */}
        <MessageInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
