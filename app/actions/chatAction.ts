"use server";

export async function processEmotionChat(userInput: string) {
  const token = process.env.HF_TOKEN || process.env.AI_API_KEY;
  
  if (!token) {
    return { error: "कृपया सिस्टममा HF_TOKEN वा AI_API_KEY राख्नुहोस् (Please add API key to .env)" };
  }

  const prompt = `You are a deeply empathetic assistant. The user says: "${userInput}". 
Reply with a warm, comforting paragraph in the exact SAME language the user used (e.g. if they typed in Romanized Nepali like 'garo chha', reply in Romanized Nepali). Keep it under 4 sentences.
At the very end of your response, on a new line, write EXACTLY: KEYWORDS: [1 or 2 english keywords representing their core issue, e.g. anxiety, stress].`;

  try {
    const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3-8B-Instruct", // Reliable HF model
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("AI API Error:", errText);
      return { error: `API Error: ${res.status}. Please check if the model is available or the token is valid.` };
    }

    const data = await res.json();
    const text = data.choices[0].message.content;

    // Parse the response
    const keywordMatch = text.match(/KEYWORDS:\s*(.*)/i);
    let keywords = "comfort";
    let message = text;

    if (keywordMatch && keywordMatch[1]) {
      keywords = keywordMatch[1].replace(/[^a-zA-Z\s,]/g, '').trim();
      message = text.replace(keywordMatch[0], '').trim();
    }

    return { message, keywords };
  } catch (error) {
    console.error("Chat Action Error:", error);
    return { error: "Failed to connect to AI server." };
  }
}
