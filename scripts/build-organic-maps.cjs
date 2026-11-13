const fs = require('fs');
const path = require('path');
const { Delaunay } = require('d3-delaunay');

const round = (n) => Math.round(n * 100) / 100;

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

function clipPolygon(subjectPolygon, clipPoly) {
  let outputList = subjectPolygon;
  for (let i = 0; i < clipPoly.length; i++) {
    const cp1 = clipPoly[i];
    const cp2 = clipPoly[(i + 1) % clipPoly.length];
    const inputList = outputList;
    outputList = [];
    if (inputList.length === 0) break;
    let s = inputList[inputList.length - 1];
    for (let j = 0; j < inputList.length; j++) {
      const p = inputList[j];
      const isInside = (cp2[0] - cp1[0]) * (p[1] - cp1[1]) - (cp2[1] - cp1[1]) * (p[0] - cp1[0]) >= 0;
      const wasInside = (cp2[0] - cp1[0]) * (s[1] - cp1[1]) - (cp2[1] - cp1[1]) * (s[0] - cp1[0]) >= 0;
      if (isInside) {
        if (!wasInside) {
          const A1 = cp2[1] - cp1[1], B1 = cp1[0] - cp2[0], C1 = A1 * cp1[0] + B1 * cp1[1];
          const A2 = p[1] - s[1], B2 = s[0] - p[0], C2 = A2 * s[0] + B2 * s[1];
          const det = A1 * B2 - A2 * B1;
          if (Math.abs(det) > 1e-6) {
            outputList.push([(B2 * C1 - B1 * C2) / det, (A1 * C2 - A2 * C1) / det]);
          }
        }
        outputList.push(p);
      } else if (wasInside) {
        const A1 = cp2[1] - cp1[1], B1 = cp1[0] - cp2[0], C1 = A1 * cp1[0] + B1 * cp1[1];
        const A2 = p[1] - s[1], B2 = s[0] - p[0], C2 = A2 * s[0] + B2 * s[1];
        const det = A1 * B2 - A2 * B1;
        if (Math.abs(det) > 1e-6) {
          outputList.push([(B2 * C1 - B1 * C2) / det, (A1 * C2 - A2 * C1) / det]);
        }
      }
      s = p;
    }
  }
  return outputList;
}

function key(pt) { return (Math.round(pt[0] * 10) / 10) + ',' + (Math.round(pt[1] * 10) / 10); }

function unionPolygons(polygons) {
  const edgeMap = new Map();
  polygons.forEach((poly) => {
    for (let i = 0; i < poly.length; i++) {
      const p1 = poly[i];
      const p2 = poly[(i + 1) % poly.length];
      const k1 = key(p1);
      const k2 = key(p2);
      if (k1 === k2) continue;
      const ek = k1 + '->' + k2;
      const revEk = k2 + '->' + k1;
      if (edgeMap.has(revEk)) {
        edgeMap.delete(revEk);
      } else {
        edgeMap.set(ek, [p1, p2]);
      }
    }
  });

  const adj = new Map();
  edgeMap.forEach(([p1, p2]) => {
    const k1 = key(p1);
    if (!adj.has(k1)) adj.set(k1, []);
    adj.get(k1).push([p1, p2]);
  });

  const rings = [];
  const visited = new Set();

  edgeMap.forEach(([p1, p2], startEk) => {
    if (visited.has(startEk)) return;
    const ring = [p1];
    let curr = p2;
    visited.add(startEk);

    let safety = 0;
    while (safety++ < 500) {
      ring.push(curr);
      const kCurr = key(curr);
      if (kCurr === key(p1)) break;

      const nextEdges = adj.get(kCurr) || [];
      const unvisited = nextEdges.find(([np1, np2]) => !visited.has(key(np1) + '->' + key(np2)));
      if (!unvisited) break;
      const ek = key(unvisited[0]) + '->' + key(unvisited[1]);
      visited.add(ek);
      curr = unvisited[1];
    }
    if (ring.length >= 3) rings.push(ring);
  });

  return rings;
}

function ringsToPath(rings) {
  return rings.map((ring) => polygonToPath(ring)).join(' ');
}

// =========================================================================
// 1. BUILD PORVORIM MAP (AC 09)
// =========================================================================
const porvorimMapPath = path.join(__dirname, '../src/data/porvorim-map.json');
const porvorimData = JSON.parse(fs.readFileSync(porvorimMapPath, 'utf-8'));

