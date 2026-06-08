const fs = require('fs');
const https = require('https');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function run() {
  await download("https://ui-avatars.com/api/?name=G&background=4a6da7&color=fff&size=192&font-size=0.5", "public/icon-192x192.png");
  await download("https://ui-avatars.com/api/?name=G&background=4a6da7&color=fff&size=512&font-size=0.5", "public/icon-512x512.png");
  console.log("Icons downloaded successfully");
}

run();
