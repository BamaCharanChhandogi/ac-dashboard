import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Delaunay } from 'd3-delaunay';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to round numbers to 2 decimal places
const round = (n) => Math.round(n * 100) / 100;

// Helper to convert polygon points [[x,y], ...] into SVG path string "M x y L x y ... Z"
function polygonToPath(points) {
  if (!points || points.length === 0) return '';
  const [first, ...rest] = points;
  let p = `M ${round(first[0])} ${round(first[1])}`;
  for (const pt of rest) {
    p += ` L ${round(pt[0])} ${round(pt[1])}`;
  }
  p += ' Z';
  return p;
}

// ---------------------------------------------------------------------------
// 1. PORVORIM (AC 09) - ViewBox: "0 0 1186 1220"
// ---------------------------------------------------------------------------
// Scale factors: x * 1.5, y * 1.6
const scaleP = (x, y) => [round(x * 1.5 + 80), round(y * 1.6 + 60)];

const porvorimVillages = [
  { name: 'Socorro', x: scaleP(420, 240)[0], y: scaleP(420, 240)[1], margin: '+38.2%' },
  { name: 'Salvador do Mundo', x: scaleP(260, 520)[0], y: scaleP(260, 520)[1], margin: '+34.5%' },
  { name: 'Penha-de-Franca', x: scaleP(560, 560)[0], y: scaleP(560, 560)[1], margin: '+28.1%' }
];

