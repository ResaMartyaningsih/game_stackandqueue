const https = require('https');

https.get('https://game-stackandqueue.vercel.app', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Contains "Nilai Materi Belajar Queue"?', data.includes('Nilai Materi Belajar Queue'));
    console.log('Contains "Kuis Formatif Materi Queue"?', data.includes('Kuis Formatif Materi Queue'));
    console.log('Contains "Lanjut: Level 2"?', data.includes('Lanjut: Level 2'));
    console.log('Contains "Tugas Individu (4 Level)"?', data.includes('Tugas Individu (4 Level)'));
  });
}).on('error', err => console.error(err));