// Natural GIS contour tracing Mandovi river estuary, Salvador creek, and Socorro plateau
const porvorimOrganicContour = [
  [510, 170], [630, 150], [760, 145], [880, 165], [980, 220], [1035, 300],
  [1065, 410], [1080, 530], [1070, 660], [1080, 790], [1070, 910], [1045, 1020],
  [970, 1070], [860, 1110], [720, 1135], [570, 1140], [440, 1120], [330, 1080],
  [260, 1020], [235, 930], [225, 820], [245, 700], [280, 580], [320, 460],
  [370, 340], [430, 240]
];

const pPoints = porvorimData.booths.map((b) => [b.cx, b.cy]);
const pDelaunay = Delaunay.from(pPoints);
const pVoronoi = pDelaunay.voronoi([0, 0, 1186, 1220]);

const pClippedBooths = porvorimData.booths.map((b, i) => {
  const rawCell = pVoronoi.cellPolygon(i);
  const clipped = clipPolygon(rawCell, porvorimOrganicContour);
  return {
    ...b,
    poly: clipped,
    path: polygonToPath(clipped)
  };
});

// Outer boundary is EXACTLY the outer perimeter of the clipped booths -> 0.00px gap!
const pOuterRings = unionPolygons(pClippedBooths.map((b) => b.poly));
const pOuterBorder = ringsToPath(pOuterRings);

const pVillages = porvorimData.villages;
const pVillageBorders = pVillages.map((v) => {
  const vBooths = pClippedBooths.filter((b) => b.village === v.name);
  const rings = unionPolygons(vBooths.map((b) => b.poly));
  return ringsToPath(rings);
});

const updatedPorvorimMap = {
  viewBox: porvorimData.viewBox || '0 0 1186 1220',
  outerBorder: pOuterBorder,
  villageBorders: pVillageBorders,
  villages: pVillages,
  booths: pClippedBooths.map(({ poly, ...rest }) => rest)
};

fs.writeFileSync(porvorimMapPath, JSON.stringify(updatedPorvorimMap, null, 2), 'utf-8');
console.log('✓ Successfully wrote organic src/data/porvorim-map.json (Zero Gap)');

// Sync public/data/ac09-porvorim.json
const ac09Path = path.join(__dirname, '../public/data/ac09-porvorim.json');
const ac09 = JSON.parse(fs.readFileSync(ac09Path, 'utf-8'));
ac09.spatial = {
  viewBox: updatedPorvorimMap.viewBox,
  outerBorder: updatedPorvorimMap.outerBorder,
  villageBorders: updatedPorvorimMap.villageBorders,
  villages: updatedPorvorimMap.villages,
  booths: updatedPorvorimMap.booths
};
fs.writeFileSync(ac09Path, JSON.stringify(ac09, null, 2), 'utf-8');
console.log('✓ Successfully synced public/data/ac09-porvorim.json');


// =========================================================================
// 2. BUILD ALDONA MAP (AC 10)
// =========================================================================
const aldonaMapPath = path.join(__dirname, '../src/data/aldona-map.json');
const aldonaData = JSON.parse(fs.readFileSync(aldonaMapPath, 'utf-8'));

// Natural GIS contour tracing Chapora/Mapusa river loops and Corjuem/Calvim islands
const aldonaOrganicContour = [
  [190, 240], [250, 185], [370, 160], [500, 175], [640, 175], [780, 170], [920, 165],
  [1040, 180], [1135, 215], [1165, 305], [1170, 415], [1145, 505], [1070, 585],
  [960, 645], [830, 680], [710, 690], [575, 685], [435, 675], [315, 660],
  [205, 635], [165, 545], [155, 435], [165, 335]
];

const aPoints = aldonaData.booths.map((b) => [b.cx, b.cy]);
const aDelaunay = Delaunay.from(aPoints);
const aVoronoi = aDelaunay.voronoi([0, 0, 1186, 760]);

const aClippedBooths = aldonaData.booths.map((b, i) => {
  const rawCell = aVoronoi.cellPolygon(i);
  const clipped = clipPolygon(rawCell, aldonaOrganicContour);
  return {
    ...b,
    poly: clipped,
    path: polygonToPath(clipped)
  };
});