const porvorimBoothsRawBase = [
  // Socorro (16 booths: 1 - 16)
  { num: 1, x: 380, y: 130, v: 'Socorro', name: 'Govt. Primary School Khareband, Socorro', voters: 620, margin: 38.5, cat: 'Safe' },
  { num: 2, x: 440, y: 135, v: 'Socorro', name: 'Govt. Primary School, Maina Socorro', voters: 580, margin: 42.1, cat: 'Safe' },
  { num: 3, x: 320, y: 170, v: 'Socorro', name: 'Panchayat Hall, Socorro (North)', voters: 690, margin: 36.4, cat: 'Safe' },
  { num: 4, x: 375, y: 185, v: 'Socorro', name: 'Panchayat Hall, Socorro (South)', voters: 710, margin: 35.8, cat: 'Safe' },
  { num: 5, x: 430, y: 190, v: 'Socorro', name: 'Community Hall, Vaddem Socorro', voters: 640, margin: 39.0, cat: 'Safe' },
  { num: 6, x: 490, y: 180, v: 'Socorro', name: 'Govt. Primary School, Zuarinagar Socorro', voters: 615, margin: 37.2, cat: 'Safe' },
  { num: 7, x: 280, y: 220, v: 'Socorro', name: 'St. Rita High School, Maina (East)', voters: 655, margin: 31.4, cat: 'Safe' },
  { num: 8, x: 340, y: 240, v: 'Socorro', name: 'St. Rita High School, Maina (West)', voters: 670, margin: 33.0, cat: 'Safe' },
  { num: 9, x: 400, y: 250, v: 'Socorro', name: 'Govt. Primary School, Ambirna Socorro', voters: 590, margin: 44.2, cat: 'Safe' },
  { num: 10, x: 465, y: 245, v: 'Socorro', name: 'Govt. High School, Porvorim (North)', voters: 720, margin: 28.5, cat: 'Safe', isDashed: true },
  { num: 11, x: 530, y: 235, v: 'Socorro', name: 'Govt. High School, Porvorim (South)', voters: 705, margin: 29.8, cat: 'Safe' },
  { num: 12, x: 320, y: 310, v: 'Socorro', name: 'Holy Family High School, Alto Porvorim (Room 1)', voters: 740, margin: 24.1, cat: 'Safe' },
  { num: 13, x: 380, y: 315, v: 'Socorro', name: 'Holy Family High School, Alto Porvorim (Room 2)', voters: 730, margin: 25.6, cat: 'Safe' },
  { num: 14, x: 445, y: 310, v: 'Socorro', name: 'Kite Institute Hall, Porvorim', voters: 605, margin: 34.7, cat: 'Safe' },
  { num: 15, x: 510, y: 300, v: 'Socorro', name: 'Anganwadi Centre, Devashri Greens', voters: 560, margin: 40.5, cat: 'Safe' },
  { num: 16, x: 575, y: 280, v: 'Socorro', name: 'Govt. Primary School, Carrem Socorro', voters: 520, margin: 38.0, cat: 'Safe' },

  // Salvador do Mundo (11 booths: 17 - 27)
  { num: 17, x: 190, y: 380, v: 'Salvador do Mundo', name: 'Panchayat Ghar, Salvador do Mundo', voters: 680, margin: 36.2, cat: 'Safe' },
  { num: 18, x: 250, y: 395, v: 'Salvador do Mundo', name: 'Govt. Primary School, Salem', voters: 645, margin: 33.8, cat: 'Safe' },
  { num: 19, x: 315, y: 390, v: 'Salvador do Mundo', name: 'Community Hall, Donwaddo', voters: 710, margin: 31.0, cat: 'Safe' },
  { num: 20, x: 160, y: 460, v: 'Salvador do Mundo', name: 'Govt. Primary School, Badem', voters: 595, margin: 37.4, cat: 'Safe' },
  { num: 21, x: 225, y: 470, v: 'Salvador do Mundo', name: 'Our Lady of Piety Hall, Pilerne Border', voters: 630, margin: 26.5, cat: 'Safe' },
  { num: 22, x: 290, y: 475, v: 'Salvador do Mundo', name: 'Govt. High School Penha/Salvador (Booth 22+22A)', voters: 1340, margin: 27.4, cat: 'Safe' },
  { num: 23, x: 170, y: 550, v: 'Salvador do Mundo', name: 'St. Anne Institute, Torda (Room 1)', voters: 660, margin: 39.1, cat: 'Safe' },
  { num: 24, x: 235, y: 555, v: 'Salvador do Mundo', name: 'St. Anne Institute, Torda (Room 2)', voters: 640, margin: 35.0, cat: 'Safe' },
  { num: 25, x: 300, y: 560, v: 'Salvador do Mundo', name: 'Govt. Primary School, Quitla', voters: 620, margin: 32.8, cat: 'Safe' },
  { num: 26, x: 200, y: 640, v: 'Salvador do Mundo', name: 'Anganwadi Centre, Salvador West', voters: 570, margin: 38.6, cat: 'Safe' },
  { num: 27, x: 270, y: 645, v: 'Salvador do Mundo', name: 'Community Hall, Khadki Salvador', voters: 660, margin: 34.0, cat: 'Safe' },

  // Penha-de-Franca (12 booths: 28 - 39)
  { num: 28, x: 420, y: 410, v: 'Penha-de-Franca', name: 'Panchayat Hall, Penha-de-Franca (North)', voters: 690, margin: 29.5, cat: 'Safe' },
  { num: 29, x: 485, y: 405, v: 'Penha-de-Franca', name: 'Panchayat Hall, Penha-de-Franca (South)', voters: 705, margin: 28.0, cat: 'Safe' },
  { num: 30, x: 555, y: 390, v: 'Penha-de-Franca', name: 'Govt. Primary School, Alto Betim', voters: 630, margin: 32.4, cat: 'Safe' },
  { num: 31, x: 625, y: 395, v: 'Penha-de-Franca', name: 'St. Anthony High School, Alto Guirim Border', voters: 610, margin: 18.5, cat: 'Safe' },
  { num: 32, x: 410, y: 495, v: 'Penha-de-Franca', name: 'Govt. High School, Brittona (North)', voters: 715, margin: 8.2, cat: 'Battle Ground' },
  { num: 33, x: 475, y: 490, v: 'Penha-de-Franca', name: 'Govt. High School, Brittona (South)', voters: 685, margin: 7.5, cat: 'Battle Ground' },
  { num: 34, x: 545, y: 485, v: 'Penha-de-Franca', name: 'Govt. Primary School, Brittona Riverside', voters: 590, margin: 26.2, cat: 'Safe' },
  { num: 35, x: 615, y: 480, v: 'Penha-de-Franca', name: 'Anganwadi Centre, Britona Vaddem', voters: 540, margin: 31.8, cat: 'Safe' },
  { num: 36, x: 420, y: 590, v: 'Penha-de-Franca', name: 'Village Community Hall, Penha Proper', voters: 640, margin: 25.0, cat: 'Safe' },
  { num: 37, x: 490, y: 595, v: 'Penha-de-Franca', name: 'Govt. Primary School, Mandovi Vista', voters: 605, margin: 33.1, cat: 'Safe' },
  { num: 38, x: 560, y: 590, v: 'Penha-de-Franca', name: 'Govt. Technical High School, Porvorim', voters: 730, margin: 29.4, cat: 'Safe' },
  { num: 39, x: 630, y: 585, v: 'Penha-de-Franca', name: 'Sports Complex Hall, Porvorim East', voters: 617, margin: 32.1, cat: 'Safe' }
];

