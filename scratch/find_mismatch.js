const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find button mismatch
const buttonTokens = [];
const regex = /<\/?button(\s+[^>]*)?>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
    const isClose = match[0].startsWith('</');
    buttonTokens.push({ text: match[0], index: match.index, isClose });
}

console.log('Total button tokens:', buttonTokens.length);
let count = 0;
for (let i = 0; i < buttonTokens.length; i++) {
    const t = buttonTokens[i];
    if (t.isClose) count--;
    else count++;
    if (count < 0) {
        console.log(`First negative count for <button> at token index ${i}:`);
        console.log(html.slice(t.index - 100, t.index + 100));
        break;
    }
}

// Find div mismatch
const divTokens = [];
const divRegex = /<\/?div(\s+[^>]*)?>/gi;
while ((match = divRegex.exec(html)) !== null) {
    const isClose = match[0].startsWith('</');
    divTokens.push({ text: match[0], index: match.index, isClose });
}

console.log('Total div tokens:', divTokens.length);
let divCount = 0;
for (let i = 0; i < divTokens.length; i++) {
    const t = divTokens[i];
    if (t.isClose) divCount--;
    else divCount++;
    if (divCount < 0) {
        console.log(`First negative count for <div> at token index ${i}:`);
        console.log(html.slice(t.index - 100, t.index + 100));
        break;
    }
}

