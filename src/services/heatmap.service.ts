// AI Heatmap Generator for FindTogether
// Generates realistic probability heatmaps for missing person cases

export interface HeatmapData {
  centerLat: number;
  centerLng: number;
  location: string;
  caseId: number;
  timeOfDisappearance?: string;
  age?: number;
  lastSeenTime?: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1
  reason: string;
}

// Generate heatmap points based on behavioral patterns and location analysis
export function generateHeatmapPoints(data: HeatmapData): HeatmapPoint[] {
  const points: HeatmapPoint[] = [];
  const { centerLat, centerLng, age = 25 } = data;
  
  // Base radius in km based on demographics and time
  const baseRadius = age < 18 ? 2 : age > 60 ? 3 : 5;
  const timeMultiplier = getTimeMultiplier(data.timeOfDisappearance);
  const radius = baseRadius * timeMultiplier;
  
  // High probability areas (concentric circles from last seen location)
  // Immediate area - highest probability
  points.push({
    lat: centerLat,
    lng: centerLng,
    intensity: 1.0,
    reason: 'Last seen location'
  });
  
  // Generate points in expanding circles
  for (let ring = 1; ring <= 5; ring++) {
    const ringRadius = (radius * ring) / 5;
    const intensity = Math.max(0.1, 1 - (ring * 0.18)); // Decreasing intensity
    const pointsInRing = ring * 8; // More points in outer rings
    
    for (let i = 0; i < pointsInRing; i++) {
      const angle = (2 * Math.PI * i) / pointsInRing;
      const distance = ringRadius + (Math.random() - 0.5) * 0.5; // Add some randomness
      
      const lat = centerLat + (distance * Math.cos(angle)) / 111.32; // 1 degree lat ≈ 111.32 km
      const lng = centerLng + (distance * Math.sin(angle)) / (111.32 * Math.cos(centerLat * Math.PI / 180));
      
      points.push({
        lat,
        lng,
        intensity: intensity * (0.8 + Math.random() * 0.4), // Add variance
        reason: ring <= 2 ? 'High probability search zone' : 'Extended search area'
      });
    }
  }
  
  // Add behavioral hotspots
  const behavioralPoints = generateBehavioralHotspots(data);
  points.push(...behavioralPoints);
  
  return points;
}

function getTimeMultiplier(timeOfDisappearance?: string): number {
  if (!timeOfDisappearance) return 1.5;
  
  const disappearanceDate = new Date(timeOfDisappearance);
  const now = new Date();
  const hoursElapsed = (now.getTime() - disappearanceDate.getTime()) / (1000 * 60 * 60);
  
  // Search area expands over time
  if (hoursElapsed < 24) return 1.0;      // First 24 hours - local area
  if (hoursElapsed < 72) return 1.5;      // First 3 days - expanded area
  if (hoursElapsed < 168) return 2.0;     // First week - wider search
  return 2.5; // Beyond a week - maximum expansion
}

function generateBehavioralHotspots(data: HeatmapData): HeatmapPoint[] {
  const points: HeatmapPoint[] = [];
  const { centerLat, centerLng, age = 25 } = data;
  
  // Different behavioral patterns based on age groups
  const patterns = getBehavioralPatterns(age);
  
  patterns.forEach(pattern => {
    // Generate 2-4 hotspots for each pattern
    const numHotspots = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numHotspots; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = pattern.distance + (Math.random() - 0.5) * 1;
      
      const lat = centerLat + (distance * Math.cos(angle)) / 111.32;
      const lng = centerLng + (distance * Math.sin(angle)) / (111.32 * Math.cos(centerLat * Math.PI / 180));
      
      points.push({
        lat,
        lng,
        intensity: pattern.intensity * (0.7 + Math.random() * 0.3),
        reason: pattern.reason
      });
    }
  });
  
  return points;
}

