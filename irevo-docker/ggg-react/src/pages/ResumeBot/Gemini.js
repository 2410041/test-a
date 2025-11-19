// 面接練習の評価・アドバイス用プロンプト
const EVALUATION_PROMPT = `あなたは面接官です。以下はユーザーとの面接練習の全やりとりです。全体を通しての評価と、今後のアドバイスを200文字以内で日本語で出してください。\n\n【ユーザーの発言一覧】\n`;
import { BASE_PROMPT } from "./Prompt.js";
// 面接練習の評価・アドバイスを取得する関数
export async function getInterviewEvaluation(userMessages) {
  const prompt = `${EVALUATION_PROMPT}${userMessages}`;
  return await chatWithGemini(prompt);
}
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log("API Key exists:", !!apiKey); // デバッグ用

const genAI = new GoogleGenerativeAI(apiKey);

// 基本プロンプト（例）


export const chatWithGemini = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 基本プロンプトとユーザー入力を結合
    const fullPrompt = `${BASE_PROMPT}\nユーザー: ${message}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);

    if (error.message.includes('API key')) {
      return "APIキーが正しく設定されていません。";
    } else if (error.message.includes('404')) {
      return "APIエンドポイントが見つかりません。モデル名を確認してください。";
    } else {
      return `エラー: ${error.message}`;
    }
  }
};