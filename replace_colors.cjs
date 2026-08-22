const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-slate-950/g, replacement: 'bg-slate-50' },
  { regex: /bg-slate-900\/60/g, replacement: 'bg-white/80' },
  { regex: /bg-slate-900\/50/g, replacement: 'bg-white/70' },
  { regex: /bg-slate-900\/40/g, replacement: 'bg-white/60' },
  { regex: /bg-slate-900/g, replacement: 'bg-white' },
  { regex: /bg-slate-800\/50/g, replacement: 'bg-slate-100' },
  { regex: /bg-slate-800/g, replacement: 'bg-slate-100' },
  { regex: /bg-slate-700/g, replacement: 'bg-slate-200' },
  { regex: /border-slate-800/g, replacement: 'border-slate-200' },
  { regex: /border-slate-700/g, replacement: 'border-slate-300' },
  { regex: /border-slate-600/g, replacement: 'border-slate-300' },
  { regex: /text-slate-200/g, replacement: 'text-slate-900' },
  { regex: /text-slate-300/g, replacement: 'text-slate-700' },
  { regex: /text-slate-400/g, replacement: 'text-slate-600' },
  { regex: /text-slate-500/g, replacement: 'text-slate-500' },
  { regex: /text-slate-600/g, replacement: 'text-slate-400' },
  { regex: /bg-black\/20/g, replacement: 'bg-slate-50' },
  { regex: /bg-black\/40/g, replacement: 'bg-slate-100' },
  { regex: /divide-slate-800/g, replacement: 'divide-slate-200' },
  { regex: /divide-slate-700/g, replacement: 'divide-slate-300' },
  { regex: /hover:bg-slate-800/g, replacement: 'hover:bg-slate-100' },
  { regex: /hover:bg-slate-700/g, replacement: 'hover:bg-slate-200' },
  { regex: /hover:text-slate-200/g, replacement: 'hover:text-slate-900' },
  { regex: /hover:text-slate-300/g, replacement: 'hover:text-slate-800' },
  { regex: /hover:text-slate-400/g, replacement: 'hover:text-slate-700' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      // Update typography
      content = content.replace(/font-sans/g, "font-['Plus_Jakarta_Sans',sans-serif]");
      content = content.replace(/font-serif/g, "font-['Playfair_Display',serif]");
      
      fs.writeFileSync(fullPath, content, 'utf-8');
    }
  }
}

processDirectory('./src');
console.log('Colors and typography updated successfully.');
