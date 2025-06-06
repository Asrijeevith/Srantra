'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet with no SSR
const MapComponent = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Import Leaflet only on client side
    const L = require('leaflet');
    require('leaflet/dist/leaflet.css');

    if (!map) {
      const mapInstance = L.map('map').setView([51.505, -0.09], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      setMap(mapInstance);
    }

    // Cleanup function
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);

  return <div id="map" style={{ height: '400px', width: '100%' }} />;
};

// Export a dynamically loaded component with no SSR
export default dynamic(() => Promise.resolve(MapComponent), {
  ssr: false
}); 