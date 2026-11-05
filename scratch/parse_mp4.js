const fs = require('fs');

function parseMp4(filePath) {
    const buf = fs.readFileSync(filePath);
    let offset = 0;
    const atoms = [];
    while (offset < buf.length - 8) {
        const size = buf.readUInt32BE(offset);
        const type = buf.toString('ascii', offset + 4, offset + 8);
        atoms.push({ type, size, offset });
        if (size === 0 || size === 1) break;
        offset += size;
    }
    return atoms;
}

console.log('v1 atoms:', parseMp4('C:/Users/RESA/.gemini/antigravity/brain/1bb5a204-33f6-454b-b1c0-b10f32c509c4/.user_uploaded/media_1793886307220_06cdacfa.mp4'));
console.log('v2 atoms:', parseMp4('C:/Users/RESA/.gemini/antigravity/brain/1bb5a204-33f6-454b-b1c0-b10f32c509c4/.user_uploaded/media_1793886307377_d81c7cc2.mp4'));

