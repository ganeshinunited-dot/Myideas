"use server";

export async function processEmotionChat(userInput: string) {
  const token = process.env.GROQ_API_KEY;
  
  if (!token) {
    return { error: "कृपया सिस्टममा GROQ_API_KEY राख्नुहोस् (Please add API key to .env)" };
  }

  const prompt = `You are a strict keyword extractor. 
The user says: "${userInput}". 
1. Detect their language. If it's Nepali or Romanized Nepali, use "ne". If English, use "en".
2. Extract 1 or 2 search keywords IN THAT EXACT LANGUAGE (e.g. if Nepali, output "चिन्ता", "निराशा").
Output ONLY a valid JSON object in this exact format:
{"language": "en_or_ne", "keywords": "extracted_keywords"}`;

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
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("AI API Error:", errText);
      return { error: `API Error: ${res.status}. Please check if the model is available or the token is valid.` };
    }

    const data = await res.json();
    const text = data.choices[0].message.content;

    let keywords = "comfort";
    let lang = "en";

    try {
      const parsed = JSON.parse(text);
      if (parsed.language) lang = parsed.language;
      if (parsed.keywords) keywords = parsed.keywords;
    } catch(e) {
      console.error("JSON parse error:", e);
    }

    return { keywords, lang };
  } catch (error) {
    console.error("Chat Action Error:", error);
    return { error: "Failed to connect to AI server." };
  }
}
