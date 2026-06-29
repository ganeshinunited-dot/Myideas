"use server";

export async function prepareMinistry(situation: string, lang: string = "en") {
  const doToken = process.env.DO_AI_KEY;
  const groqToken = process.env.GROQ_API_KEY;

  if (!doToken && !groqToken) {
    return { error: "AI API keys are missing." };
  }

  const langInstruction = lang === "ne"
    ? "You MUST answer entirely in conversational Nepali (Devanagari script). Use a warm, encouraging, and respectful tone."
    : "You MUST answer in English. Use a warm, encouraging, and respectful tone.";

  const prompt = `You are a highly experienced and encouraging Jehovah's Witness minister.
The user is preparing for the field ministry and has provided their current situation or territory type: "${situation}".

Based on JW.org principles and the *Apply Yourself to Reading and Teaching* or *Love People Make Disciples* brochures:
Provide tailored advice for this specific situation.

CRITICAL INSTRUCTIONS:
1. ${langInstruction}
2. You must return your response as a strictly valid JSON object (no markdown formatting, no code blocks) with the following exact keys:
   - "topic": A brief title for the suggested conversation topic (1-5 words).
   - "scripture": A relevant Bible scripture from the New World Translation (NWT). E.g., "Revelation 21:3, 4" or "2 Timothy 3:1-5".
   - "advice": Practical, brief advice on how to approach the person in this specific situation (2-3 sentences).
   - "starter": A direct, word-for-word conversation starter the publisher can say (1-2 sentences).

Do NOT include any extra text outside the JSON object.`;

  const useDigitalOcean = !!doToken;
  const apiUrl = useDigitalOcean
    ? "https://inference.do-ai.run/v1/chat/completions"
    : "https://api.groq.com/openai/v1/chat/completions";
  const apiKey = useDigitalOcean ? doToken : groqToken;
  const model = useDigitalOcean ? "llama3.3-70b-instruct" : "llama-3.3-70b-versatile";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a JW Ministry Assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5
      })
    });

    if (!res.ok) {
      if (useDigitalOcean && groqToken) {
        return prepareMinistryGroqFallback(prompt, groqToken);
      }
      return { error: "Failed to generate advice." };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    
    try {
      return JSON.parse(content);
    } catch (e) {
      // If the model fails to return clean JSON
      const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
      return JSON.parse(jsonStr);
    }
  } catch (error) {
    if (useDigitalOcean && groqToken) {
      return prepareMinistryGroqFallback(prompt, groqToken);
    }
    return { error: "Failed to connect to AI server." };
  }
}

async function prepareMinistryGroqFallback(prompt: string, token: string) {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a JW Ministry Assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5
      })
    });

    if (!res.ok) return { error: "Both AI providers failed." };
    
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    try {
      return JSON.parse(content);
    } catch (e) {
      const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
      return JSON.parse(jsonStr);
    }
  } catch {
    return { error: "All AI servers unreachable." };
  }
}
