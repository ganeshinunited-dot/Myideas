"use server";

export async function processEmotionChat(userInput: string) {
  const token = process.env.HF_TOKEN || process.env.AI_API_KEY;
  
  if (!token) {
    return { error: "कृपया सिस्टममा HF_TOKEN वा AI_API_KEY राख्नुहोस् (Please add API key to .env)" };
  }

  const prompt = `You are a strict keyword extractor for a search engine. 
The user says: "${userInput}". 
Analyze their true intent, emotion, or question.
Output ONLY 1 or 2 english keywords that represent their core issue or topic (e.g. anxiety, purpose of life, marriage, stress, hope).
DO NOT write any other words, explanations, or conversational text. ONLY output the keywords.`;

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

    // The AI is instructed to ONLY output the keywords.
    const keywords = text.replace(/[^a-zA-Z\s,]/g, '').trim();

    return { keywords };
  } catch (error) {
    console.error("Chat Action Error:", error);
    return { error: "Failed to connect to AI server." };
  }
}
