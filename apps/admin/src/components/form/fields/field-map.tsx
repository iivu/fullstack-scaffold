import { isNumberInRange, toFixed } from '@r/common-utils';
import { Badge } from '@r/ui';
import { MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useFieldContext } from '../context';
import { FieldBase, type FieldBaseProps } from './field-base';

export type LatLngValue = [latitude: number, longitude: number];

export const DEFAULT_CENTER: LatLngValue = [39.9042, 116.4074];
const TMAP_SCRIPT_ID = 'tencent-map-sdk';
const TMAP_SCRIPT_URL = 'https://map.qq.com/api/gljs';
const MARKER_STYLE_ID = 'field-map-marker';
const MARKER_GEOMETRY_ID = 'field-map-geometry';

const loadPromises = new Map<string, Promise<void>>();

function buildTencentMapScriptUrl(key: string): string {
  const params = new URLSearchParams({
    v: '1.exp',
    key,
  });
  return `${TMAP_SCRIPT_URL}?${params.toString()}`;
}

function appendTencentMapScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(TMAP_SCRIPT_ID);
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.id = TMAP_SCRIPT_ID;
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;

    script.onload = () => {
      if (typeof window.TMap !== 'undefined') {
        resolve();
      } else {
        reject(new Error('Tencent Map SDK loaded but TMap is not available'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Tencent Map SDK'));
    };

    document.head.appendChild(script);
  });
}

function resolveMapKey(mapKey?: string): string {
  const envKey = import.meta.env.VITE_TENCENT_MAP_KEY;
  if (typeof mapKey === 'string' && mapKey.length > 0) {
    return mapKey;
  }
  if (typeof envKey === 'string' && envKey.length > 0) {
    return envKey;
  }
  return '';
}

function loadTencentMapSdk(mapKey?: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Tencent Map SDK can only be loaded in the browser'));
  }

  if (typeof window.TMap !== 'undefined') {
    return Promise.resolve();
  }

  const key = resolveMapKey(mapKey);
  if (key.length === 0) {
    return Promise.reject(new Error('Missing Tencent Map API key'));
  }

  let promise = loadPromises.get(key);
  if (!promise) {
    promise = appendTencentMapScript(buildTencentMapScriptUrl(key)).catch((error) => {
      loadPromises.delete(key);
      throw error;
    });
    loadPromises.set(key, promise);
  }

  return promise;
}

type Props = FieldBaseProps & {
  /** Tencent Map API key. Falls back to `VITE_TENCENT_MAP_KEY` env variable. */
  mapKey?: string;
};

function isValidLatLngValue(value: unknown): value is LatLngValue {
  return Array.isArray(value) && isNumberInRange(value[0], -90, 90) && isNumberInRange(value[1], -180, 180);
}

function formatCoordinate(value: LatLngValue): string {
  return `纬度 - ${value[0].toFixed(6)}, 经度 - ${value[1].toFixed(6)}`;
}

function buildMarkerGeometry(value: LatLngValue): TMap.MarkerGeometry {
  return {
    id: MARKER_GEOMETRY_ID,
    styleId: MARKER_STYLE_ID,
    position: new window.TMap.LatLng(value[0], value[1]),
  };
}

function MapLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="absolute inset-0 h-full w-full animate-pulse rounded-none bg-primary/10" />
      <div className="relative z-10 flex flex-col items-center gap-1 text-muted-foreground">
        <MapPin className="h-5 w-5" />
        <span className="text-sm">地图加载中…</span>
      </div>
    </div>
  );
}

function MapLoadError({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-destructive">
      <MapPin className="h-5 w-5" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

export function FieldMap({ mapKey, ...baseProps }: Props) {
  const field = useFieldContext<LatLngValue | null | undefined>();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<TMap.TencentMap | null>(null);
  const markerLayerRef = useRef<TMap.MultiMarker | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const selectedValue = isValidLatLngValue(field.state.value) ? field.state.value : null;

  // Initialize the map once on mount (or when mapKey changes). The initial
  // center is derived from the current form value; subsequent value changes are
  // handled by a separate effect so the map instance is not recreated on click.
  useEffect(() => {
    let isCancelled = false;
    const container = containerRef.current;
    if (!container) return undefined;

    setLoading(true);
    setLoadError(null);

    loadTencentMapSdk(mapKey)
      .then(() => {
        if (isCancelled || !containerRef.current) return;

        const initialValue = isValidLatLngValue(field.state.value) ? field.state.value : null;
        const centerValue = initialValue ?? DEFAULT_CENTER;
        const center = new window.TMap.LatLng(centerValue[0], centerValue[1]);

        const map = new window.TMap.Map(container, {
          center,
          zoom: 15,
        });
        mapRef.current = map;

        const markerLayer = new window.TMap.MultiMarker({
          map,
          styles: {
            [MARKER_STYLE_ID]: new window.TMap.MarkerStyle({
              width: 25,
              height: 35,
              anchor: { x: 12, y: 34 },
            }),
          },
          geometries: initialValue ? [buildMarkerGeometry(initialValue)] : [],
        });
        markerLayerRef.current = markerLayer;

        const handleClick = (event: TMap.MapClickEvent) => {
          const lat = toFixed(event.latLng.lat);
          const lng = toFixed(event.latLng.lng);
          const nextValue: LatLngValue = [lat, lng];
          if (isValidLatLngValue(nextValue)) {
            field.handleChange(nextValue);
          }
        };

        map.on('click', handleClick);

        const resizeObserver = new ResizeObserver(() => {
          const center = map.getCenter();
          map.setCenter(center);
        });
        resizeObserver.observe(container);
        resizeObserverRef.current = resizeObserver;

        setLoading(false);
      })
      .catch((error) => {
        if (isCancelled) return;
        setLoadError(error instanceof Error ? error.message : '地图加载失败');
        setLoading(false);
      });

    return () => {
      isCancelled = true;
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      mapRef.current?.destroy();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
    // The field reference is stable in TanStack Form. Value sync is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapKey]);

  // Keep the marker in sync with form value changes that come from outside the
  // component (e.g. form reset or default value updates). The map center stays
  // where the user left it so panning/zooming is not disrupted by clicks.
  useEffect(() => {
    const markerLayer = markerLayerRef.current;
    if (!markerLayer) return;

    const value = isValidLatLngValue(field.state.value) ? field.state.value : null;
    markerLayer.setGeometries(value ? [buildMarkerGeometry(value)] : []);
  }, [field.state.value]);

  return (
    <FieldBase {...baseProps} labelEnd={selectedValue ? <Badge variant="outline">{formatCoordinate(selectedValue)}</Badge> : null}>
      <div ref={containerRef} id={field.name} className="relative h-80 w-full overflow-hidden rounded-md border bg-muted">
        {loading ? <MapLoading /> : null}
        {loadError ? <MapLoadError message={loadError} /> : null}
      </div>
    </FieldBase>
  );
}
