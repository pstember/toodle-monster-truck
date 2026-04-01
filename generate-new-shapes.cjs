const fs = require('fs');
const path = require('path');

const tiresDir = path.join(__dirname, 'images', 'tires');

// Color definitions
const colors = {
  red: { fill: '#FF4444', light: '#FF6666', dark: '#CC3333' },
  blue: { fill: '#4488FF', light: '#6699FF', dark: '#3366CC' },
  green: { fill: '#44DD44', light: '#66EE66', dark: '#33AA33' },
  yellow: { fill: '#FFDD44', light: '#FFEE66', dark: '#CCAA33' },
  purple: { fill: '#BB44DD', light: '#CC66EE', dark: '#9933AA' },
  orange: { fill: '#FF8844', light: '#FFAA66', dark: '#CC6633' },
  pink: { fill: '#FF88CC', light: '#FFAADD', dark: '#CC6699' },
  cyan: { fill: '#44DDDD', light: '#66EEEE', dark: '#33AAAA' },
  // New colors
  brown: { fill: '#8B4513', light: '#A0522D', dark: '#654321' },
  lime: { fill: '#32CD32', light: '#7FFF00', dark: '#228B22' }
};

// Shape definitions for all 9 shapes
const shapes = {
  circle: (color) => `
  <circle cx="60" cy="60" r="58" fill="#2a2a2a"/>
  <circle cx="60" cy="60" r="55" fill="none" stroke="#1a1a1a" stroke-width="4" opacity="0.5"/>
  <circle cx="60" cy="60" r="50" fill="none" stroke="#3a3a3a" stroke-width="2" opacity="0.3"/>
  <g stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" opacity="0.4">
    <line x1="60" y1="8" x2="60" y2="20"/>
    <line x1="95" y1="18" x2="87" y2="28"/>
    <line x1="112" y1="60" x2="100" y2="60"/>
    <line x1="95" y1="102" x2="87" y2="92"/>
    <line x1="60" y1="112" x2="60" y2="100"/>
    <line x1="25" y1="102" x2="33" y2="92"/>
    <line x1="8" y1="60" x2="20" y2="60"/>
    <line x1="25" y1="18" x2="33" y2="28"/>
  </g>
  <circle cx="60" cy="60" r="30" fill="#3a3a3a"/>
  <circle cx="60" cy="60" r="24" fill="${color.fill}"/>
  <circle cx="60" cy="60" r="24" fill="url(#grad${color.name})"/>
  <circle cx="60" cy="60" r="8" fill="#1a1a1a"/>
  <circle cx="60" cy="60" r="6" fill="#2a2a2a"/>
  <ellipse cx="50" cy="45" rx="12" ry="8" fill="#ffffff" opacity="0.2"/>`,

  oval: (color) => `
  <ellipse cx="60" cy="60" rx="58" ry="45" fill="#2a2a2a"/>
  <ellipse cx="60" cy="60" rx="55" ry="42" fill="none" stroke="#1a1a1a" stroke-width="4" opacity="0.5"/>
  <ellipse cx="60" cy="60" rx="50" ry="37" fill="none" stroke="#3a3a3a" stroke-width="2" opacity="0.3"/>
  <g stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" opacity="0.4">
    <line x1="60" y1="13" x2="60" y2="22"/>
    <line x1="95" y1="25" x2="87" y2="32"/>
    <line x1="112" y1="60" x2="100" y2="60"/>
    <line x1="95" y1="95" x2="87" y2="88"/>
    <line x1="60" y1="107" x2="60" y2="98"/>
    <line x1="25" y1="95" x2="33" y2="88"/>
    <line x1="8" y1="60" x2="20" y2="60"/>
    <line x1="25" y1="25" x2="33" y2="32"/>
  </g>
  <ellipse cx="60" cy="60" rx="35" ry="26" fill="#3a3a3a"/>
  <ellipse cx="60" cy="60" rx="30" ry="22" fill="${color.fill}"/>
  <ellipse cx="60" cy="60" rx="30" ry="22" fill="url(#grad${color.name})"/>
  <ellipse cx="60" cy="60" rx="10" ry="7" fill="#1a1a1a"/>
  <ellipse cx="60" cy="60" rx="8" ry="5" fill="#2a2a2a"/>
  <ellipse cx="50" cy="48" rx="14" ry="7" fill="#ffffff" opacity="0.2"/>`,

  square: (color) => `
  <rect x="2" y="2" width="116" height="116" rx="8" fill="#2a2a2a"/>
  <rect x="5" y="5" width="110" height="110" rx="6" fill="none" stroke="#1a1a1a" stroke-width="4" opacity="0.5"/>
  <rect x="10" y="10" width="100" height="100" rx="4" fill="none" stroke="#3a3a3a" stroke-width="2" opacity="0.3"/>
  <g stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" opacity="0.4">
    <line x1="60" y1="10" x2="60" y2="20"/>
    <line x1="110" y1="60" x2="100" y2="60"/>
    <line x1="60" y1="110" x2="60" y2="100"/>
    <line x1="10" y1="60" x2="20" y2="60"/>
  </g>
  <rect x="30" y="30" width="60" height="60" rx="4" fill="#3a3a3a"/>
  <rect x="36" y="36" width="48" height="48" rx="2" fill="${color.fill}"/>
  <rect x="36" y="36" width="48" height="48" rx="2" fill="url(#grad${color.name})"/>
  <rect x="52" y="52" width="16" height="16" rx="1" fill="#1a1a1a"/>
  <rect x="54" y="54" width="12" height="12" fill="#2a2a2a"/>
  <ellipse cx="50" cy="45" rx="12" ry="8" fill="#ffffff" opacity="0.2"/>`,

  triangle: (color) => `
  <polygon points="60,5 115,110 5,110" fill="#2a2a2a"/>
  <polygon points="60,10 110,105 10,105" fill="none" stroke="#1a1a1a" stroke-width="4" opacity="0.5"/>
  <polygon points="60,15 105,100 15,100" fill="none" stroke="#3a3a3a" stroke-width="2" opacity="0.3"/>
  <g stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" opacity="0.4">
    <line x1="60" y1="15" x2="60" y2="25"/>
    <line x1="95" y1="95" x2="87" y2="87"/>
    <line x1="25" y1="95" x2="33" y2="87"/>
  </g>
  <polygon points="60,35 85,85 35,85" fill="#3a3a3a"/>
  <polygon points="60,42 80,78 40,78" fill="${color.fill}"/>
  <polygon points="60,42 80,78 40,78" fill="url(#grad${color.name})"/>
  <circle cx="60" cy="66" r="6" fill="#1a1a1a"/>
  <circle cx="60" cy="66" r="4" fill="#2a2a2a"/>
  <ellipse cx="55" cy="55" rx="8" ry="6" fill="#ffffff" opacity="0.2"/>`,

  star: (color) => `
  <polygon points="60,5 72,42 112,42 80,66 92,105 60,80 28,105 40,66 8,42 48,42" fill="#2a2a2a"/>
  <polygon points="60,10 70,42 105,42 77,62 87,98 60,77 33,98 43,62 15,42 50,42" fill="none" stroke="#1a1a1a" stroke-width="4" opacity="0.5"/>
  <polygon points="60,15 68,42 98,42 74,58 82,90 60,74 38,90 46,58 22,42 52,42" fill="none" stroke="#3a3a3a" stroke-width="2" opacity="0.3"/>
  <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" opacity="0.4">
    <line x1="60" y1="20" x2="60" y2="28"/>
    <line x1="85" y1="45" x2="78" y2="48"/>
    <line x1="80" y1="75" x2="74" y2="70"/>
    <line x1="45" y1="75" x2="51" y2="70"/>
    <line x1="35" y1="45" x2="42" y2="48"/>
  </g>
  <polygon points="60,38 68,55 85,55 72,65 77,82 60,72 43,82 48,65 35,55 52,55" fill="#3a3a3a"/>
  <polygon points="60,42 66,55 80,55 70,62 74,76 60,68 46,76 50,62 40,55 54,55" fill="${color.fill}"/>
  <polygon points="60,42 66,55 80,55 70,62 74,76 60,68 46,76 50,62 40,55 54,55" fill="url(#grad${color.name})"/>
  <circle cx="60" cy="60" r="5" fill="#1a1a1a"/>
  <circle cx="60" cy="60" r="3" fill="#2a2a2a"/>
  <ellipse cx="55" cy="52" rx="8" ry="5" fill="#ffffff" opacity="0.2"/>`,

  heart: (color) => `
  <path d="M60,100 C20,70 5,45 5,30 C5,15 15,5 30,5 C42,5 52,12 60,22 C68,12 78,5 90,5 C105,5 115,15 115,30 C115,45 100,70 60,100 Z" fill="#2a2a2a"/>
  <path d="M60,95 C25,68 10,45 10,32 C10,19 18,10 30,10 C40,10 50,16 60,25 C70,16 80,10 90,10 C102,10 110,19 110,32 C110,45 95,68 60,95 Z" fill="none" stroke="#1a1a1a" stroke-width="4" opacity="0.5"/>
  <path d="M60,90 C30,66 15,46 15,34 C15,23 21,15 30,15 C38,15 48,20 60,28 C72,20 82,15 90,15 C99,15 105,23 105,34 C105,46 90,66 60,90 Z" fill="none" stroke="#3a3a3a" stroke-width="2" opacity="0.3"/>
  <g stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" opacity="0.4">
    <line x1="32" y1="20" x2="32" y2="26"/>
    <line x1="88" y1="20" x2="88" y2="26"/>
    <line x1="60" y1="75" x2="60" y2="82"/>
  </g>
  <path d="M60,70 C40,55 30,45 30,37 C30,32 33,28 38,28 C42,28 47,31 60,40 C73,31 78,28 82,28 C87,28 90,32 90,37 C90,45 80,55 60,70 Z" fill="#3a3a3a"/>
  <path d="M60,66 C42,52 34,44 34,38 C34,34 36,31 40,31 C44,31 48,33 60,41 C72,33 76,31 80,31 C84,31 86,34 86,38 C86,44 78,52 60,66 Z" fill="${color.fill}"/>
  <path d="M60,66 C42,52 34,44 34,38 C34,34 36,31 40,31 C44,31 48,33 60,41 C72,33 76,31 80,31 C84,31 86,34 86,38 C86,44 78,52 60,66 Z" fill="url(#grad${color.name})"/>
  <circle cx="60" cy="48" r="4" fill="#1a1a1a"/>
  <circle cx="60" cy="48" r="2" fill="#2a2a2a"/>
  <ellipse cx="50" cy="40" rx="8" ry="5" fill="#ffffff" opacity="0.2"/>`,

  pentagon: (color) => `
  <polygon points="60,5 115,45 95,110 25,110 5,45" fill="#2a2a2a"/>
  <polygon points="60,10 110,48 92,105 28,105 10,48" fill="none" stroke="#1a1a1a" stroke-width="4" opacity="0.5"/>
  <polygon points="60,15 105,51 89,100 31,100 15,51" fill="none" stroke="#3a3a3a" stroke-width="2" opacity="0.3"/>
  <g stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" opacity="0.4">
    <line x1="60" y1="15" x2="60" y2="25"/>
    <line x1="100" y1="50" x2="92" y2="55"/>
    <line x1="85" y1="95" x2="78" y2="88"/>
    <line x1="35" y1="95" x2="42" y2="88"/>
    <line x1="20" y1="50" x2="28" y2="55"/>
  </g>
  <polygon points="60,35 85,60 75,90 45,90 35,60" fill="#3a3a3a"/>
  <polygon points="60,40 80,62 72,85 48,85 40,62" fill="${color.fill}"/>
  <polygon points="60,40 80,62 72,85 48,85 40,62" fill="url(#grad${color.name})"/>
  <circle cx="60" cy="66" r="6" fill="#1a1a1a"/>
  <circle cx="60" cy="66" r="4" fill="#2a2a2a"/>
  <ellipse cx="55" cy="55" rx="10" ry="6" fill="#ffffff" opacity="0.2"/>`,

  hexagon: (color) => `
  <polygon points="60,5 110,32 110,88 60,115 10,88 10,32" fill="#2a2a2a"/>
  <polygon points="60,10 105,35 105,85 60,110 15,85 15,35" fill="none" stroke="#1a1a1a" stroke-width="4" opacity="0.5"/>
  <polygon points="60,15 100,38 100,82 60,105 20,82 20,38" fill="none" stroke="#3a3a3a" stroke-width="2" opacity="0.3"/>
  <g stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" opacity="0.4">
    <line x1="60" y1="15" x2="60" y2="25"/>
    <line x1="95" y1="38" x2="87" y2="43"/>
    <line x1="95" y1="82" x2="87" y2="77"/>
    <line x1="60" y1="105" x2="60" y2="95"/>
    <line x1="25" y1="82" x2="33" y2="77"/>
    <line x1="25" y1="38" x2="33" y2="43"/>
  </g>
  <polygon points="60,38 85,52 85,78 60,92 35,78 35,52" fill="#3a3a3a"/>
  <polygon points="60,43 80,54 80,76 60,87 40,76 40,54" fill="${color.fill}"/>
  <polygon points="60,43 80,54 80,76 60,87 40,76 40,54" fill="url(#grad${color.name})"/>
  <circle cx="60" cy="65" r="6" fill="#1a1a1a"/>
  <circle cx="60" cy="65" r="4" fill="#2a2a2a"/>
  <ellipse cx="53" cy="56" rx="10" ry="6" fill="#ffffff" opacity="0.2"/>`,

  diamond: (color) => `
  <polygon points="60,5 115,60 60,115 5,60" fill="#2a2a2a"/>
  <polygon points="60,10 110,60 60,110 10,60" fill="none" stroke="#1a1a1a" stroke-width="4" opacity="0.5"/>
  <polygon points="60,15 105,60 60,105 15,60" fill="none" stroke="#3a3a3a" stroke-width="2" opacity="0.3"/>
  <g stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" opacity="0.4">
    <line x1="60" y1="15" x2="60" y2="25"/>
    <line x1="100" y1="60" x2="90" y2="60"/>
    <line x1="60" y1="105" x2="60" y2="95"/>
    <line x1="20" y1="60" x2="30" y2="60"/>
  </g>
  <polygon points="60,35 85,60 60,85 35,60" fill="#3a3a3a"/>
  <polygon points="60,40 80,60 60,80 40,60" fill="${color.fill}"/>
  <polygon points="60,40 80,60 60,80 40,60" fill="url(#grad${color.name})"/>
  <circle cx="60" cy="60" r="6" fill="#1a1a1a"/>
  <circle cx="60" cy="60" r="4" fill="#2a2a2a"/>
  <ellipse cx="53" cy="53" rx="10" ry="6" fill="#ffffff" opacity="0.2"/>`
};

