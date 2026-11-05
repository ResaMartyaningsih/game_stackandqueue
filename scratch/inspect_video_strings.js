const fs = require('fs');

function inspectHeader(path, name) {
    const buf = fs.readFileSync(path);
    const slice = buf.slice(0, 30000);
    // Find readable ASCII strings of length >= 4
    let str = '';
    const strings = [];
    for (let i = 0; i < slice.length; i++) {
        const c = slice[i];
        if (c >= 32 && c <= 126) {
            str += String.fromCharCode(c);
        } else {
            if (str.length >= 4) strings.push(str);
            str = '';
        }
    }
    console.log(`=== ${name} Strings ===`);
    console.log(strings.join('\n'));
}

inspectHeader('C:/Users/RESA/.gemini/antigravity/brain/1bb5a204-33f6-454b-b1c0-b10f32c509c4/.user_uploaded/media_1793886307220_06cdacfa.mp4', 'WhatsApp_Video (v1)');
inspectHeader('C:/Users/RESA/.gemini/antigravity/brain/1bb5a204-33f6-454b-b1c0-b10f32c509c4/.user_uploaded/media_1793886307377_d81c7cc2.mp4', 'Gemini_Video (v2)');

