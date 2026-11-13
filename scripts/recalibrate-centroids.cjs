const fs = require('fs');

function parseSvgPath(d) {
  const points = [];
  const parts = d.match(/[MLZ][^MLZ]*/g) || [];
  for (const part of parts) {
    const coords = part.slice(1).trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    for (let i = 0; i < coords.length; i += 2) {
      if (coords[i] !== undefined && coords[i+1] !== undefined) {
        points.push([coords[i], coords[i+1]]);
      }
    }
  }
  return points;
}

function polygonCentroid(pts) {
  let area = 0, cx = 0, cy = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[j];
    const a = x0 * y1 - x1 * y0;
    area += a;
    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;
  }
  area *= 0.5;
  if (Math.abs(area) < 1e-5) {
    const avgX = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const avgY = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    return [Math.round(avgX), Math.round(avgY)];
  }
  return [Math.round(cx / (6 * area)), Math.round(cy / (6 * area))];
}

function pointInPolygon(pt, pts) {
  const [x, y] = pt;
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function findInteriorPoint(pts) {
  const [cx, cy] = polygonCentroid(pts);
  if (pointInPolygon([cx, cy], pts)) {
    return [cx, cy];
  }
  // If centroid falls outside (e.g. C-shaped polygon), sample triangles or average of interior grid
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y] of pts) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  for (let step = 0.1; step <= 0.9; step += 0.05) {
    for (let stepY = 0.1; stepY <= 0.9; stepY += 0.05) {
      const tx = Math.round(minX + (maxX - minX) * step);
      const ty = Math.round(minY + (maxY - minY) * stepY);
      if (pointInPolygon([tx, ty], pts)) {
        return [tx, ty];
      }
    }
  }
  return [cx, cy];
}

function updateMapFile(filePath) {
  console.log('Recalibrating centroids for:', filePath);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updatedCount = 0;

  if (data.booths) {
    for (const b of data.booths) {
      if (b.path) {
        const pts = parseSvgPath(b.path);
        const [newCx, newCy] = findInteriorPoint(pts);
        if (b.cx !== newCx || b.cy !== newCy) {
          b.cx = newCx;
          b.cy = newCy;
          updatedCount++;
        }
      }
    }
  }

  if (data.spatial && data.spatial.booths) {
    for (const b of data.spatial.booths) {
      if (b.path) {
        const pts = parseSvgPath(b.path);
        const [newCx, newCy] = findInteriorPoint(pts);
        if (b.cx !== newCx || b.cy !== newCy) {
          b.cx = newCx;
          b.cy = newCy;
          updatedCount++;
        }
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${updatedCount} booth centroids in ${filePath}`);
}

updateMapFile('./src/data/porvorim-map.json');
updateMapFile('./public/data/ac09-porvorim.json');
updateMapFile('./src/data/aldona-map.json');
updateMapFile('./public/data/ac10-aldona.json');
