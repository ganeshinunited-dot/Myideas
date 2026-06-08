const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = [...walk('./app'), ...walk('./components')];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace white backgrounds
  content = content.replace(/background:\s*['"]#(fff|ffffff)['"]/gi, 'background: "var(--color-bg)"');
  
  // Replace light gray backgrounds
  content = content.replace(/background:\s*['"]#f8fafc['"]/gi, 'background: "var(--color-bg-alt)"');
  
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
