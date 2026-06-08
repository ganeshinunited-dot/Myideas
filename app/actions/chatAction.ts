"use server";

export async function processEmotionChat(userInput: string) {
  // Priority: DigitalOcean Inference (Paid, accurate) > Groq (Free, fallback)
  const doToken = process.env.DO_AI_KEY;
  const groqToken = process.env.GROQ_API_KEY;
  
  if (!doToken && !groqToken) {
    return { error: "कृपया सिस्टममा DO_AI_KEY वा GROQ_API_KEY राख्नुहोस्" };
  }

  const prompt = `You are an empathetic JW.org research specialist.
The user says: "${userInput}"

Analyze their emotional pain and intent. Extract the BEST search keywords for Watchtower Online Library.

CRITICAL RULES:
1. Detect the language. If the user writes in Romanized Nepali (e.g., "malai dukha lagyo") or Devanagari, the language MUST be "ne". If English, "en".
2. KEYWORDS MUST BE IN DEVANAGARI SCRIPT if the language is "ne". Never output romanized nepali keywords. Example: "dukha" -> "दुःख", "santi" -> "शान्ति".
3. Use spiritual JW terms (e.g., "बाइबलको सान्त्वना", "दुःखकष्ट", "परिवार").
4. DO NOT repeat the user's exact words. Translate them into 2-3 precise JW.org search terms.

Output valid JSON ONLY:
{"language": "ne", "keywords": "दुःख सान्त्वना आशा"}
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
      signal: AbortSignal.timeout(6000), // Prevent indefinite hanging
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

    try {
      // Extract JSON from response (handle cases where model wraps in markdown)
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.language) lang = parsed.language.toLowerCase();
        if (parsed.keywords) keywords = parsed.keywords;
        
        // Normalize language codes
        if (lang.includes("ne") || lang === "np" || lang === "nepali") lang = "ne";
        if (lang.includes("en") || lang === "english") lang = "en";
      }
    } catch(e) {
      console.error("JSON parse error:", e);
    }

    return { keywords, lang };
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

    try {
      const parsed = JSON.parse(text);
      if (parsed.language) lang = parsed.language;
      if (parsed.keywords) keywords = parsed.keywords;
    } catch(e) {}

    return { keywords, lang };
  } catch {
    return { error: "All AI servers unreachable." };
  }
}

