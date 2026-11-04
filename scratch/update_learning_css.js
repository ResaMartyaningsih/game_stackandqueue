const fs = require('fs');

let css = fs.readFileSync('css/learning.css', 'utf8');

// Replace legacy gradients and colors with exact palette:
css = css.replace(/linear-gradient\(135deg,\s*#38bdf8,\s*#0284c7\)/g, 'linear-gradient(135deg, #E76814, #891A10)');
css = css.replace(/linear-gradient\(135deg,\s*#0284c7\s*0%,\s*#2563eb\s*50%,\s*#4f46e5\s*100%\)/g, 'linear-gradient(135deg, #891A10 0%, #714236 100%)');
css = css.replace(/linear-gradient\(135deg,\s*#f0f9ff\s*0%,\s*#e0f2fe\s*50%,\s*#ffffff\s*100%\)/g, 'linear-gradient(135deg, #FAF8F5 0%, #FAF3EA 100%)');
css = css.replace(/linear-gradient\(135deg,\s*#0284c7,\s*#2563eb\)/g, 'linear-gradient(135deg, #E76814, #B8210F)');

css = css.replace(/rgba\(37,\s*99,\s*235,\s*0\.28\)/g, 'rgba(113, 66, 54, 0.22)');
css = css.replace(/rgba\(2,\s*132,\s*199,\s*0\.15\)/g, 'rgba(113, 66, 54, 0.08)');
css = css.replace(/rgba\(59,\s*130,\s*246,\s*0\.35\)/g, 'rgba(231, 104, 20, 0.35)');
css = css.replace(/rgba\(59,\s*130,\s*246,\s*0\.45\)/g, 'rgba(184, 33, 15, 0.45)');

// Replace individual hex colors:
css = css.replace(/#0284c7/g, '#E76814');
css = css.replace(/#2563eb/g, '#B8210F');
css = css.replace(/#38bdf8/g, '#DC8236');
css = css.replace(/#4f46e5/g, '#891A10');
css = css.replace(/#1e293b/g, '#2B1D19');
css = css.replace(/#0f172a/g, '#2B1D19');

fs.writeFileSync('css/learning.css', css, 'utf8');
console.log('css/learning.css updated successfully!');

