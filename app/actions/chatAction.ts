"use server";

export async function processEmotionChat(userInput: string) {
  // Priority: DigitalOcean Inference (Paid, accurate) > Groq (Free, fallback)
  const doToken = process.env.DO_AI_KEY;
  const groqToken = process.env.GROQ_API_KEY;
  
  if (!doToken && !groqToken) {
    return { error: "कृपया सिस्टममा DO_AI_KEY वा GROQ_API_KEY राख्नुहोस्" };
  }

  const prompt = `You are a JW.org research specialist.
The user says: "${userInput}"

Your ONLY capacity is to search for spiritual solutions from JW.org. You cannot answer general knowledge questions.
Determine if the user is making a DIRECT search query or expressing EMOTIONAL pain.

CRITICAL RULES:
1. Detect the language. If Romanized Nepali (e.g., "malai dukha lagyo") or Devanagari, language MUST be "ne". If English, "en".
2. KEYWORDS MUST BE IN DEVANAGARI SCRIPT if the language is "ne". Never output romanized nepali keywords.
3. KEYWORD EXTRACTION LOGIC:
   - If it's a DIRECT SEARCH (e.g., "why does god allow suffering", "awaken magazine about family", "मृत्यु"), extract the EXACT keywords from their query translated to the target script. DO NOT add random emotional words.
   - If it's EMOTIONAL PAIN (e.g., "I am very sad", "my dad died"), extract precise JW.org spiritual solution terms (e.g., "बाइबलको सान्त्वना", "आशा", "मृत्यु").
4. Output 2 to 4 highly accurate search keywords.

Output valid JSON ONLY with the following structure:
{
  "reasoning": "Explain your thought process. Note that your ONLY purpose is to find relevant answers from JW.org.",
  "language": "ne",
  "keywords": "exact search terms"
}
`;

  // Determine which API to use
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
      signal: AbortSignal.timeout(6000), // Fast timeout
      body: JSON.stringify({
        model,
        response_format: useDigitalOcean ? undefined : { type: "json_object" },
        messages: [
          { role: "user", content: "You strictly output JSON. \n\n" + prompt }
        ],
        temperature: 0.2
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("AI API Error:", errText);
      
      // If DigitalOcean fails, fallback to Groq
      if (useDigitalOcean && groqToken) {
        console.log("Falling back to Groq API...");
        return processWithGroqFallback(userInput, groqToken, prompt);
      }
      
      return { error: `API Error: ${res.status}` };
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";

    let keywords = "comfort";
    let lang = "en";
    let message = "";
    let reasoning = "";

    try {
      // Extract JSON from response (handle cases where model wraps in markdown)
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.reasoning) reasoning = parsed.reasoning;
        if (parsed.language) lang = parsed.language.toLowerCase();
        if (parsed.keywords) keywords = parsed.keywords;
        if (parsed.message) message = parsed.message;
        
        // Normalize language codes
        if (lang.includes("ne") || lang === "np" || lang === "nepali") lang = "ne";
        if (lang.includes("en") || lang === "english") lang = "en";
      }
    } catch(e) {
      console.error("JSON parse error:", e);
    }

    return { reasoning, keywords, lang, message };
  } catch (error) {
    console.error("Chat Action Error:", error);
    
    // If DigitalOcean network fails, fallback to Groq
    if (useDigitalOcean && groqToken) {
      console.log("Network error, falling back to Groq...");
      return processWithGroqFallback(userInput, groqToken, prompt);
    }
    
    return { error: "Failed to connect to AI server." };
  }
}

// Fallback function using Groq (free tier)
async function processWithGroqFallback(userInput: string, token: string, prompt: string) {
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
        max_tokens: 150,
        temperature: 0.3
      })
    });

    if (!res.ok) return { error: "Both AI providers failed." };

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";

    let keywords = "comfort";
    let lang = "en";
    let message = "";
    let reasoning = "";

    try {
      const parsed = JSON.parse(text);
      if (parsed.reasoning) reasoning = parsed.reasoning;
      if (parsed.language) lang = parsed.language.toLowerCase();
      if (parsed.keywords) keywords = parsed.keywords;
      if (parsed.message) message = parsed.message;
      
      if (lang.includes("ne") || lang === "np" || lang === "nepali") lang = "ne";
      if (lang.includes("en") || lang === "english") lang = "en";
    } catch(e) {}

    return { reasoning, keywords, lang, message };
  } catch {
    return { error: "All AI servers unreachable." };
  }
}

