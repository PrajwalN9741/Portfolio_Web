import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Securely loaded from env
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  const { message } = req.body || {};
  if (!message) return res.status(400).json({ reply: "No message provided" });

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      max_tokens: 700,
    });

    const reply = (completion?.choices?.[0]?.message?.content) || "Sorry, no response.";
    res.status(200).json({ reply });
  } catch (e) {
    console.error("OpenAI error:", e);
    res.status(500).json({ reply: "Error from AI." });
  }
}