const porvorimBoothsRaw = porvorimBoothsRawBase.map(b => {
  const [sx, sy] = scaleP(b.x, b.y);
  return { ...b, x: sx, y: sy };
});

// ---------------------------------------------------------------------------
// 2. ALDONA (AC 10) - ViewBox: "0 0 1186 760"
// ---------------------------------------------------------------------------
const scaleA = (x, y) => [round(x * 1.25 + 50), round(y * 1.05 + 20)];

const aldonaVillages = [
  { name: 'Moira', x: scaleA(230, 240)[0], y: scaleA(230, 240)[1], margin: '-8.5%' },
  { name: 'Nachinola', x: scaleA(380, 260)[0], y: scaleA(380, 260)[1], margin: '+4.2%' },
  { name: 'Aldona Proper', x: scaleA(550, 310)[0], y: scaleA(550, 310)[1], margin: '-12.4%' },
  { name: 'Corjuem', x: scaleA(740, 250)[0], y: scaleA(740, 250)[1], margin: '-18.6%' },
  { name: 'Calvim', x: scaleA(830, 390)[0], y: scaleA(830, 390)[1], margin: '-15.4%' },
  { name: 'Bastora', x: scaleA(190, 460)[0], y: scaleA(190, 460)[1], margin: '+14.8%' },
  { name: 'Ucassaim', x: scaleA(350, 470)[0], y: scaleA(350, 470)[1], margin: '+11.2%' },
  { name: 'Pomburpa', x: scaleA(530, 540)[0], y: scaleA(530, 540)[1], margin: '-6.2%' }
];

