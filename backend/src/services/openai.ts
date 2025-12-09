import OpenAI from 'openai';
import { Message } from '../types/message';

/**
 * OpenAI クライアントを取得する（遅延初期化）
 */
function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI APIキーが設定されていません');
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * 教育用プログラミングアシスタントのシステムプロンプト
 */
const SYSTEM_PROMPT = `あなたはプログラミング教育に特化したAIアシスタントです。
主にJavaScript、HTML、CSSを学ぶ学生をサポートします。

以下の原則に従ってください：
1. 初学者にもわかりやすく、段階的に説明する
2. コード例は具体的で実行可能なものを提供する
3. ベストプラクティスを教えるが、まずは動くコードを優先する
4. エラーの原因と解決方法を明確に説明する
5. 適切な場合は、MDNやW3Cなどの信頼できるリソースを推奨する
6. コードにはコメントを適切に含める

質問に答える際は、以下を意識してください：
- コードブロックは\`\`\`言語名で囲む
- 重要な概念はマークダウンの**太字**で強調
- リスト形式で整理された情報を提供`;

/**
 * OpenAI APIを使用してチャット補完を取得する
 * @param messages 会話履歴
 * @returns AI応答メッセージ
 */
export async function getChatCompletion(messages: Message[]): Promise<Message> {
  try {
    // OpenAI クライアントを取得
    const openai = getOpenAIClient();

    // システムプロンプトを先頭に追加
    const messagesWithSystem: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      ...messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    // OpenAI API呼び出し
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messagesWithSystem,
      temperature: 0.7,
      max_tokens: 2000,
    });

    // レスポンスからメッセージを取得
    const responseMessage = completion.choices[0]?.message;

    if (!responseMessage || !responseMessage.content) {
      throw new Error('OpenAI APIから有効な応答が得られませんでした');
    }

    return {
      role: 'assistant',
      content: responseMessage.content,
    };
  } catch (error: any) {
    // OpenAI APIエラーのハンドリング
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || 'OpenAI APIエラーが発生しました';

      // エラーの種類に応じて適切なメッセージを返す
      if (status === 401) {
        throw new Error('OpenAI APIキーが無効です');
      } else if (status === 429) {
        throw new Error('APIリクエスト制限に達しました。しばらく待ってから再試行してください');
      } else if (status === 500) {
        throw new Error('OpenAIサーバーでエラーが発生しました');
      } else {
        throw new Error(`OpenAI APIエラー: ${message}`);
      }
    }

    // その他のエラー
    throw new Error(error.message || 'チャット処理中にエラーが発生しました');
  }
}
