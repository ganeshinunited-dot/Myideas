"use server";
import * as cheerio from "cheerio";
import google from "googlethis";

// Language configuration for WOL (Watchtower Online Library)
const LANGUAGES: Record<string, { urlLang: string; region: string; lp: string; label: string; nativeLabel: string }> = {
  en: { urlLang: "en", region: "r1",   lp: "lp-e",  label: "English",  nativeLabel: "English" },
  ne: { urlLang: "ne", region: "r56",  lp: "lp-np", label: "Nepali",   nativeLabel: "नेपाली" },
  hi: { urlLang: "hi", region: "r108", lp: "lp-hi", label: "Hindi",    nativeLabel: "हिन्दी" },
  es: { urlLang: "es", region: "r4",   lp: "lp-s",  label: "Spanish",  nativeLabel: "Español" },
  fr: { urlLang: "fr", region: "r30",  lp: "lp-f",  label: "French",   nativeLabel: "Français" },
  pt: { urlLang: "pt", region: "r5",   lp: "lp-t",  label: "Portuguese", nativeLabel: "Português" },
  de: { urlLang: "de", region: "r10",  lp: "lp-x",  label: "German",   nativeLabel: "Deutsch" },
  it: { urlLang: "it", region: "r6",   lp: "lp-i",  label: "Italian",  nativeLabel: "Italiano" },
  ja: { urlLang: "ja", region: "r7",   lp: "lp-j",  label: "Japanese", nativeLabel: "日本語" },
  ko: { urlLang: "ko", region: "r8",   lp: "lp-ko", label: "Korean",   nativeLabel: "한국어" },
  ru: { urlLang: "ru", region: "r2",   lp: "lp-u",  label: "Russian",  nativeLabel: "Русский" },
  zh: { urlLang: "zh-hans", region: "r23", lp: "lp-chs", label: "Chinese", nativeLabel: "中文" },
};


export async function searchJW(query: string, tab: string = "all", lang: string = "en") {
  const langConfig = LANGUAGES[lang] || LANGUAGES.en;

  try {
    if (tab === "all") {
      const texts: any[] = [];

      // 1. Fetch Text/Articles from Google (Searches entire JW ecosystem: Music, Videos, Articles)
      try {
        const googleResponse = await google.search(`site:jw.org OR site:wol.jw.org ${query}`, {
          page: 0,
          safe: false,
          additional_params: { hl: lang } // Prefer results in user's language
        });
        
        if (googleResponse && googleResponse.results && googleResponse.results.length > 0) {
          googleResponse.results.slice(0, 50).forEach(res => {
            texts.push({
              title: res.title,
              link: res.url,
              description: res.description || "JW.org Content",
              image: null
            });
          });
        }
      } catch (e) {
        console.error("Google text search error:", e);
      }

      // 1.b Fallback to DuckDuckGo Scraper if Google fails or returns nothing (Searches main jw.org)
      if (texts.length === 0) {
        try {
          // Add language keyword to force language results in DDG if needed, though site:jw.org handles it mostly.
          const ddgQuery = encodeURIComponent(`site:jw.org ${query}`);
          const searchUrl = `https://html.duckduckgo.com/html/?q=${ddgQuery}`;
          
          const res = await fetch(searchUrl, {
              headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': `${langConfig.urlLang},en-US;q=0.9,en;q=0.8`
              }
          });
          const html = await res.text();
          const $ = cheerio.load(html);

          $('.result').each((_i, el) => {
            if (texts.length >= 50) return;
            const title = $(el).find('.result__title a').text().trim();
            const link = $(el).find('.result__url').attr('href');
            const description = $(el).find('.result__snippet').text().trim() || "JW.org Content";
            
            if (title && link) {
              // Expand DDG redirect URL if needed, but DDG HTML usually gives direct URLs in .result__url
              const finalLink = link.startsWith('//') ? 'https:' + link : link;
              texts.push({ title, link: finalLink, description, image: null });
            }
          });
        } catch (e) {
          console.error("DDG scrape error:", e);
        }
      }

      // 2. Fetch Images from Google
      let images: any[] = [];
      try {
        const imgResponse = await google.image(`site:jw.org ${query}`, { safe: false });
        images = imgResponse
            .filter(img => img.origin && img.origin.website && (img.origin.website.domain === 'jw.org' || img.origin.website.domain === 'wol.jw.org'))
            .slice(0, 6)
            .map(img => ({
                title: img.origin.title,
                link: img.origin.website.url,
                description: "JW.org Image",
                image: img.url
            }));
      } catch(e) {}

      // 3. Fetch Videos from Google
      let videos: any[] = [];
      try {
        const vidResponse = await google.image(`site:jw.org ${query} video`, { safe: false });
        videos = vidResponse
            .filter(img => img.origin && img.origin.website && (img.origin.website.domain === 'jw.org' || img.origin.website.domain === 'wol.jw.org'))
            .slice(0, 6)
            .map(img => ({
                title: img.origin.title,
                link: img.origin.website.url,
                description: "JW.org Video",
                image: img.url
            }));
      } catch(e) {}

      return { texts, images, videos };

    } else if (tab === "images" || tab === "videos") {
      const googleQuery = `site:jw.org ${query} ${tab === "videos" ? "video" : ""}`.trim();
      const imgResponse = await google.image(googleQuery, { safe: false });
      const validImgs = imgResponse.filter(img => 
        img.origin && img.origin.website && (img.origin.website.domain === 'jw.org' || img.origin.website.domain === 'wol.jw.org')
      );

      const results = validImgs.slice(0, 30).map(img => ({
        title: img.origin.title,
        link: img.origin.website.url,
        description: img.origin.website.domain.toUpperCase() + (tab === 'videos' ? ' Video' : ' Image'),
        image: img.url
      }));
      return { results };
    }

    return { results: [] };
  } catch (error) {
    console.error("Search error:", error);
    return { error: "An error occurred." };
  }
}
