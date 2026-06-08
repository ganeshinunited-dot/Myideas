"use server";

export async function processEmotionChat(userInput: string) {
  // Priority: DigitalOcean Inference (Paid, accurate) > Groq (Free, fallback)
  const doToken = process.env.DO_AI_KEY;
  const groqToken = process.env.GROQ_API_KEY;
  
  if (!doToken && !groqToken) {
    return { error: "कृपया सिस्टममा DO_AI_KEY वा GROQ_API_KEY राख्नुहोस्" };
  }

  const prompt = `You are an empathetic, highly intelligent JW.org research specialist.

The user says: "${userInput}"

Your task is to analyze the user's hidden pain, tone, and intent, and then extract the best possible search keywords to find comforting JW.org articles.

1. DEEP THINKING & TONE ANALYSIS:
   - Think deeply about what the user is truly experiencing. If they say "dukha" (sorrow/pain) or "kaam chhaina" (jobless), they need hope, encouragement, or reasons why suffering exists.
   - Map their raw feelings to JW.org's specific article categories (e.g. "Why does God allow suffering?", "Coping with grief", "Finding hope", "Overcoming anxiety", "Family problems").

2. LANGUAGE DETECTION:
   - Precisely detect their language.
   - If Romanized Nepali (e.g. "malai dukha lagyo", "maru jasto lagchha"), return "ne" (Nepali).
   - If Devanagari Nepali (e.g. "मलाई दुःख लाग्यो"), return "ne".
   - English = "en", Hindi = "hi", etc. Return the official 2-letter ISO code.

3. KEYWORD EXTRACTION:
   - Generate 3-5 highly accurate, targeted search keywords IN THE DETECTED LANGUAGE that will yield the best results on Watchtower Online Library (wol.jw.org).
   - For Nepali, use exact Devanagari JW terms (e.g., if they are sad, use words like "दुःख", "सान्त्वना", "आशा", "परमेश्वरले किन").
   - For English, use terms like "suffering", "comfort", "hope", "anxiety", "depression".
   - Do NOT just repeat the user's words. Translate their feeling into the spiritual/biblical solution keywords related to their problem.

Output ONLY valid JSON:
{"language": "code", "keywords": "word1 word2 word3 word4"}`;

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
          { role: "user", content: "You are a strict JSON-only responder. Never output anything other than valid JSON.\n\n" + prompt }
        ],
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

