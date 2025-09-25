const HF_ASR_URL = "https://adios0010-asr.hf.space";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function callASR(audioUrl: string) {
  const res = await fetch(`${HF_ASR_URL}/transcribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: audioUrl }),
  });
  return res.json();
}

async function callGemini(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro", // newer + faster than gemini-pro
    contents: prompt,
  });
  return response.text ?? "";
}

export async function getNotes(transcript: string) {
  return callGemini(
    `Generate comprehensive study notes (structured, well-formatted) from the following transcript:\n\n${transcript}`
  );
}

export async function getQuiz(transcript: string) {
  return callGemini(
    `Generate 10 multiple-choice quiz questions (with 4 options and correct answers) from this transcript:\n\n${transcript}`
  );
}

export async function askChatbot(transcript: string, question: string) {
  return callGemini(`${transcript}\n\nQ: ${question}\nA:`);
}
