const fs = require('fs');

function checkBalance(filePath) {
    const html = fs.readFileSync(filePath, 'utf8');
    const tags = ['div', 'section', 'main', 'button', 'nav', 'header', 'footer', 'h1', 'h2', 'h3', 'h4', 'p', 'span'];
    
    console.log(`Checking tag balance for ${filePath}:`);
    let hasError = false;
    tags.forEach(tag => {
        const openRegex = new RegExp(`<${tag}(\\s+[^>]*)?>`, 'gi');
        const closeRegex = new RegExp(`</${tag}>`, 'gi');
        const openMatches = html.match(openRegex) || [];
        const closeMatches = html.match(closeRegex) || [];
        const diff = openMatches.length - closeMatches.length;
        if (diff !== 0) {
            console.error(`Mismatch for <${tag}>: opened ${openMatches.length}, closed ${closeMatches.length} (diff: ${diff})`);
            hasError = true;
        } else {
            console.log(`✓ <${tag}> balanced: ${openMatches.length}`);
        }
    });

    if (!hasError) {
        console.log(`All checked tags in ${filePath} are perfectly balanced!`);
    }
}

checkBalance('index.html');

