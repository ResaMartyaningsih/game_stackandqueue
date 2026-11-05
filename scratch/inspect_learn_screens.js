const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const stackIdx = html.indexOf('id="screen-learn-stack"');
const queueIdx = html.indexOf('id="screen-learn-queue"');
const simIdx = html.indexOf('id="screen-stack-sim"');

console.log('--- Tabs / Sections in screen-learn-stack ---');
const stackSection = html.substring(stackIdx, queueIdx);
const tabMatchesStack = stackSection.match(/class="[^"]*(?:tab|sim|interactive)[^"]*"/gi);
console.log('Stack classes matching tab/sim/interactive:', [...new Set(tabMatchesStack)]);

// find all tab buttons or headings in stackSection
const hStack = stackSection.match(/<(?:h2|h3|h4|button)[^>]*>[^<]+<\/(?:h2|h3|h4|button)>/g);
console.log('Headings/buttons in screen-learn-stack:', hStack ? hStack.slice(0, 20) : []);

console.log('\n--- Headings/buttons in screen-learn-queue ---');
const queueSection = html.substring(queueIdx, simIdx);
const hQueue = queueSection.match(/<(?:h2|h3|h4|button)[^>]*>[^<]+<\/(?:h2|h3|h4|button)>/g);
console.log('Headings/buttons in screen-learn-queue:', hQueue ? hQueue.slice(0, 20) : []);

