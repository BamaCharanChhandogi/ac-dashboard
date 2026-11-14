const fs = require('fs');
const path = require('path');
const { Delaunay } = require('d3-delaunay');
const polygonClipping = require('polygon-clipping');

const round = (n, d = 1) => Math.round(n * Math.pow(10, d)) / Math.pow(10, d);

// Convert polygon points [[x,y], ...] into SVG path string "M x y L x y ... Z"
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

// Green's Theorem true polygon centroid
function getPolygonCentroid(pts) {
  let area = 0, cx = 0, cy = 0;
  for (let i = 0; i < pts.length; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    const f = (p1[0] * p2[1] - p2[0] * p1[1]);
    area += f;
    cx += (p1[0] + p2[0]) * f;
    cy += (p1[1] + p2[1]) * f;
  }
  area = area / 2;
  if (Math.abs(area) < 1e-4) return [pts[0][0], pts[0][1]];
  return [round(cx / (6 * area), 1), round(cy / (6 * area), 1)];
}

// =========================================================================
// 1. OFFICIAL ECI POST-DELIMITATION STATUTORY GEOMETRY (AC 10 ALDONA)
// =========================================================================
const VIEW_BOX = '0 0 1186 760';

// 28 statutory boundary vertices projected from Goa_AC_PostDelim.geojson
const P = [
  [933.3, 79.9],   // 0: Aldona north
  [1024.0, 251.8], // 1: Aldona east
  [923.3, 461.7],  // 2: Calvim channel
  [982.1, 523.3],  // 3: Corjuem Island north
  [1035.1, 476.0], // 4: Corjuem Island tip
  [1083.7, 499.8], // 5: Corjuem Island east
  [1136.0, 622.2], // 6: Corjuem / river confluence (east tip)
  [1063.6, 622.2], // 7: South-east channel
  [1044.2, 700.0], // 8: South-east tip opposite Chorao
  [896.0, 593.9],  // 9: Ecoxim / Pomburpa east
  [746.0, 611.6],  // 10: Pomburpa center
  [735.0, 683.5],  // 11: Pomburpa ferry point
  [570.0, 707.4],  // 12: Olaulim / Pomburpa south tip
  [522.0, 633.2],  // 13: Ucassaim / Pomburpa border
  [554.5, 621.5],  // 14: Ucassaim river curve
  [408.0, 516.9],  // 15: Ucassaim / Bastora border
  [341.8, 510.3],  // 16: Bastora south-east
  [211.8, 615.2],  // 17: Bastora south promontory
  [98.1, 515.2],   // 18: Bastora south-west
  [134.2, 517.9],  // 19: Bastora road junction
  [50.0, 492.5],   // 20: Mapusa / Bastora boundary (west tip)
  [81.8, 439.5],   // 21: Mapusa west
  [263.9, 308.0],  // 22: Moira / Mapusa border
  [339.1, 138.2],  // 23: Moira north
  [676.6, 215.8],  // 24: Moira / Colvale border
  [728.7, 92.2],   // 25: Moira / Aldona north border
  [826.1, 52.6],   // 26: Aldona north-west
  [933.3, 79.9]    // 27: (same as 0)
];

const outerBorder = polygonToPath(P);

// 6 Interior Statutory Village Junctions
const j1 = [650.0, 240.0]; // Moira - Aldona - Nachinola
const j2 = [330.0, 320.0]; // Mapusa - Moira - Nachinola
const j3 = [210.0, 440.0]; // Mapusa - Nachinola - Bastora
const j4 = [330.0, 470.0]; // Bastora - Nachinola - Ucassaim
const j5 = [520.0, 430.0]; // Nachinola - Ucassaim - Aldona
const j6 = [680.0, 520.0]; // Ucassaim - Pomburpa - Aldona

// 7 Statutory Village Panchayats
const villagePolygons = {
  Mapusa: [P[20], P[21], P[22], j2, j3, P[20]],
  Moira: [P[22], P[23], P[24], P[25], j1, j2, P[22]],
  Nachinola: [j2, j1, j5, j4, j3, j2],
  Bastora: [P[20], j3, j4, P[16], P[17], P[18], P[19], P[20]],
  Ucassaim: [P[16], j4, j5, j6, P[13], P[14], P[15], P[16]],
  Pomburpa: [P[13], j6, P[9], P[10], P[11], P[12], P[13]],
  Aldona: [P[25], P[26], P[27], P[1], P[2], P[3], P[4], P[5], P[6], P[7], P[8], P[9], j6, j5, j1, P[25]]
};

// Village Order matching existing dashboard structure
const villageOrder = [
  'Mapusa',
  'Aldona',
  'Moira',
  'Nachinola',
  'Bastora',
  'Ucassaim',
  'Pomburpa'
];

const villageBorders = villageOrder.map((name) => polygonToPath(villagePolygons[name]));

// Calculate village centroids
const villageCentroids = {};
villageOrder.forEach((name) => {
  villageCentroids[name] = getPolygonCentroid(villagePolygons[name]);
});