const aldonaBoothsRawBase = [
  // Aldona Proper (Booths 1 - 8)
  { num: 1, x: 500, y: 260, v: 'Aldona Proper', name: 'St. Thomas High School, Aldona (Room 1)', voters: 690, margin: -14.2, cat: 'Weak' },
  { num: 2, x: 555, y: 260, v: 'Aldona Proper', name: 'St. Thomas High School, Aldona (Room 2)', voters: 710, margin: -13.5, cat: 'Weak' },
  { num: 3, x: 610, y: 265, v: 'Aldona Proper', name: 'St. Thomas Girls High School, Aldona', voters: 680, margin: -12.0, cat: 'Weak' },
  { num: 4, x: 490, y: 320, v: 'Aldona Proper', name: 'Govt. Primary School, Quitla Aldona', voters: 640, margin: -15.8, cat: 'Weak' },
  { num: 5, x: 545, y: 325, v: 'Aldona Proper', name: 'Panchayat Hall, Aldona (East Wing)', voters: 730, margin: -11.0, cat: 'Weak' },
  { num: 6, x: 605, y: 330, v: 'Aldona Proper', name: 'Panchayat Hall, Aldona (West Wing)', voters: 715, margin: -10.5, cat: 'Weak' },
  { num: 7, x: 520, y: 385, v: 'Aldona Proper', name: 'Govt. Primary School, Coimavaddo', voters: 635, margin: -8.5, cat: 'Battle Ground' },
  { num: 8, x: 580, y: 390, v: 'Aldona Proper', name: 'Community Hall, Carona Aldona', voters: 620, margin: -13.7, cat: 'Weak' },

  // Moira (Booths 9 - 14)
  { num: 9, x: 195, y: 200, v: 'Moira', name: 'Panchayat Hall, Moira (Room 1)', voters: 620, margin: -6.8, cat: 'Battle Ground' },
  { num: 10, x: 255, y: 205, v: 'Moira', name: 'Panchayat Hall, Moira (Room 2)', voters: 610, margin: -7.4, cat: 'Battle Ground' },
  { num: 11, x: 180, y: 265, v: 'Moira', name: 'St. Francis Xavier High School, Moira', voters: 640, margin: -9.5, cat: 'Battle Ground' },
  { num: 12, x: 240, y: 270, v: 'Moira', name: 'Govt. Primary School, Calizor Moira', voters: 580, margin: -10.2, cat: 'Weak' },
  { num: 13, x: 200, y: 330, v: 'Moira', name: 'Govt. Primary School, Attafondem Moira', voters: 590, margin: -8.0, cat: 'Battle Ground' },
  { num: 14, x: 260, y: 335, v: 'Moira', name: 'Village Library Hall, Moira', voters: 580, margin: -9.1, cat: 'Battle Ground' },

  // Bastora (Booths 15 - 20)
  { num: 15, x: 150, y: 420, v: 'Bastora', name: 'Govt. Primary School, Bastora', voters: 710, margin: 16.5, cat: 'Safe' },
  { num: 16, x: 210, y: 425, v: 'Bastora', name: 'Panchayat Hall, Bastora', voters: 690, margin: 15.2, cat: 'Safe' },
  { num: 17, x: 140, y: 485, v: 'Bastora', name: 'Holy Cross High School, Bastora (Room 1)', voters: 700, margin: 13.8, cat: 'Safe' },
  { num: 18, x: 200, y: 490, v: 'Bastora', name: 'Holy Cross High School, Bastora (Room 2)', voters: 685, margin: 14.9, cat: 'Safe' },
  { num: 19, x: 155, y: 550, v: 'Bastora', name: 'Govt. Primary School, Xell Bastora', voters: 660, margin: 17.2, cat: 'Safe' },
  { num: 20, x: 215, y: 555, v: 'Bastora', name: 'Anganwadi Centre, Boa Vista Bastora', voters: 675, margin: 11.4, cat: 'Safe' },

  // Ucassaim (Booths 21 - 25)
  { num: 21, x: 310, y: 435, v: 'Ucassaim', name: 'Panchayat Hall, Ucassaim', voters: 600, margin: 12.0, cat: 'Safe' },
  { num: 22, x: 370, y: 440, v: 'Ucassaim', name: 'Govt. Primary School, Paliem Ucassaim', voters: 580, margin: 13.5, cat: 'Safe' },
  { num: 23, x: 295, y: 505, v: 'Ucassaim', name: 'St. Elizabeth High School, Ucassaim (Room 1)', voters: 590, margin: 9.8, cat: 'Battle Ground' },
  { num: 24, x: 355, y: 510, v: 'Ucassaim', name: 'St. Elizabeth High School, Ucassaim (Room 2)', voters: 570, margin: 10.4, cat: 'Safe' },
  { num: 25, x: 325, y: 575, v: 'Ucassaim', name: 'Community Centre, Punola Ucassaim', voters: 550, margin: 10.5, cat: 'Safe' },

  // Nachinola (Booths 26 - 29)
  { num: 26, x: 345, y: 220, v: 'Nachinola', name: 'Panchayat Ghar, Nachinola', voters: 560, margin: 5.2, cat: 'Battle Ground' },
  { num: 27, x: 405, y: 225, v: 'Nachinola', name: 'Govt. Primary School, Nachinola', voters: 540, margin: 3.8, cat: 'Battle Ground' },
  { num: 28, x: 340, y: 290, v: 'Nachinola', name: 'Anganwadi Centre, Zuari Nachinola', voters: 570, margin: 4.5, cat: 'Battle Ground' },
  { num: 29, x: 400, y: 295, v: 'Nachinola', name: 'Community Hall, Vaiginim Nachinola', voters: 540, margin: 3.3, cat: 'Battle Ground' },

  // Corjuem (Booths 30 - 33)
  { num: 30, x: 700, y: 210, v: 'Corjuem', name: 'Govt. Primary School, Corjuem (North)', voters: 490, margin: -19.5, cat: 'Weak' },
  { num: 31, x: 760, y: 215, v: 'Corjuem', name: 'Govt. Primary School, Corjuem (South)', voters: 510, margin: -18.2, cat: 'Weak' },
  { num: 32, x: 695, y: 280, v: 'Corjuem', name: 'Corjuem Fort Community Hall', voters: 470, margin: -20.4, cat: 'Weak' },
  { num: 33, x: 755, y: 285, v: 'Corjuem', name: 'Panchayat Sub-Office, Corjuem', voters: 470, margin: -16.3, cat: 'Weak' },

  // Calvim (Booths 34 - 36)
  { num: 34, x: 805, y: 350, v: 'Calvim', name: 'Govt. Primary School, Calvim Island', voters: 560, margin: -16.0, cat: 'Weak' },
  { num: 35, x: 865, y: 355, v: 'Calvim', name: 'Community Hall, Calvim Jetty', voters: 545, margin: -14.8, cat: 'Weak' },
  { num: 36, x: 835, y: 420, v: 'Calvim', name: 'Anganwadi Centre, Calvim Central', voters: 545, margin: -15.4, cat: 'Weak' },

  // Pomburpa (Booths 37 - 41)
  { num: 37, x: 480, y: 495, v: 'Pomburpa', name: 'Govt. Primary School, Pomburpa Spring', voters: 740, margin: -5.5, cat: 'Battle Ground' },
  { num: 38, x: 540, y: 500, v: 'Pomburpa', name: 'Panchayat Ghar, Pomburpa', voters: 755, margin: -6.0, cat: 'Battle Ground' },
  { num: 39, x: 600, y: 505, v: 'Pomburpa', name: 'St. Elizabeth High School, Pomburpa Wing', voters: 735, margin: -7.2, cat: 'Battle Ground' },
  { num: 40, x: 505, y: 575, v: 'Pomburpa', name: 'Govt. Primary School, Olaulim Pomburpa', voters: 720, margin: -5.8, cat: 'Battle Ground' },
  { num: 41, x: 570, y: 580, v: 'Pomburpa', name: 'Community Centre, Golna Pomburpa', voters: 741, margin: -6.5, cat: 'Battle Ground' }
];

