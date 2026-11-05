const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

['handsOnPushPlate', 'handsOnPopPlate', 'handsOnEnqueuePerson', 'handsOnDequeuePerson'].forEach(fn => {
  const idx = appJs.indexOf(fn);
  if (idx !== -1) {
    console.log(`=== ${fn} at ${idx} ===`);
    console.log(appJs.substring(idx, idx + 600));
  }
});

