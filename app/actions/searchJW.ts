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
};

export function getSupportedLanguages() {
  return Object.entries(LANGUAGES).map(([code, info]) => ({
    code,
    label: info.label,
    nativeLabel: info.nativeLabel,
  }));
}

export async function searchJW(query: string, tab: string = "all", lang: string = "en") {
  const langConfig = LANGUAGES[lang] || LANGUAGES.en;

  try {
    if (tab === "all") {
      // 1. Fetch text results from Watchtower Online Library (search endpoint)
      const wolQuery = encodeURIComponent(query);
      const searchUrl = `https://wol.jw.org/${langConfig.urlLang}/wol/s/${langConfig.region}/${langConfig.lp}?q=${wolQuery}`;
      
      const res = await fetch(searchUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const html = await res.text();
      const $ = cheerio.load(html);
      
      const texts: any[] = [];

      // Method 1: Parse Topic results (common in English)
      $('ul.directory.resultContentTopic').each((_i, el) => {
        if (texts.length >= 10) return;
        const title = $(el).find('li.caption a.lnk').text().trim();
        let link = $(el).find('li.caption a.lnk').attr('href');
        if (link && link.startsWith('/')) link = 'https://wol.jw.org' + link;
        const snippet = $(el).find('li.result li.ref').text().trim() || $(el).find('li.result li').text().trim();
        
        if (title && link) {
          texts.push({ title, link, description: snippet, image: null });
        }
      });

      // Method 2: Parse Document results (common in Nepali/other languages)
      if (texts.length === 0) {
        $('a.lnk').each((_i, el) => {
          if (texts.length >= 10) return;
          const title = $(el).text().trim();
          let link = $(el).attr('href');
          if (link && link.startsWith('/')) link = 'https://wol.jw.org' + link;
          // Remove query params from display link
          if (link) {
            const parentLi = $(el).closest('li');
            const snippet = parentLi.next('li.result').find('li.ref').text().trim() 
              || parentLi.parent().find('li.ref').text().trim()
              || '';

            if (title && link) {
              texts.push({ title, link: link.split('?')[0], description: snippet || title, image: null });
            }
          }
        });
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
