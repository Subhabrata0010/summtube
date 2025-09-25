export const NOTES_PROMPT = (text: string) =>
  `You are an expert lecturer. Summarize the following lecture transcript into concise study notes with headings and bullet points. Keep it organized and suitable for quick revision.\n\nTranscript:\n${text}`;

export const FLASHCARDS_PROMPT = (text: string) =>
  `Create 8 short flashcards in JSON array format for the following transcript. Each flashcard should be { "q": "question", "a": "answer" }.\nTranscript:\n${text}`;

export const QUIZ_PROMPT = (text: string) =>
  `Create 6 multiple-choice questions (MCQs) from the transcript. Return as JSON array where each item is { "question": "...", "options": ["a","b","c","d"], "answer": "b" }.\nTranscript:\n${text}`;

export const ANSWER_PROMPT = (transcript: string, question: string) =>
  `You are an assistant answering student questions using only the provided transcript. If the answer isn't in the transcript, say "I couldn't find that in the video transcript." Be concise.

Transcript:
${transcript}

Question:
${question}

Answer:`;
