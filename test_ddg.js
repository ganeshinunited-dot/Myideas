const cheerio = require("cheerio");

async function test() {
  const query = "site:jw.org दुःख";
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  console.log("Fetching:", url);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const results = [];
    $('.result').each((i, el) => {
      const title = $(el).find('.result__title a').text().trim();
      const link = $(el).find('.result__url').attr('href');
      const snippet = $(el).find('.result__snippet').text().trim();

      if (title && link) {
        results.push({ title, link, description: snippet });
      }
    });

    console.log(`Found ${results.length} results.`);
    console.log(results.slice(0, 3));
  } catch(e) {
    console.error(e);
  }
}
test();
