const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('id="screen-learn-stack"');
const endIdx = html.indexOf('</section>', sIdx);
const content = html.substring(sIdx, endIdx);

const tabMatches = content.match(/class=["'][^"']*learn-tab-pane[^"']*["'][^>]*>/gi) || [];
console.log('Learn tab panes in screen-learn-stack:');
tabMatches.forEach(t => console.log(t));

// Show first 800 chars after the learn-tabs-bar
const tabsBarIdx = content.indexOf('</div>\n\n                    <!--');
console.log('Snippet after tabs bar:');
console.log(content.substring(content.indexOf('learn-tabs-bar'), content.indexOf('learn-tabs-bar') + 1200));

