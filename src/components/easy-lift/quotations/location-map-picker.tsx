"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { Loader2, LocateFixed, Search } from "lucide-react";
import type { GeoLocation } from "@/lib/quotations-store";

const TEHRAN: GeoLocation = { lat: 35.6892, lng: 51.389 };

export function LocationMapPicker({
  value,
  onChange,
  onAddressResolved,
}: {
  value?: GeoLocation;
  onChange: (loc: GeoLocation) => void;
  onAddressResolved?: (address: string) => void;
}) {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  // نگه‌داری آخرین callback ها بدون وابسته کردن افکت راه‌اندازی نقشه
  const onChangeRef = useRef(onChange);
  const onAddressRef = useRef(onAddressResolved);
  useEffect(() => {
    onChangeRef.current = onChange;
    onAddressRef.current = onAddressResolved;
  });

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const start = value ?? TEHRAN;
      const map = L.map(containerRef.current, {
        center: [start.lat, start.lng],
        zoom: value ? 16 : 12,
        zoomControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:26px;height:26px;transform:translate(-50%,-100%)">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="#059669" stroke="#fff" stroke-width="1.5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5" fill="#fff"/>
          </svg></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
      });

      function place(lat: number, lng: number) {
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
          markerRef.current.on("dragend", () => {
            const p = markerRef.current!.getLatLng();
            onChangeRef.current({ lat: p.lat, lng: p.lng });
            reverseGeocode(p.lat, p.lng);
          });
        }
      }

      async function reverseGeocode(lat: number, lng: number) {
        if (!onAddressRef.current) return;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`
          );
          const data = await res.json();
          if (data?.display_name) onAddressRef.current(data.display_name);
        } catch {
          /* بی‌صدا */
        }
      }

      if (value) place(value.lat, value.lng);

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng;
        place(lat, lng);
        onChangeRef.current({ lat, lng });
        reverseGeocode(lat, lng);
      });

      // ذخیره برای استفاده در جستجو
      (map as unknown as { _placeFn: typeof place })._placeFn = place;
      (map as unknown as { _geoFn: typeof reverseGeocode })._geoFn = reverseGeocode;

      setReady(true);
      setTimeout(() => map.invalidateSize(), 200);
    }

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || !mapRef.current) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=fa&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      if (data?.[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const map = mapRef.current as unknown as {
          _placeFn: (a: number, b: number) => void;
          _geoFn: (a: number, b: number) => void;
          setView: (c: [number, number], z: number) => void;
        };
        map.setView([lat, lng], 16);
        map._placeFn(lat, lng);
        onChangeRef.current({ lat, lng });
        if (data[0].display_name) onAddressRef.current?.(data[0].display_name);
      }
    } catch {
      /* بی‌صدا */
    } finally {
      setSearching(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      const map = mapRef.current as unknown as {
        _placeFn: (a: number, b: number) => void;
        _geoFn: (a: number, b: number) => void;
        setView: (c: [number, number], z: number) => void;
      };
      map.setView([lat, lng], 16);
      map._placeFn(lat, lng);
      onChangeRef.current({ lat, lng });
      map._geoFn(lat, lng);
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 p-2">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی آدرس روی نقشه…"
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pr-8 pl-2 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </form>
        <button
          type="button"
          onClick={useMyLocation}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          title="موقعیت من"
        >
          <LocateFixed className="size-3.5" />
          موقعیت من
        </button>
      </div>
      <div className="relative">
        <div ref={containerRef} className="h-56 w-full" dir="ltr" />
        {!ready && (
          <div className="absolute inset-0 grid place-items-center bg-slate-50 text-slate-400">
            <Loader2 className="size-5 animate-spin" />
          </div>
        )}
        {searching && (
          <div className="absolute right-2 top-2 z-[1000] inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-[10px] text-slate-500 shadow">
            <Loader2 className="size-3 animate-spin" /> در حال جستجو…
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] text-slate-500">
        <span>روی نقشه کلیک کنید تا موقعیت ساختمان مشخص شود</span>
        {value && (
          <span dir="ltr" className="font-mono">
            {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
          </span>
        )}
      </div>
    </div>
  );
}
