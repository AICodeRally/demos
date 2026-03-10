'use client';

import { useEffect, useRef } from 'react';
import { ROUTE_STOPS, STOP_TYPE_COLORS } from '@/data/proofline-route/route-data';

interface RouteMapProps {
  activeStopIndex: number;
  onStopClick: (index: number) => void;
}

export function RouteMap({ activeStopIndex, onStopClick }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);
  const leafletRef = useRef<typeof import('leaflet') | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let cancelled = false;

    async function init() {
      const L = await import('leaflet');
      // Load leaflet CSS via link tag (dynamic import of CSS not supported in static export)
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (cancelled || !mapRef.current) return;
      leafletRef.current = L;

      const bounds = L.latLngBounds(
        ROUTE_STOPS.map((s) => [s.lat, s.lng] as [number, number])
      );

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
        minZoom: 11,
      }).addTo(map);

      map.fitBounds(bounds.pad(0.15));

      const routeCoords = ROUTE_STOPS.map((s) => [s.lat, s.lng] as [number, number]);
      L.polyline(routeCoords, {
        color: '#C6A052',
        weight: 3,
        opacity: 0.6,
        dashArray: '8 6',
      }).addTo(map);

      ROUTE_STOPS.forEach((stop, i) => {
        const isActive = i === activeStopIndex;
        const color = STOP_TYPE_COLORS[stop.type];

        const marker = L.circleMarker([stop.lat, stop.lng], {
          radius: isActive ? 14 : 10,
          fillColor: isActive ? '#C6A052' : color,
          fillOpacity: 1,
          color: isActive ? '#C6A052' : '#fff',
          weight: isActive ? 3 : 2,
        }).addTo(map);

        const icon = L.divIcon({
          className: 'route-stop-label',
          html: `<span style="
            display:flex;align-items:center;justify-content:center;
            width:${isActive ? 28 : 20}px;height:${isActive ? 28 : 20}px;
            border-radius:50%;
            background:${isActive ? '#C6A052' : color};
            color:${isActive ? '#0a0f1e' : '#fff'};
            font-size:${isActive ? 13 : 11}px;font-weight:900;
            border:${isActive ? '3px solid rgba(198,160,82,0.4)' : '2px solid rgba(255,255,255,0.8)'};
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
          ">${stop.sequence}</span>`,
          iconSize: [isActive ? 28 : 20, isActive ? 28 : 20],
          iconAnchor: [isActive ? 14 : 10, isActive ? 14 : 10],
        });

        const labelMarker = L.marker([stop.lat, stop.lng], { icon }).addTo(map);

        if (isActive) {
          labelMarker.bindTooltip(stop.accountName, {
            permanent: true,
            direction: 'right',
            offset: [16, 0],
            className: 'route-stop-tooltip',
          });
        }

        marker.on('click', () => onStopClick(i));
        labelMarker.on('click', () => onStopClick(i));
      });

      mapInstance.current = map;
    }

    init();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        (mapInstance.current as { remove: () => void }).remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapInstance.current as import('leaflet').Map | null;
    const L = leafletRef.current;
    if (!map || !L) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker || layer instanceof L.Marker) {
        if (!(layer instanceof L.TileLayer)) {
          map.removeLayer(layer);
        }
      }
    });

    const routeCoords = ROUTE_STOPS.map((s) => [s.lat, s.lng] as [number, number]);
    L.polyline(routeCoords, {
      color: '#C6A052',
      weight: 3,
      opacity: 0.6,
      dashArray: '8 6',
    }).addTo(map);

    ROUTE_STOPS.forEach((stop, i) => {
      const isActive = i === activeStopIndex;
      const color = STOP_TYPE_COLORS[stop.type];

      L.circleMarker([stop.lat, stop.lng], {
        radius: isActive ? 14 : 10,
        fillColor: isActive ? '#C6A052' : color,
        fillOpacity: 1,
        color: isActive ? '#C6A052' : '#fff',
        weight: isActive ? 3 : 2,
      }).addTo(map).on('click', () => onStopClick(i));

      const icon = L.divIcon({
        className: 'route-stop-label',
        html: `<span style="
          display:flex;align-items:center;justify-content:center;
          width:${isActive ? 28 : 20}px;height:${isActive ? 28 : 20}px;
          border-radius:50%;
          background:${isActive ? '#C6A052' : color};
          color:${isActive ? '#0a0f1e' : '#fff'};
          font-size:${isActive ? 13 : 11}px;font-weight:900;
          border:${isActive ? '3px solid rgba(198,160,82,0.4)' : '2px solid rgba(255,255,255,0.8)'};
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
        ">${stop.sequence}</span>`,
        iconSize: [isActive ? 28 : 20, isActive ? 28 : 20],
        iconAnchor: [isActive ? 14 : 10, isActive ? 14 : 10],
      });

      const labelMarker = L.marker([stop.lat, stop.lng], { icon }).addTo(map);
      labelMarker.on('click', () => onStopClick(i));

      if (isActive) {
        labelMarker.bindTooltip(stop.accountName, {
          permanent: true,
          direction: 'right',
          offset: [16, 0],
          className: 'route-stop-tooltip',
        });

        map.panTo([stop.lat, stop.lng], { animate: true, duration: 0.5 });
      }
    });
  }, [activeStopIndex, onStopClick]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-2 pt-1.5 pb-0.5 flex-shrink-0">
        <h3 className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>
          Route Map — Dallas
        </h3>
      </div>
      <div ref={mapRef} className="flex-1 min-h-0" />
    </div>
  );
}
