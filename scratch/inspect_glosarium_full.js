const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const gIdx = html.indexOf('data-pane="tab-glosarium"');
const endPane = html.indexOf('</div>\n                        </div>\n\n                        <!-- 4. Referensi Belajar -->', gIdx);
console.log(html.substring(gIdx, endPane + 40));