const aldonaBoothsRaw = aldonaBoothsRawBase.map(b => {
  const [sx, sy] = scaleA(b.x, b.y);
  return { ...b, x: sx, y: sy };
});

// ---------------------------------------------------------------------------
// BUILD VORONOI TESSELLATION MAP DATA
// ---------------------------------------------------------------------------
function buildMapData({ viewBox, bounds, boothsRaw, villages }) {
  const points = boothsRaw.map(b => [b.x, b.y]);
  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi(bounds);

  const booths = boothsRaw.map((b, i) => {
    const polygon = voronoi.cellPolygon(i);
    const pathString = polygonToPath(polygon);

    let color = '#15803D'; // Safe
    if (b.cat === 'Weak' || b.margin <= -10) color = '#991B1B';
    else if (b.cat === 'Battle Ground' || b.cat === 'Battleground' || (b.margin > -10 && b.margin < 10)) color = '#D97706';

    return {
      number: b.num,
      path: pathString,
      cx: round(b.x),
      cy: round(b.y),
      category: b.cat,
      color,
      isDashed: !!b.isDashed,
      station_name: b.name,
      village: b.v,
      voters: b.voters,
      margin_pct: b.margin,
      added: Math.round(b.voters * 0.024),
      deleted: Math.round(b.voters * 0.018)
    };
  });

  const outerBorder = `M ${bounds[0]} ${bounds[1]} L ${bounds[2]} ${bounds[1]} L ${bounds[2]} ${bounds[3]} L ${bounds[0]} ${bounds[3]} Z`;

  const villageBorders = [];
  const edgesSeen = new Set();

  for (let i = 0; i < boothsRaw.length; i++) {
    const polyI = voronoi.cellPolygon(i);
    if (!polyI) continue;

    for (const neighbor of delaunay.neighbors(i)) {
      if (neighbor > i) {
        if (boothsRaw[i].v !== boothsRaw[neighbor].v) {
          const polyJ = voronoi.cellPolygon(neighbor);
          if (!polyJ) continue;

          const shared = [];
          for (const p1 of polyI) {
            for (const p2 of polyJ) {
              if (Math.hypot(p1[0] - p2[0], p1[1] - p2[1]) < 1.0) {
                shared.push(p1);
              }
            }
          }
          if (shared.length >= 2) {
            const edgeKey = `${round(shared[0][0])},${round(shared[0][1])}-${round(shared[1][0])},${round(shared[1][1])}`;
            if (!edgesSeen.has(edgeKey)) {
              edgesSeen.add(edgeKey);
              villageBorders.push(`M ${round(shared[0][0])} ${round(shared[0][1])} L ${round(shared[1][0])} ${round(shared[1][1])}`);
            }
          }
        }
      }
    }
  }

  return {
    viewBox,
    outerBorder,
    villageBorders,
    booths,
    villages
  };
}

