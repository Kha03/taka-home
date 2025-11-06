"use client";

import { MapPin } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useEffect, useRef } from "react";

// Define the props interface
interface MapLocationProps {
  mapLocation: string; // Format: 'latitude,longitude' e.g., '10.7769,106.7009'
}

// Define VietMap types
interface VietMapGL {
  Map: new (options: {
    container: HTMLElement | string;
    style: string;
    center: [number, number];
    zoom: number;
    scrollZoom?: boolean;
    boxZoom?: boolean;
    doubleClickZoom?: boolean;
    touchZoomRotate?: boolean;
  }) => VietMapInstance;
  Marker: new (options: { color: string; draggable: boolean }) => VietMapMarker;
  Popup: new (options: { offset: number }) => VietMapPopup;
  NavigationControl: new () => VietMapControl;
}

interface VietMapInstance {
  on: (event: string, callback: (e?: unknown) => void) => void;
  remove: () => void;
  addControl: (control: VietMapControl, position?: string) => void;
}

interface VietMapMarker {
  setLngLat: (coordinates: [number, number]) => VietMapMarker;
  setPopup: (popup: VietMapPopup) => VietMapMarker;
  addTo: (map: VietMapInstance) => VietMapMarker;
}

interface VietMapPopup {
  setHTML: (html: string) => VietMapPopup;
}

interface VietMapControl {
  // Navigation control interface
  onAdd?: (map: VietMapInstance) => HTMLElement;
  onRemove?: () => void;
}

// Extend the Window interface to include vietmapgl
declare global {
  interface Window {
    vietmapgl: VietMapGL;
  }
}

export default function MapLocation({ mapLocation }: MapLocationProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<VietMapInstance | null>(null);

  useEffect(() => {
    // Parse the coordinates from the mapLocation string
    if (!mapLocation || !mapContainer.current) return;
    
    const [latitude, longitude] = mapLocation.split(',').map(coord => parseFloat(coord.trim()));
    
    if (isNaN(latitude) || isNaN(longitude)) {
      console.error('Invalid coordinates format. Expected: "latitude,longitude"');
      return;
    }

    // Convert to [longitude, latitude] format for VietMap
    const coordinates: [number, number] = [longitude, latitude];

    // Function to initialize the map
    const initializeMap = () => {
      if (!window.vietmapgl) {
        console.error('VietMap GL JS library not loaded');
        return;
      }

      // Get API key from environment variable
      const apiKey = process.env.NEXT_PUBLIC_VIETMAP_API_KEY;
      
      if (!apiKey) {
        console.error('VietMap API key not found in environment variables');
        return;
      }

      // Destroy existing map if it exists
      if (mapRef.current) {
        mapRef.current.remove();
      }

      // Initialize VietMap
      const map = new window.vietmapgl.Map({
        container: mapContainer.current!,
        style: `https://maps.vietmap.vn/mt/tm/style.json?apikey=${apiKey}`,
        center: coordinates,
        zoom: 15,
        // Enable zoom controls
        scrollZoom: true,
        boxZoom: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
      });

      mapRef.current = map;

      // Add marker when map is loaded
      map.on('load', () => {
        console.log('VietMap loaded successfully!');
        
        // Add navigation controls (zoom in/out buttons)
        const nav = new window.vietmapgl.NavigationControl();
        map.addControl(nav, 'top-right');
        
        // Create a popup for the marker
        const popup = new window.vietmapgl.Popup({ offset: 25 })
          .setHTML('<h3>Vị trí bất động sản</h3><p>Đây là vị trí của bất động sản.</p>');

        // Create and add marker
        new window.vietmapgl.Marker({
          color: "#ef4444", // Red color for the marker
          draggable: false
        })
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map);
      });

      // Handle map errors
      map.on('error', (e: unknown) => {
        console.error('VietMap error:', e);
      });
    };

    // Load VietMap GL JS library if not already loaded
    if (!window.vietmapgl) {
      // Load CSS
      const cssLink = document.createElement('link');
      cssLink.href = 'https://maps.vietmap.vn/sdk/vietmap-gl/1.15.3/vietmap-gl.css';
      cssLink.rel = 'stylesheet';
      document.head.appendChild(cssLink);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://maps.vietmap.vn/sdk/vietmap-gl/1.15.3/vietmap-gl.js';
      script.onload = initializeMap;
      script.onerror = () => {
        console.error('Failed to load VietMap GL JS library');
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapLocation]);

  return (
    <Card className="shadow-none bg-background border-0 p-4 rounded-[12px]">
      <CardContent className="p-0">
        <div className="font-bold text-primary mb-4 flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center bg-[#D9D9D9] rounded-full">
            <MapPin className="h-3 w-3 text-primary" />
          </div>
          Vị trí bất động sản trên bản đồ
        </div>
        <div 
          ref={mapContainer}
          className="w-full h-[400px] rounded-lg overflow-hidden relative bg-gray-200"
        />
      </CardContent>
    </Card>
  );
}
