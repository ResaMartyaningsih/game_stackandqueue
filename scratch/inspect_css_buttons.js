const fs = require('fs');

function inspectCSS(file) {
  const content = fs.readFileSync(file, 'utf8');
  // Match rule blocks
  const regex = /([^{}]+)\{([^}]+)\}/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const sel = m[1].trim();
    const body = m[2];
    if (sel.includes('btn') || sel.includes('button') || sel.includes('action')) {
      if (body.includes('width: 100%') || body.includes('width:100%')) {
        console.log(`${file} => ${sel.replace(/\s+/g, ' ')} : width: 100%`);
      }
    }
  }
}

['css/responsive.css', 'css/academic-theme.css', 'css/learning.css', 'css/style.css'].forEach(inspectCSS);
