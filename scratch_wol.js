const cheerio = require('cheerio');
const https = require('https');

// Test both /s/ (search) and /l/ (lookup) for Nepali
const urls = [
  { label: 'Nepali /s/', url: 'https://wol.jw.org/ne/wol/s/r56/lp-np?q=jesus' },
  { label: 'English /s/', url: 'https://wol.jw.org/en/wol/s/r1/lp-e?q=jesus' },
  { label: 'English /l/', url: 'https://wol.jw.org/en/wol/l/r1/lp-e?q=jesus' },
];

function fetchAndParse(label, url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => {
        const $ = cheerio.load(d);
        console.log(`\n========== ${label} ==========`);
        console.log(`URL: ${url}`);
        console.log(`Status: ${r.statusCode}`);
        console.log(`resultContentTopic: ${$('ul.directory.resultContentTopic').length}`);
        console.log(`All ul.directory: ${$('ul.directory').length}`);
        
        // Try to find any <a> links in the main content
        const allLinks = $('a.lnk');
        console.log(`a.lnk links: ${allLinks.length}`);
        allLinks.each((i, el) => {
          if (i < 5) {
            console.log(`  ${i}: "${$(el).text().trim().substring(0, 80)}" -> ${$(el).attr('href')}`);
          }
        });
        
        // Raw body snippet for debugging
        const body = $('body').html() || '';
        console.log(`\nBody length: ${body.length}`);
        // Show classes used
        const classes = new Set();
        $('[class]').each((i, el) => {
          const cls = $(el).attr('class');
          if (cls) cls.split(' ').forEach(c => classes.add(c.trim()));
        });
        console.log('Classes found:', [...classes].filter(c => c.includes('result') || c.includes('directory') || c.includes('caption') || c.includes('syn')).join(', '));
        
        resolve();
      });
    }).on('error', e => { console.log(e); resolve(); });
  });
}

(async () => {
  for (const u of urls) {
    await fetchAndParse(u.label, u.url);
  }
})();
