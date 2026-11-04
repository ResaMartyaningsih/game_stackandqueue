const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Check games, cafeteria, supermarket, books, warehouse, printer in index.html
const gameMatches = html.match(/class=["'][^"']*(supermarket|cafeteria|warehouse|printer|book)[^"']*["']/g) || [];
console.log('Unique game classes:', Array.from(new Set(gameMatches)).slice(0, 20));

// Check puzzle components
const puzzleMatches = html.match(/class=["'][^"']*puzzle[^"']*["']/g) || [];
console.log('Unique puzzle classes:', Array.from(new Set(puzzleMatches)).slice(0, 20));

// Check challenge components
const challengeMatches = html.match(/class=["'][^"']*challenge[^"']*["']/g) || [];
console.log('Unique challenge classes:', Array.from(new Set(challengeMatches)).slice(0, 20));

