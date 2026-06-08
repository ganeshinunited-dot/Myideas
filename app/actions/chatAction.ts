"use server";

export async function processEmotionChat(userInput: string) {
  const token = process.env.GROQ_API_KEY;
  
  if (!token) {
    return { error: "कृपया सिस्टममा GROQ_API_KEY राख्नुहोस् (Please add API key to .env)" };
  }

  const prompt = `You are a strict keyword extractor for a search engine. 
The user says: "${userInput}". 
Analyze their true intent.
1. Detect their language. If it's Nepali or Romanized Nepali, the code is "ne". If English, "en".
2. Extract 1 or 2 search keywords IN THAT EXACT LANGUAGE (e.g. if Nepali, output "चिन्ता", "निराशा". If English, "anxiety", "depression").
DO NOT write any other words or conversational text. Output EXACTLY in this format:
LANGUAGE_CODE: [en or ne]
KEYWORDS: [keywords]`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
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

    const langMatch = text.match(/LANGUAGE_CODE:\s*(en|ne)/i);
    const keyMatch = text.match(/KEYWORDS:\s*(.*)/i);

    if (langMatch && langMatch[1]) lang = langMatch[1].toLowerCase();
    if (keyMatch && keyMatch[1]) keywords = keyMatch[1].trim();

    return { keywords, lang };
  } catch (error) {
    console.error("Chat Action Error:", error);
    return { error: "Failed to connect to AI server." };
  }
}
