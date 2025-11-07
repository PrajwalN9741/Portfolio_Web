// api/chat.js
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ALLOWED_ORIGIN = "https://prajwaln9741.github.io"; // replace with your GH Pages origin or use "*" for testing

export default async function handler(req, res) {
  // Basic CORS
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set.");
    return res.status(500).json({ reply: "Server misconfiguration: API key missing" });
  }

  let body;
  try {
    body = req.body ?? (req.rawBody ? JSON.parse(req.rawBody) : {});
  } catch (e) {
    console.error("Invalid JSON body:", e);
    return res.status(400).json({ reply: "Invalid JSON body" });
  }

  const message = body.message;
  if (!message) return res.status(400).json({ reply: "No message provided" });

  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      max_tokens: 700,
    });

    const reply = completion?.choices?.[0]?.message?.content ?? "No response";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    const publicMsg = err?.message ? `AI error: ${err.message}` : "AI error occurred";
    return res.status(500).json({ reply: publicMsg });
  }
}
