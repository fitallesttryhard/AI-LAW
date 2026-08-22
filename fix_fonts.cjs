const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      content = content.replace(/font-\['Plus_Jakarta_Sans',sans-serif\]/g, "font-sans");
      content = content.replace(/font-\['Playfair_Display',serif\]/g, "font-serif");
      
      fs.writeFileSync(fullPath, content, 'utf-8');
    }
  }
}

processDirectory('./src');
console.log('Fonts reverted to default Tailwind classes.');
