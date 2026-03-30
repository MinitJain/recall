import { GoogleGenAI } from "@google/genai";

let _ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!_ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

export async function generateTags(
  title: string | null,
  description: string | null
): Promise<string[]> {
  const combined = [title, description].filter(Boolean).join(". ");
  if (!combined) return [];
  // Truncate and strip newlines to prevent prompt injection
  const text = combined.replace(/[\r\n]+/g, " ").slice(0, 500);

  const prompt = `Given this webpage title and description, generate 3 to 5 short, relevant tags (single words or short phrases). Return ONLY a JSON array of strings, no explanation.

Content: ${text}

Example output: ["javascript", "tutorial", "web dev"]`;

  const response = await getClient().models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const raw = response.text ?? "";
  const match = raw.match(/\[[\s\S]*?\]/);
  if (!match) return [];

  try {
    const tags = JSON.parse(match[0]);
    if (!Array.isArray(tags)) return [];
    return tags
      .filter((t): t is string => typeof t === "string")
      .map((t) => t.toLowerCase().trim())
      .slice(0, 5);
  } catch {
    return [];
  }
}
