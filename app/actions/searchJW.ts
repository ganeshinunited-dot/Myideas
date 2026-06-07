"use server";
import * as cheerio from "cheerio";
import google from "googlethis";

export async function searchJW(query: string, tab: string = "all") {
  try {
    if (tab === "all") {
      // 1. Fetch text results from Watchtower Online Library
      const wolQuery = encodeURIComponent(query);
      const searchUrl = `https://wol.jw.org/en/wol/l/r1/lp-e?q=${wolQuery}`;
      
      const res = await fetch(searchUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const html = await res.text();
      const $ = cheerio.load(html);
      
      const texts: any[] = [];
      $('ul.directory.resultContentTopic').each((i, el) => {
        if (texts.length >= 10) return;
        const title = $(el).find('li.caption a.lnk').text().trim();
        let link = $(el).find('li.caption a.lnk').attr('href');
        if (link && link.startsWith('/')) link = 'https://wol.jw.org' + link;
        const snippet = $(el).find('li.result li.ref').text().trim() || $(el).find('li.result li').text().trim();
        
        if (title && link) {
          texts.push({ title, link, description: snippet, image: null });
        }
      });

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