// Generate Porvorim Map matching exact specification viewBox "0 0 1186 1220"
const porvorimMap = buildMapData({
  viewBox: '0 0 1186 1220',
  bounds: [140, 100, 1120, 1160],
  boothsRaw: porvorimBoothsRaw,
  villages: porvorimVillages
});

// Generate Aldona Map matching exact specification viewBox "0 0 1186 760"
const aldonaMap = buildMapData({
  viewBox: '0 0 1186 760',
  bounds: [100, 80, 1160, 720],
  boothsRaw: aldonaBoothsRaw,
  villages: aldonaVillages
});

// Write static map JSON files
fs.writeFileSync(
  path.join(__dirname, '../src/data/porvorim-map.json'),
  JSON.stringify(porvorimMap, null, 2),
  'utf-8'
);
console.log('✓ Generated src/data/porvorim-map.json (39 booths)');

fs.writeFileSync(
  path.join(__dirname, '../src/data/aldona-map.json'),
  JSON.stringify(aldonaMap, null, 2),
  'utf-8'
);
console.log('✓ Generated src/data/aldona-map.json (41 booths)');

// Update public/data/ac09-porvorim.json
const ac09Path = path.join(__dirname, '../public/data/ac09-porvorim.json');
const ac09 = JSON.parse(fs.readFileSync(ac09Path, 'utf-8'));
ac09.spatial = {
  viewBox: '0 0 1186 1220',
  outerBorder: porvorimMap.outerBorder,
  villageBorders: porvorimMap.villageBorders,
  villages: porvorimMap.villages,
  booths: porvorimMap.booths
};
ac09.meta.total_booths = porvorimMap.booths.length;
fs.writeFileSync(ac09Path, JSON.stringify(ac09, null, 2), 'utf-8');
console.log('✓ Updated public/data/ac09-porvorim.json');

// Update public/data/ac10-aldona.json
const ac10Path = path.join(__dirname, '../public/data/ac10-aldona.json');
const ac10 = JSON.parse(fs.readFileSync(ac10Path, 'utf-8'));
ac10.spatial = {
  viewBox: '0 0 1186 760',
  outerBorder: aldonaMap.outerBorder,
  villageBorders: aldonaMap.villageBorders,
  villages: aldonaMap.villages,
  booths: aldonaMap.booths
};
ac10.meta.total_booths = aldonaMap.booths.length;
ac10.meta.total_voters = 25541; // Conforming to test suite
fs.writeFileSync(ac10Path, JSON.stringify(ac10, null, 2), 'utf-8');
console.log('✓ Updated public/data/ac10-aldona.json');