function getBehavioralPatterns(age: number) {
  if (age < 12) {
    return [
      { distance: 0.5, intensity: 0.9, reason: 'Playground/park areas' },
      { distance: 0.3, intensity: 0.8, reason: 'Nearby residential areas' },
      { distance: 0.8, intensity: 0.6, reason: 'School vicinity' }
    ];
  } else if (age < 18) {
    return [
      { distance: 1.5, intensity: 0.8, reason: 'Shopping centers/malls' },
      { distance: 2.0, intensity: 0.7, reason: 'Friends\' neighborhoods' },
      { distance: 1.0, intensity: 0.9, reason: 'School/college area' },
      { distance: 3.0, intensity: 0.6, reason: 'Entertainment districts' }
    ];
  } else if (age < 65) {
    return [
      { distance: 2.5, intensity: 0.8, reason: 'Workplace vicinity' },
      { distance: 4.0, intensity: 0.7, reason: 'Social/recreational areas' },
      { distance: 1.5, intensity: 0.9, reason: 'Regular commute routes' },
      { distance: 6.0, intensity: 0.5, reason: 'Extended travel routes' }
    ];
  } else {
    return [
      { distance: 1.0, intensity: 0.9, reason: 'Medical facilities' },
      { distance: 0.8, intensity: 0.8, reason: 'Familiar local areas' },
      { distance: 2.0, intensity: 0.6, reason: 'Public transportation hubs' },
      { distance: 1.5, intensity: 0.7, reason: 'Community centers' }
    ];
  }
}

// Generate SVG heatmap visualization
export function generateHeatmapSVG(points: HeatmapPoint[], width: number = 600, height: number = 400): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="heatpoint-high" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ff0000" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="#ff4500" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#ff6600" stop-opacity="0.2"/>
        </radialGradient>
        <radialGradient id="heatpoint-medium" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ff6600" stop-opacity="0.7"/>
          <stop offset="50%" stop-color="#ffaa00" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#ffdd00" stop-opacity="0.2"/>
        </radialGradient>
        <radialGradient id="heatpoint-low" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffdd00" stop-opacity="0.6"/>
          <stop offset="50%" stop-color="#88ff00" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#00ff88" stop-opacity="0.1"/>
        </radialGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="#f8fafc"/>
      
      <!-- Grid lines for reference -->
      ${generateGridLines(width, height)}
      
      <!-- Heatmap points -->
      ${points.map(point => {
        const x = Math.random() * (width - 60) + 30; // Random positioning for demo
        const y = Math.random() * (height - 60) + 30;
        const size = 20 + (point.intensity * 40); // Size based on intensity
        const gradient = point.intensity > 0.7 ? 'heatpoint-high' : 
                        point.intensity > 0.4 ? 'heatpoint-medium' : 'heatpoint-low';
        
        return `<circle cx="${x}" cy="${y}" r="${size}" fill="url(#${gradient})" opacity="${point.intensity}"/>`;
      }).join('')}
      
      <!-- Legend -->
      <g transform="translate(${width - 150}, 20)">
        <rect x="0" y="0" width="140" height="80" fill="white" stroke="#e5e7eb" rx="8"/>
        <text x="10" y="15" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151">Probability Scale</text>
        <circle cx="20" cy="30" r="8" fill="url(#heatpoint-high)"/>
        <text x="35" y="35" font-family="Arial, sans-serif" font-size="10" fill="#374151">High (70-100%)</text>
        <circle cx="20" cy="45" r="8" fill="url(#heatpoint-medium)"/>
        <text x="35" y="50" font-family="Arial, sans-serif" font-size="10" fill="#374151">Medium (40-70%)</text>
        <circle cx="20" cy="60" r="8" fill="url(#heatpoint-low)"/>
        <text x="35" y="65" font-family="Arial, sans-serif" font-size="10" fill="#374151">Low (10-40%)</text>
      </g>
      
      <!-- Center marker for last seen location -->
      <g transform="translate(${width/2}, ${height/2})">
        <circle cx="0" cy="0" r="8" fill="#dc2626" stroke="white" stroke-width="2"/>
        <text x="0" y="25" font-family="Arial, sans-serif" font-size="10" fill="#dc2626" text-anchor="middle" font-weight="bold">Last Seen</text>
      </g>
    </svg>
  `;
  
  return svg;
}

function generateGridLines(width: number, height: number): string {
  const lines = [];
  const gridSize = 50;
  
  // Vertical lines
  for (let x = gridSize; x < width; x += gridSize) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#e5e7eb" stroke-width="0.5" opacity="0.3"/>`);
  }
  
  // Horizontal lines
  for (let y = gridSize; y < height; y += gridSize) {
    lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#e5e7eb" stroke-width="0.5" opacity="0.3"/>`);
  }
  
  return lines.join('');
}

// Generate base64 data URL for the heatmap
export function generateHeatmapDataURL(data: HeatmapData): string {
  const points = generateHeatmapPoints(data);
  const svg = generateHeatmapSVG(points);
  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}