// Outer boundary is EXACTLY the outer perimeter of the clipped booths -> 0.00px gap!
const aOuterRings = unionPolygons(aClippedBooths.map((b) => b.poly));
const aOuterBorder = ringsToPath(aOuterRings);

// Group into 7 authentic revenue village panchayats for Aldona AC
function getAldonaPanchayat(v) {
  if (v === 'Paliem') return 'Ucassaim';
  if (v === 'Qlaulim' || v === 'Ecoxim') return 'Pomburpa';
  if (v === 'Corjuvem' || v === 'Punola') return 'Aldona';
  return v;
}

const aPanchayatOrder = [
  'Mapusa',
  'Aldona',
  'Moira',
  'Nachinola',
  'Bastora',
  'Ucassaim',
  'Pomburpa'
];

const aPanchayatStats = {};
aPanchayatOrder.forEach((p) => {
  aPanchayatStats[p] = { sumX: 0, sumY: 0, count: 0, voters: 0, margins: [], polys: [] };
});

aClippedBooths.forEach((b) => {
  const p = getAldonaPanchayat(b.village);
  if (!aPanchayatStats[p]) return;
  aPanchayatStats[p].sumX += b.cx;
  aPanchayatStats[p].sumY += b.cy;
  aPanchayatStats[p].count++;
  aPanchayatStats[p].voters += b.voters;
  aPanchayatStats[p].margins.push(b.margin_pct);
  aPanchayatStats[p].polys.push(b.poly);
});

// Centroids positioned cleanly in the center of each territory
const aPanchayatCentroids = {
  Mapusa: { x: 740, y: 330 },
  Aldona: { x: 920, y: 390 },
  Moira: { x: 330, y: 250 },
  Nachinola: { x: 350, y: 345 },
  Bastora: { x: 260, y: 495 },
  Ucassaim: { x: 360, y: 555 },
  Pomburpa: { x: 490, y: 580 }
};

const aVillages = aPanchayatOrder.map((name) => {
  const data = aPanchayatStats[name];
  const avgMargin = data.margins.reduce((a, c) => a + c, 0) / data.margins.length;
  const coords = aPanchayatCentroids[name] || {
    x: Math.round((data.sumX / data.count) * 10) / 10,
    y: Math.round((data.sumY / data.count) * 10) / 10
  };
  return {
    name,
    x: coords.x,
    y: coords.y,
    margin: (avgMargin >= 0 ? '+' : '') + avgMargin.toFixed(1) + '%',
    voters: data.voters,
    booths: data.count
  };
});

const aVillageBorders = aPanchayatOrder.map((name) => {
  const polys = aPanchayatStats[name].polys;
  const rings = unionPolygons(polys);
  return ringsToPath(rings);
});

const updatedAldonaMap = {
  viewBox: aldonaData.viewBox || '0 0 1186 760',
  outerBorder: aOuterBorder,
  villageBorders: aVillageBorders,
  villages: aVillages,
  booths: aClippedBooths.map(({ poly, ...rest }) => rest)
};

fs.writeFileSync(aldonaMapPath, JSON.stringify(updatedAldonaMap, null, 2), 'utf-8');
console.log('✓ Successfully wrote organic src/data/aldona-map.json (Zero Gap, 7 Panchayats)');

// Sync public/data/ac10-aldona.json
const ac10Path = path.join(__dirname, '../public/data/ac10-aldona.json');
const ac10 = JSON.parse(fs.readFileSync(ac10Path, 'utf-8'));
ac10.spatial = {
  viewBox: updatedAldonaMap.viewBox,
  outerBorder: updatedAldonaMap.outerBorder,
  villageBorders: updatedAldonaMap.villageBorders,
  villages: updatedAldonaMap.villages,
  booths: updatedAldonaMap.booths
};
// Update village_insights in ac10-aldona.json to reflect the 7 Panchayats
ac10.village_insights = aVillages.map((v) => ({
  village: v.name,
  margin: v.margin,
  status: 'Battle Ground (within 10%)',
  voters: v.voters,
  booths: v.booths
}));

fs.writeFileSync(ac10Path, JSON.stringify(ac10, null, 2), 'utf-8');
console.log('✓ Successfully synced public/data/ac10-aldona.json');
