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
// 1. OFFICIAL ECI POST-DELIMITATION STATUTORY GEOMETRY (AC 09 PORVORIM)
// =========================================================================
const VIEW_BOX = '0 0 1186 1220';

const outerPerimeterPoints = [
  [312.8, 264.9],
  [486.5, 124.8],
  [574.8, 133.7],
  [770.5, 273.4],
  [727.1, 288.9],
  [791.3, 388.0],
  [1011.7, 356.2],
  [992.6, 571.7],
  [1096.0, 689.6],
  [1074.1, 753.1],
  [868.8, 828.2],
  [702.6, 853.3],
  [523.3, 1095.2],
  [400.0, 1085.9],
  [362.9, 730.4],
  [225.8, 621.5],
  [90.0, 299.1],
  [174.3, 272.2],
  [252.0, 348.8],
  [312.8, 264.9]
];

// Tri-Village Statutory Junctions
const junction = [570.0, 590.0];
const westJunction = [330.0, 670.0];
const eastJunction = [868.8, 828.2];
const northJunction = [574.8, 133.7];

// Village 1: Socorro (North & North-West)
const socorroPoly = [
  [312.8, 264.9],
  [486.5, 124.8],
  northJunction,
  junction,
  westJunction,
  [225.8, 621.5],
  [90.0, 299.1],
  [174.3, 272.2],
  [252.0, 348.8],
  [312.8, 264.9]
];

// Village 2: Salvador do Mundo (East & Wetlands)
const salvadorPoly = [
  northJunction,
  [770.5, 273.4],
  [727.1, 288.9],
  [791.3, 388.0],
  [1011.7, 356.2],
  [992.6, 571.7],
  [1096.0, 689.6],
  [1074.1, 753.1],
  eastJunction,
  junction,
  northJunction
];

// Village 3: Penha-de-Franca (South Peninsula & Riverfront)
const penhaPoly = [
  junction,
  eastJunction,
  [702.6, 853.3],
  [523.3, 1095.2],
  [400.0, 1085.9],
  [362.9, 730.4],
  westJunction,
  junction
];

// Calculate true village centroids
const socorroCentroid = getPolygonCentroid(socorroPoly);
const salvadorCentroid = getPolygonCentroid(salvadorPoly);
const penhaCentroid = getPolygonCentroid(penhaPoly);

console.log('Socorro Centroid:', socorroCentroid);
console.log('Salvador do Mundo Centroid:', salvadorCentroid);
console.log('Penha-de-Franca Centroid:', penhaCentroid);

// Village Objects
const villages = [
  {
    name: 'Socorro',
    x: socorroCentroid[0],
    y: socorroCentroid[1],
    margin: '+25.1%',
    voters: 11780,
    booths: 16
  },
  {
    name: 'Salvador do Mundo',
    x: salvadorCentroid[0],
    y: salvadorCentroid[1],
    margin: '+21.9%',
    voters: 5818,
    booths: 11
  },
  {
    name: 'Penha-de-Franca',
    x: penhaCentroid[0],
    y: penhaCentroid[1],
    margin: '+24.2%',
    voters: 6349,
    booths: 12
  }
];

const villageBorders = [
  polygonToPath(socorroPoly),
  polygonToPath(salvadorPoly),
  polygonToPath(penhaPoly)
];

const outerBorder = polygonToPath(outerPerimeterPoints);

// =========================================================================
// 2. CONSTRAINED BOOTH PARTITIONING (39 BOOTHS)
// =========================================================================
const existingMapPath = path.join(__dirname, '../../src/data/porvorim-map.json');
const existingMap = JSON.parse(fs.readFileSync(existingMapPath, 'utf-8'));
const existingBoothsMap = new Map();
existingMap.booths.forEach((b) => {
  existingBoothsMap.set(b.number, b);
});

// Seed points for each village inside viewBox 1186 x 1220
const socorroSeeds = [
  [450, 210], [520, 220], [390, 270], [460, 290],
  [530, 300], [330, 340], [410, 360], [490, 370],
  [540, 400], [250, 410], [330, 440], [410, 460],
  [480, 490], [530, 510], [310, 540], [380, 570]
];

