const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

['getSimulationButtonsHTML', 'renderCaseSimulationViewport', 'runCaseSimulation', 'resetCaseSimulationData'].forEach(name => {
    const idx = appJs.indexOf(name);
    console.log(`${name} found at index: ${idx}`);
});

