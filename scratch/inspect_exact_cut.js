const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const queueSectionEnd = html.indexOf('</section>', html.indexOf('id="screen-learn-queue"')) + 10;
const stackSimStart = html.indexOf('id="screen-stack-sim"');
const challengeEnd = html.indexOf('</section>', html.indexOf('id="screen-challenge"')) + 10;
const achievementsStart = html.indexOf('id="screen-achievements"');

console.log('queueSectionEnd:', queueSectionEnd);
console.log('stackSimStart:', stackSimStart);
console.log('challengeEnd:', challengeEnd);
console.log('achievementsStart:', achievementsStart);

console.log('\n--- Text between queueSectionEnd and achievementsStart ---');
console.log('Total characters to remove:', achievementsStart - queueSectionEnd);
console.log('Snippet at start of removal:');
console.log(html.substring(queueSectionEnd, queueSectionEnd + 300));
console.log('Snippet before achievementsStart:');
console.log(html.substring(achievementsStart - 200, achievementsStart + 50));

