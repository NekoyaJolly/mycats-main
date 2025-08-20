const fs = require('fs');

// 猫種CSV の重複チェック
const csvContent = fs.readFileSync('NewPedigree/猫種データUTF8Ver.csv', 'utf8');
const lines = csvContent.split('\n');

console.log('=== 猫種CSV の重複分析 ===');
const breeds = {};
const duplicates = [];

lines.forEach((line, index) => {
  if (index === 0 || !line.trim()) return; // ヘッダーと空行をスキップ
  const parts = line.split(',');
  const code = parts[0];
  const name = parts[1];
  
  if (breeds[name]) {
    duplicates.push({ 
      code1: breeds[name], 
      name, 
      code2: code, 
      line: index + 1 
    });
  } else {
    breeds[name] = code;
  }
});

console.log('重複する猫種名:');
duplicates.forEach(dup => 
  console.log(`- ${dup.name}: code ${dup.code1} と code ${dup.code2} (行${dup.line})`)
);

console.log(`\nコード67の猫種名: ${Object.keys(breeds).find(name => breeds[name] === '67') || 'NOT FOUND'}`);
console.log(`コード36の猫種名: ${Object.keys(breeds).find(name => breeds[name] === '36') || 'NOT FOUND'}`);

// 問題のコードがCSVに存在するかチェック
const code67Line = lines.find(line => line.startsWith('67,'));
const code36Line = lines.find(line => line.startsWith('36,'));
console.log(`\nCSV中のcode 67: ${code67Line || 'NOT FOUND'}`);
console.log(`CSV中のcode 36: ${code36Line || 'NOT FOUND'}`);