function createSVG(shapeName, colorName, colorData) {
  const shapeContent = shapes[shapeName](colorData);

  return `<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
${shapeContent}
  <defs>
    <radialGradient id="grad${colorName}">
      <stop offset="0%" stop-color="${colorData.light}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${colorData.dark}"/>
    </radialGradient>
  </defs>
</svg>`;
}

// Generate oval for all 10 colors
console.log('Generating oval shapes...');
Object.entries(colors).forEach(([colorName, colorData]) => {
  const svg = createSVG('oval', colorName, { ...colorData, name: colorName });
  const filename = path.join(tiresDir, `oval-${colorName}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`✓ Created ${filename}`);
});

// Generate brown and lime variants for all existing 8 shapes (not oval, we already did it)
const existingShapes = ['circle', 'square', 'triangle', 'star', 'heart', 'pentagon', 'hexagon', 'diamond'];
const newColors = ['brown', 'lime'];

console.log('\nGenerating new color variants for existing shapes...');
existingShapes.forEach(shapeName => {
  newColors.forEach(colorName => {
    const colorData = colors[colorName];
    const svg = createSVG(shapeName, colorName, { ...colorData, name: colorName });
    const filename = path.join(tiresDir, `${shapeName}-${colorName}.svg`);
    fs.writeFileSync(filename, svg);
    console.log(`✓ Created ${filename}`);
  });
});

console.log('\n✅ All SVG files generated successfully!');
console.log(`Total files created: ${10 + (8 * 2)} = 26 files`);
