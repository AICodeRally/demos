'use client';

import { useEffect, useRef } from 'react';

// DO NOT import leaflet at top level — it accesses `window` and breaks SSR.
// Leaflet is dynamically imported inside useEffect below.

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: number;
  accounts: number;
  attainment: number;
  isNewAcquisition?: boolean;
}

export interface MapConnection {
  from: [number, number];
  to: [number, number];
}

interface TexasMapProps {
  markers: MapMarker[];
  connections?: MapConnection[];
  height?: number;
  onMarkerClick?: (id: string) => void;
  interactive?: boolean;
  isDark?: boolean;
}

const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';
const TEXAS_CENTER: [number, number] = [31.0, -98.5];
const TEXAS_ZOOM = 6;
const GOLD = '#C6A052';

export function TexasMap({
  markers,
  connections = [],
  height = 400,
  onMarkerClick,
  interactive = true,
  isDark = true,
}: TexasMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      // @ts-expect-error -- CSS module import handled by Next.js bundler
      await import('leaflet/dist/leaflet.css');
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: TEXAS_CENTER,
        zoom: TEXAS_ZOOM,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: interactive,
        attributionControl: true,
      });

      L.tileLayer(isDark ? DARK_TILES : LIGHT_TILES, { attribution: ATTRIBUTION }).addTo(map);

      // Connection lines (dashed gold)
      connections.forEach(({ from, to }) => {
        L.polyline([from, to], {
          color: GOLD,
          weight: 1.5,
          dashArray: '6 4',
          opacity: 0.5,
        }).addTo(map);
      });

      // Territory radius circles
      markers.forEach((m) => {
        const color = m.attainment >= 1.0 ? '#22c55e' : m.attainment >= 0.95 ? '#f59e0b' : '#ef4444';
        L.circle([m.lat, m.lng], {
          radius: m.routes * 8000,
          color,
          fillColor: color,
          fillOpacity: 0.08,
          weight: 1,
          opacity: 0.3,
        }).addTo(map);
      });

      // Hometown markers
      markers.forEach((m) => {
        const size = 10 + m.routes * 2;
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width: ${size}px; height: ${size}px;
            background: ${GOLD};
            border: 2px solid #fff;
            border-radius: 50%;
            box-shadow: 0 0 12px rgba(198, 160, 82, 0.5);
            ${m.isNewAcquisition ? 'animation: pulse-ring 2s ease-out infinite;' : ''}
          "></div>
          ${m.isNewAcquisition ? `<div style="
            position: absolute; top: -4px; left: -4px;
            width: ${size + 8}px; height: ${size + 8}px;
            border: 2px solid ${GOLD};
            border-radius: 50%;
            animation: pulse-ring 2s ease-out infinite;
            opacity: 0;
          "></div>` : ''}`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);

        marker.bindTooltip(
          `<div style="font-family: ui-monospace, monospace; font-size: 11px; line-height: 1.4;">
            <strong style="color: ${GOLD};">${m.name}</strong><br/>
            ${m.routes} routes &middot; ${m.accounts.toLocaleString()} accounts<br/>
            Attainment: <strong>${(m.attainment * 100).toFixed(0)}%</strong>
            ${m.isNewAcquisition ? '<br/><span style="color: #f59e0b;">&#9733; NEW ACQUISITION</span>' : ''}
          </div>`,
          {
            direction: 'top',
            offset: [0, -size / 2 - 4],
            className: 'proofline-map-tooltip',
          }
        );

        if (onMarkerClick) {
          marker.on('click', () => onMarkerClick(m.id));
        }
      });

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [markers, connections, interactive, isDark, onMarkerClick]);

  return (
    <div
      ref={containerRef}
      style={{
        height,
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid var(--pl-border)',
      }}
    />
  );
}
