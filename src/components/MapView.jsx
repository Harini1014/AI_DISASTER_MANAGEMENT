// src/components/MapView.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue in React-Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapView = ({ darkMode, selectedQuakeId, onQuakeSelect, selectedDisasterId, onDisasterSelect, activeTab }) => {
  const [quakes, setQuakes] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuakes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      );
      setQuakes(res.data.features || []);
    } catch (err) {
      setError("Failed to fetch earthquake data. Please try again.");
      console.error("Error fetching earthquake data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("https://eonet.gsfc.nasa.gov/api/v3/events");
      setDisasters(res.data.events || []);
    } catch (err) {
      setError("Failed to fetch disaster data. Please try again.");
      console.error("Error fetching disaster data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'earthquakes') {
      fetchQuakes();
      const interval = setInterval(fetchQuakes, 60000);
      return () => clearInterval(interval);
    } else {
      fetchDisasters();
      const interval = setInterval(fetchDisasters, 120000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const getQuakeIcon = (magnitude) => {
    return new L.Icon({
      iconUrl:
        magnitude >= 5
          ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
          : magnitude >= 3
          ? "https://maps.google.com/mapfiles/ms/icons/orange-dot.png"
          : "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: markerShadow,
    });
  };

  const getDisasterIcon = (categoryId) => {
    const colors = {
      wildfires: "red",
      severeStorms: "purple",
      volcanoes: "red",
      floods: "blue",
      drought: "yellow",
      dustHaze: "grey",
      seaLakeIce: "lightblue",
    };
    const color = colors[categoryId] || "pink";
    return new L.Icon({
      iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: markerShadow,
    });
  };

  if (loading && quakes.length === 0 && disasters.length === 0) {
    return (
      <div className={`p-6 rounded-lg shadow-lg h-[700px] flex items-center justify-center ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-lg shadow-lg h-[700px] ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className={`text-xl font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Error Loading Map</h3>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
            <button
              onClick={activeTab === 'earthquakes' ? fetchQuakes : fetchDisasters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg shadow-lg ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className={`text-2xl font-bold flex items-center ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          🗺️ {activeTab === 'earthquakes' ? 'Earthquake Map' : 'Disaster Map'}
          <span className={`ml-2 text-sm font-normal ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            (Live Updates)
          </span>
        </h2>
        {loading && (activeTab === 'earthquakes' ? quakes.length > 0 : disasters.length > 0) && (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        )}
      </div>
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          className="h-64 sm:h-80 md:h-96 lg:h-[600px] w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {activeTab === 'earthquakes' ? (
            // Render Earthquakes
            quakes.map((f, idx) => {
              const [lon, lat] = f.geometry.coordinates;
              return (
                <React.Fragment key={idx}>
                  {/* Circle to highlight earthquake */}
                  <Circle
                    center={[lat, lon]}
                    radius={f.properties.mag * 20000}
                    color={f.properties.mag >= 5 ? "red" : "orange"}
                    fillOpacity={0.3}
                  />
                {/* Marker */}
                <Marker
                  position={[lat, lon]}
                  icon={getQuakeIcon(f.properties.mag)}
                  eventHandlers={{
                    click: () => {
                      onQuakeSelect(f.id);
                    }
                  }}
                >
                  <Popup>
                    {f.properties.tsunami === 1 && (
                      <div style={{
                        background: "#dc2626",
                        color: "white",
                        padding: "8px",
                        marginBottom: "8px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        textAlign: "center"
                      }}>
                        🌊 TSUNAMI WARNING
                      </div>
                    )}
                    <h3
                      style={{
                        color: f.properties.mag >= 5 ? "red" : "orange",
                      }}
                    >
                      🌎 Earthquake Alert
                    </h3>
                    Magnitude: {f.properties.mag}
                    <br />
                    Location: {f.properties.place}
                    <br />
                    Time: {new Date(f.properties.time).toUTCString()}
                    <br />
                    Depth: {f.geometry.coordinates[2].toFixed(1)} km
                    <br />
                    {f.properties.felt && (
                      <>
                        Felt Reports: {f.properties.felt} people
                        <br />
                      </>
                    )}
                    Tsunami Risk: {f.properties.tsunami === 1 ? "⚠️ YES" : "✓ No"}
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })
          ) : (
            // Render Other Disasters
            disasters.map((d, idx) => {
              if (!d.geometry || d.geometry.length === 0) return null;
              const coords = d.geometry[0].coordinates;
              const [lon, lat] = coords;
              const categoryId = d.categories[0]?.id || 'unknown';
              
              return (
                <Marker
                  key={idx}
                  position={[lat, lon]}
                  icon={getDisasterIcon(categoryId)}
                  eventHandlers={{
                    click: () => {
                      onDisasterSelect(d.id);
                    }
                  }}
                >
                  <Popup>
                    <h3 style={{ color: "#dc2626", fontWeight: "bold" }}>
                      {d.categories[0]?.title || "Natural Disaster"}
                    </h3>
                    <strong>{d.title}</strong>
                    <br />
                    Date: {new Date(d.geometry[0].date).toLocaleString()}
                    <br />
                    Status: {d.closed ? "Closed" : "🔴 Active"}
                    <br />
                    {d.description && (
                      <>
                        Description: {d.description}
                        <br />
                      </>
                    )}
                  </Popup>
                </Marker>
              );
            })
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