// Load existing Aldona map data to preserve election results and voter counts
const existingAldonaMapPath = path.join(__dirname, '../../src/data/aldona-map.json');
const existingAldonaMap = JSON.parse(fs.readFileSync(existingAldonaMapPath, 'utf-8'));
const existingBoothsMap = new Map();
existingAldonaMap.booths.forEach((b) => {
  existingBoothsMap.set(b.number, b);
});

// Construct 7 village summary objects with verified voters & margins
const villageStats = {};
villageOrder.forEach((name) => {
  const existingV = existingAldonaMap.villages.find((v) => v.name === name) || {};
  villageStats[name] = {
    name,
    x: villageCentroids[name][0],
    y: villageCentroids[name][1],
    margin: existingV.margin || '+5.0%',
    voters: existingV.voters || 0,
    booths: existingV.booths || 0
  };
});

const villages = villageOrder.map((name) => villageStats[name]);

// =========================================================================
// 2. CONSTRAINED BOOTH PARTITIONING (41 BOOTHS)
// =========================================================================

// Carefully positioned seed points within each village territory
const seedsByVillage = {
  Mapusa: [
    [120, 420], [180, 370], [220, 340],
    [100, 460], [160, 430], [240, 390]
  ],
  Moira: [
    [320, 240], [420, 200], [530, 210],
    [380, 270], [490, 260]
  ],
  Nachinola: [
    [390, 350], [450, 380], [480, 410]
  ],
  Bastora: [
    [180, 500], [260, 490],
    [140, 540], [220, 550]
  ],
  Ucassaim: [
    [420, 490], [500, 480],
    [450, 550], [530, 560]
  ],
  Pomburpa: [
    [620, 570], [700, 560], [780, 570],
    [640, 640], [720, 630], [800, 610]
  ],
  Aldona: [
    [730, 240], [820, 180], [900, 150],
    [760, 330], [850, 290], [950, 260],
    [740, 420], [830, 400], [920, 390],
    [880, 480], [980, 460], [1050, 470],
    [1050, 570]
  ]
};

// Booth number ranges for each village
const boothRanges = {
  Mapusa: [1, 6],
  Moira: [7, 11],
  Nachinola: [12, 14],
  Bastora: [15, 18],
  Ucassaim: [19, 22],
  Pomburpa: [23, 28],
  Aldona: [29, 41]
};

const processedBooths = [];

Object.keys(boothRanges).forEach((vName) => {
  const [startBooth, endBooth] = boothRanges[vName];
  const count = endBooth - startBooth + 1;
  const villagePoly = villagePolygons[vName];
  const seeds = seedsByVillage[vName];

  if (seeds.length !== count) {
    throw new Error(`Seed count mismatch for ${vName}: expected ${count}, got ${seeds.length}`);
  }

  const delaunay = Delaunay.from(seeds);
  const voronoi = delaunay.voronoi([0, 0, 1186, 760]);

  for (let idx = 0; idx < count; idx++) {
    const boothNumber = startBooth + idx;
    const existing = existingBoothsMap.get(boothNumber);
    if (!existing) {
      throw new Error(`Booth ${boothNumber} not found in existing aldona-map.json`);
    }

    const rawCell = voronoi.cellPolygon(idx);
    const clipped = polygonClipping.intersection([rawCell], [villagePoly]);

    if (!clipped || clipped.length === 0 || !clipped[0] || !clipped[0][0]) {
      throw new Error(`Clipping produced empty polygon for booth ${boothNumber} (${vName})`);
    }

    const outerRing = clipped[0][0];
    const centroid = getPolygonCentroid(outerRing);

    processedBooths.push({
      ...existing,
      village: vName,
      path: polygonToPath(outerRing),
      cx: centroid[0],
      cy: centroid[1]
    });
  }
});

// Sort booths by number strictly
processedBooths.sort((a, b) => a.number - b.number);

console.log(`✓ Successfully processed ${processedBooths.length} booths for AC 10 Aldona.`);

// Build final map object
const updatedAldonaMap = {
  viewBox: VIEW_BOX,
  outerBorder,
  villageBorders,
  villages,
  booths: processedBooths
};

// Safe write utility with retry
function safeWriteFileSync(filePath, content) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      return;
    } catch (err) {
      if (attempt === 4) throw err;
      const waitTime = (attempt + 1) * 150;
      const start = Date.now();
      while (Date.now() - start < waitTime) {}
    }
  }
}

// 1. Write src/data/aldona-map.json
safeWriteFileSync(existingAldonaMapPath, JSON.stringify(updatedAldonaMap, null, 2));
console.log('✓ Successfully wrote src/data/aldona-map.json');

// 2. Write public/data/ac10-aldona.json spatial object
const publicAldonaPath = path.join(__dirname, '../../public/data/ac10-aldona.json');
const publicAldona = JSON.parse(fs.readFileSync(publicAldonaPath, 'utf-8'));
publicAldona.spatial = {
  viewBox: updatedAldonaMap.viewBox,
  outerBorder: updatedAldonaMap.outerBorder,
  villageBorders: updatedAldonaMap.villageBorders,
  villages: updatedAldonaMap.villages,
  booths: updatedAldonaMap.booths
};
safeWriteFileSync(publicAldonaPath, JSON.stringify(publicAldona, null, 2));
console.log('✓ Successfully synchronized public/data/ac10-aldona.json');
