export {};

/**
 * Minimal type declarations for the Tencent Map JavaScript API GL (TMap).
 *
 * These declarations only cover the subset of the API used by the admin
 * `FieldMap` component. They are intentionally lightweight because Tencent
 * does not ship an official TypeScript package for the browser SDK.
 */

declare global {
  namespace TMap {
    class LatLng {
      constructor(lat: number, lng: number);
      lat: number;
      lng: number;
    }

    interface MapOptions {
      center: LatLng;
      zoom?: number;
    }

    interface MapClickEvent {
      latLng: LatLng;
    }

    interface TencentMap {
      on(event: 'click', listener: (event: MapClickEvent) => void): void;
      off(event: 'click', listener: (event: MapClickEvent) => void): void;
      destroy(): void;
      setCenter(center: LatLng): void;
      getCenter(): LatLng;
    }

    interface TencentMapConstructor {
      new (container: string | HTMLElement, options: MapOptions): TencentMap;
    }

    interface MarkerStyleOptions {
      width: number;
      height: number;
      anchor: { x: number; y: number };
    }

    class MarkerStyle {
      constructor(options: MarkerStyleOptions);
    }

    interface MarkerGeometry {
      id: string;
      styleId: string;
      position: LatLng;
    }

    interface MultiMarkerOptions {
      map: TencentMap;
      styles: Record<string, MarkerStyle>;
      geometries: MarkerGeometry[];
    }

    interface MultiMarker {
      setGeometries(geometries: MarkerGeometry[]): void;
    }

    interface MultiMarkerConstructor {
      new (options: MultiMarkerOptions): MultiMarker;
    }
  }

  interface Window {
    TMap?: typeof TMap & {
      Map: TMap.TencentMapConstructor;
      MultiMarker: TMap.MultiMarkerConstructor;
    };
  }
}
