const fs = require('fs');
const storage = fs.readFileSync('js/storage.js', 'utf8');

const endOfFile = storage.substring(storage.length - 1000);
console.log('--- End of js/storage.js ---');
console.log(endOfFile);

