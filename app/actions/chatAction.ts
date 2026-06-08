"use server";

export async function processEmotionChat(userInput: string) {
  // Priority: DigitalOcean Inference (Paid, accurate) > Groq (Free, fallback)
  const doToken = process.env.DO_AI_KEY;
  const groqToken = process.env.GROQ_API_KEY;
  
  if (!doToken && !groqToken) {
    return { error: "कृपया सिस्टममा DO_AI_KEY वा GROQ_API_KEY राख्नुहोस्" };
  }

  const prompt = `You are a JW.org research specialist and multilingual keyword extractor.

The user says: "${userInput}"

Your task:
1. LANGUAGE DETECTION: Detect the user's language precisely.
   - If they write in Romanized Nepali (e.g. "malai chinta lagyo", "dukhi chhu"), return "ne".
   - If they write in Devanagari Nepali (e.g. "मलाई चिन्ता लाग्यो"), return "ne".
   - If they write in English, return "en".
   - If they write in Hindi, return "hi".
   - For any other language, return the correct ISO 639-1 code.

2. KEYWORD EXTRACTION: Extract 2-4 highly relevant search keywords that would find the BEST articles on jw.org's Watchtower Online Library (wol.jw.org).
   - Keywords MUST be in the DETECTED language (e.g. if Nepali, use Nepali Devanagari words like "चिन्ता", "निराशा").
   - Think deeply about what the user is feeling or asking about.
   - Choose keywords that would match JW.org article titles and topics.
   - If the user mentions emotions, map them to biblical/spiritual topics (e.g. "lonely" → "loneliness comfort", "scared" → "fear courage faith").

Output ONLY valid JSON:
{"language": "code", "keywords": "keyword1 keyword2 keyword3"}`;

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
      body: JSON.stringify({
        model,
        response_format: useDigitalOcean ? undefined : { type: "json_object" },
        messages: [
          { role: "system", content: "You are a strict JSON-only responder. Never output anything other than valid JSON." },
          { role: "user", content: prompt }
        ],
        max_completion_tokens: 100,
        temperature: 0.3
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
        if (parsed.language) lang = parsed.language;
        if (parsed.keywords) keywords = parsed.keywords;
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
        max_tokens: 100,
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

