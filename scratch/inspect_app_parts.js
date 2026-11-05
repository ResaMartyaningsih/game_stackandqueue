const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const hIdx = appJs.indexOf('handsOnPushPlate()');
console.log('handsOnPushPlate to handsOnDequeuePerson:');
console.log(appJs.substring(hIdx, hIdx + 3000));

const gIdx = appJs.indexOf('addGroupMember()');
console.log('\n--- addGroupMember to removeGroupMember ---');
console.log(appJs.substring(gIdx - 200, gIdx + 1200));

