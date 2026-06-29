"use server";

export async function processEmotionChat(userInput: string, history: {role: string, content?: string}[] = []) {
  // Priority: DigitalOcean Inference (Paid, accurate) > Groq (Free, fallback)
  const doToken = process.env.DO_AI_KEY;
  const groqToken = process.env.GROQ_API_KEY;
  
  if (!doToken && !groqToken) {
    return { error: "कृपया सिस्टममा DO_AI_KEY वा GROQ_API_KEY राख्नुहोस्" };
  }

  const historyText = history.map(m => `${m.role.toUpperCase()}: ${m.content || ''}`).join('\n');

  const prompt = `You are a JW.org research specialist.
Here is the conversation history:
${historyText}

The user's latest query is: "${userInput}"

Your ONLY capacity is to search for spiritual solutions from JW.org. You cannot answer general knowledge questions.
Determine if the user's latest query (with context from history) is making a DIRECT search query or expressing EMOTIONAL pain.

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

export async function generateSpeechAI(topic: string, duration: string, language: string = "English", bibleVerse: string = ""): Promise<{ text?: string; error?: string }> {
  const doToken = process.env.DO_AI_KEY;
  const groqToken = process.env.GROQ_API_KEY;
  
  if (!doToken && !groqToken) {
    return { error: "AI API keys are missing." };
  }

  // Determine length instruction based on duration
  let lengthInstruction = "";
  if (duration === "5 minutes") {
    lengthInstruction = language === "Nepali" ? "Write a short speech that takes about 5 minutes to read (approx 400-500 words)." : "Write a short speech that takes about 5 minutes to read (approx 600-750 words).";
  } else if (duration === "10 minutes") {
    lengthInstruction = language === "Nepali" ? "Write a medium-length speech that takes about 10 minutes to read (approx 800-1000 words)." : "Write a medium-length speech that takes about 10 minutes to read (approx 1200-1500 words).";
  } else if (duration === "30 minutes") {
    lengthInstruction = language === "Nepali" ? "Write a long speech that takes about 30 minutes to read (approx 2500-3000 words)." : "Write a long, detailed, and comprehensive speech that takes about 30 minutes to read (approx 3500-4000 words).";
  } else {
    lengthInstruction = "Write a speech.";
  }

  let verseInstruction = bibleVerse.trim() 
    ? `Please seamlessly integrate this Bible verse into the speech: "${bibleVerse}".`
    : "";

  const langInstruction = language === "Nepali" 
    ? "MUST BE ENTIRELY IN NEPALI LANGUAGE (Devanagari script). Do not use English. The tone MUST be highly natural, warm, and human-like, using conversational Nepali (e.g., 'तपाईंहरूलाई थाहै छ', 'हैन र?'). Avoid robotic or purely literal translations. Apply the points practically and organically as if a real person is speaking from a stage."
    : "MUST BE IN ENGLISH. Make it sound natural and engaging.";

  const prompt = `You are an expert speechwriter. Write a powerful, engaging, and inspiring speech about the following subject/theme: "${topic}".
${lengthInstruction}
${verseInstruction}
${langInstruction}
CRITICAL INSTRUCTION: Your speech MUST be based strictly and entirely on JW.org resources and teachings. When quoting or referring to Bible verses, you MUST ONLY use the New World Translation (NWT) as provided on JW.org. Do NOT use verses or teachings from any other source.
Ensure the speech has a strong opening, a well-structured body with compelling points, and a memorable conclusion. If the language is Nepali, ensure it starts with a warm greeting like 'आदरणीय दाजुभाइ तथा दिदीबहिनीहरू' and flows engagingly. Do not include any meta-text, just the speech itself.`;

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
      signal: AbortSignal.timeout(30000), // Longer timeout for speech generation
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a professional speechwriter." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!res.ok) {
      if (useDigitalOcean && groqToken) {
        return generateSpeechGroqFallback(prompt, groqToken);
      }
      return { error: "Failed to generate speech." };
    }

    const data = await res.json();
    return { text: data.choices?.[0]?.message?.content || "" };
  } catch (error) {
    if (useDigitalOcean && groqToken) {
      return generateSpeechGroqFallback(prompt, groqToken);
    }
    return { error: "Failed to connect to AI server." };
  }
}

async function generateSpeechGroqFallback(prompt: string, token: string): Promise<{ text?: string; error?: string }> {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a professional speechwriter." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!res.ok) return { error: "Both AI providers failed." };

    const data = await res.json();
    return { text: data.choices?.[0]?.message?.content || "" };
  } catch {
    return { error: "All AI servers unreachable." };
  }
}

export async function generateConversationalAnswer(
  chatHistory: { role: string; content?: string }[],
  query: string,
  searchResults: any[],
  lang: string
): Promise<{ text?: string; error?: string }> {
  const doToken = process.env.DO_AI_KEY;
  const groqToken = process.env.GROQ_API_KEY;

  if (!doToken && !groqToken) {
    return { error: "AI API keys are missing." };
  }

  // Format search results for the prompt
  const formattedResults = searchResults.map((r, i) => `[Source ${i + 1}]: ${r.title}\n${r.description || ''}`).join('\n\n');

  // Format chat history
  const historyText = chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content || ''}`).join('\n');

  const langInstruction = lang === "ne"
    ? "You MUST answer entirely in conversational Nepali (Devanagari script). Make it natural, warm, and empathetic. Use terms like 'तपाईं', 'हामी' and sound like a helpful human assistant. Do not sound like a robot."
    : "You MUST answer in English. Make it natural and conversational.";

  const prompt = `You are a helpful and deeply knowledgeable JW.org research assistant.
Your goal is to answer the user's latest question based strictly on the provided JW.org search results.

CRITICAL INSTRUCTIONS:
1. ONLY use the provided search results to answer the question. Do NOT invent information or use outside knowledge. If the answer cannot be found in the results, politely state that you could not find the exact answer on JW.org right now.
2. Provide a direct, conversational, and comprehensive answer to the user's question. Do not just summarize the articles; answer the question organically.
3. ${langInstruction}
4. When quoting the Bible, you MUST only use the New World Translation (NWT).

--- CONVERSATION HISTORY ---
${historyText}

--- LATEST USER QUESTION ---
${query}

--- SEARCH RESULTS FROM JW.ORG ---
${formattedResults}

Answer the latest question in a highly conversational and natural tone:`;

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
        messages: [
          { role: "system", content: "You are a friendly, deeply knowledgeable JW.org research assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5
      })
    });

    if (!res.ok) {
      if (useDigitalOcean && groqToken) {
        return generateConversationalAnswerGroq(prompt, groqToken);
      }
      return { error: "Failed to generate answer." };
    }

    const data = await res.json();
    return { text: data.choices?.[0]?.message?.content || "" };
  } catch (error) {
    if (useDigitalOcean && groqToken) {
      return generateConversationalAnswerGroq(prompt, groqToken);
    }
    return { error: "Failed to connect to AI server." };
  }
}

async function generateConversationalAnswerGroq(prompt: string, token: string): Promise<{ text?: string; error?: string }> {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a friendly, deeply knowledgeable JW.org research assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5
      })
    });

    if (!res.ok) return { error: "Both AI providers failed." };
    const data = await res.json();
    return { text: data.choices?.[0]?.message?.content || "" };
  } catch {
    return { error: "All AI servers unreachable." };
  }
}