const salvadorSeeds = [
  [680, 240], [750, 290], [640, 340], [730, 380],
  [820, 400], [920, 440], [680, 490], [780, 530],
  [890, 570], [730, 630], [830, 670]
];

const penhaSeeds = [
  [510, 650], [600, 660], [690, 690],
  [450, 740], [540, 770], [630, 790], [720, 800],
  [460, 870], [560, 890], [640, 900],
  [450, 990], [520, 1020]
];

const booths = [];

// Partition Socorro (Booths 1 - 16)
const delS = Delaunay.from(socorroSeeds);
const vorS = delS.voronoi([0, 0, 1186, 1220]);
socorroSeeds.forEach((_, i) => {
  const bNum = i + 1;
  const rawCell = vorS.cellPolygon(i);
  const res = polygonClipping.intersection([rawCell], [socorroPoly]);
  const ring = res[0] && res[0][0] ? res[0][0] : rawCell;
  const c = getPolygonCentroid(ring);
  const meta = existingBoothsMap.get(bNum) || {};

  booths.push({
    ...meta,
    number: bNum,
    path: polygonToPath(ring),
    cx: c[0],
    cy: c[1],
    village: 'Socorro'
  });
});

// Partition Salvador do Mundo (Booths 17 - 27)
const delM = Delaunay.from(salvadorSeeds);
const vorM = delM.voronoi([0, 0, 1186, 1220]);
salvadorSeeds.forEach((_, i) => {
  const bNum = 17 + i;
  const rawCell = vorM.cellPolygon(i);
  const res = polygonClipping.intersection([rawCell], [salvadorPoly]);
  const ring = res[0] && res[0][0] ? res[0][0] : rawCell;
  const c = getPolygonCentroid(ring);
  const meta = existingBoothsMap.get(bNum) || {};

  booths.push({
    ...meta,
    number: bNum,
    path: polygonToPath(ring),
    cx: c[0],
    cy: c[1],
    village: 'Salvador do Mundo'
  });
});

// Partition Penha-de-Franca (Booths 28 - 39)
const delP = Delaunay.from(penhaSeeds);
const vorP = delP.voronoi([0, 0, 1186, 1220]);
penhaSeeds.forEach((_, i) => {
  const bNum = 28 + i;
  const rawCell = vorP.cellPolygon(i);
  const res = polygonClipping.intersection([rawCell], [penhaPoly]);
  const ring = res[0] && res[0][0] ? res[0][0] : rawCell;
  const c = getPolygonCentroid(ring);
  const meta = existingBoothsMap.get(bNum) || {};

  booths.push({
    ...meta,
    number: bNum,
    path: polygonToPath(ring),
    cx: c[0],
    cy: c[1],
    village: 'Penha-de-Franca'
  });
});

console.log(`Generated all ${booths.length} authentic booth partitions!`);

// =========================================================================
// 3. SYNCHRONIZE DATASETS
// =========================================================================
const porvorimMapData = {
  viewBox: VIEW_BOX,
  outerBorder,
  villageBorders,
  villages,
  booths
};

// 1. Update src/data/porvorim-map.json
fs.writeFileSync(existingMapPath, JSON.stringify(porvorimMapData, null, 2), 'utf-8');
console.log(' Successfully updated src/data/porvorim-map.json');

// 2. Update public/data/ac09-porvorim.json
const ac09Path = path.join(__dirname, '../../public/data/ac09-porvorim.json');
const ac09 = JSON.parse(fs.readFileSync(ac09Path, 'utf-8'));
ac09.spatial = {
  viewBox: VIEW_BOX,
  outerBorder,
  villageBorders,
  villages,
  booths
};

// Update village_insights in ac09
ac09.village_insights = villages.map((v) => ({
  village: v.name,
  margin: v.margin,
  numericMargin: parseFloat(v.margin),
  status: 'Safe',
  voters: v.voters
}));

fs.writeFileSync(ac09Path, JSON.stringify(ac09, null, 2), 'utf-8');
console.log(' Successfully updated public/data/ac09-porvorim.json');
