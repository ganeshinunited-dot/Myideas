const cheerio = require("cheerio");

async function test() {
  const q = encodeURIComponent("दुःख");
  const url = `https://www.jw.org/ne/search/?q=${q}`;
  console.log("Fetching:", url);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const results = [];
    $('.searchResults .searchResult').each((i, el) => {
      const titleEl = $(el).find('h3 a');
      const title = titleEl.text().trim();
      const link = "https://www.jw.org" + titleEl.attr('href');
      const desc = $(el).find('.synopsis').text().trim() || "JW.org Content";
      
      if (title && link) {
        results.push({ title, link, desc });
      }
    });

    console.log("Results found:", results.length);
    console.log(results);
  } catch(e) {
    console.error(e);
  }
}
test();
