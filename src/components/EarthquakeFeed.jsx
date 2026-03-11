// src/components/EarthquakeFeed.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const EarthquakeFeed = ({ darkMode, selectedQuakeId, onQuakeSelect }) => {
  const [quakes, setQuakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMagnitude, setFilterMagnitude] = useState(0);
  const [filterRegion, setFilterRegion] = useState("");
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      );
      setQuakes(res.data.features);
    } catch (err) {
      setError("Failed to fetch earthquake data. Please try again.");
      console.error("Error fetching earthquake data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  // Filter earthquakes
  const filteredQuakes = quakes.filter((q) => {
    const magFilter = q.properties.mag >= filterMagnitude;
    const regionFilter = filterRegion === "" || 
      q.properties.place.toLowerCase().includes(filterRegion.toLowerCase());
    return magFilter && regionFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredQuakes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuakes = filteredQuakes.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterMagnitude, filterRegion]);

  // Scroll to selected earthquake
  useEffect(() => {
    if (selectedQuakeId) {
      const element = document.getElementById(`quake-${selectedQuakeId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Flash animation
        element.classList.add('ring-4', 'ring-blue-500');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-blue-500');
        }, 2000);
      }
    }
  }, [selectedQuakeId]);

  // Export functions
  const exportToCSV = () => {
    const headers = ["Time", "Location", "Magnitude", "Depth (km)", "Felt Reports", "Tsunami Warning", "Latitude", "Longitude"];
    const csvData = filteredQuakes.map(q => [
      new Date(q.properties.time).toLocaleString(),
      q.properties.place,
      q.properties.mag,
      q.geometry.coordinates[2].toFixed(1),
      q.properties.felt || "N/A",
      q.properties.tsunami === 1 ? "YES" : "No",
      q.geometry.coordinates[1].toFixed(4),
      q.geometry.coordinates[0].toFixed(4)
    ]);

    const csv = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earthquakes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonData = filteredQuakes.map(q => ({
      time: new Date(q.properties.time).toISOString(),
      location: q.properties.place,
      magnitude: q.properties.mag,
      depth_km: q.geometry.coordinates[2],
      felt_reports: q.properties.felt || null,
      tsunami_warning: q.properties.tsunami === 1,
      coordinates: {
        latitude: q.geometry.coordinates[1],
        longitude: q.geometry.coordinates[0]
      }
    }));

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earthquakes_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && quakes.length === 0) {
    return (
      <div className={`p-6 rounded-lg shadow-lg max-h-[600px] flex items-center justify-center ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading earthquake data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-lg shadow-lg max-h-[600px] ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center py-12">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Error Loading Data
          </h3>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-6 rounded-lg shadow-lg max-h-[500px] sm:max-h-[600px] overflow-y-auto ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className={`text-xl sm:text-2xl font-bold flex items-center ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          🌍 Recent Earthquakes
          <span className={`ml-2 text-xs sm:text-sm font-normal ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>(Last 24h)</span>
        </h2>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {loading && quakes.length > 0 && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          )}
          <button
            onClick={exportToCSV}
            className="px-2 sm:px-3 py-1.5 bg-green-600 text-white text-xs sm:text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
            title="Export to CSV"
          >
            📊 <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={exportToJSON}
            className="px-2 sm:px-3 py-1.5 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
            title="Export to JSON"
          >
            📄 <span className="hidden sm:inline">JSON</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`mb-4 space-y-3 pb-4 border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Minimum Magnitude
            </label>
            <select
              value={filterMagnitude}
              onChange={(e) => setFilterMagnitude(Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            >
              <option value={0}>All Magnitudes</option>
              <option value={2}>2.0+</option>
              <option value={3}>3.0+</option>
              <option value={4}>4.0+</option>
              <option value={5}>5.0+ (Major)</option>
              <option value={6}>6.0+ (Strong)</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Filter by Region
            </label>
            <input
              type="text"
              placeholder="Enter location..."
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
              }`}
            />
          </div>
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {currentQuakes.length} of {filteredQuakes.length} earthquakes
        </div>
      </div>

      {/* Earthquake List */}
      <div className="space-y-3 mb-4">
        {currentQuakes.length > 0 ? (
          currentQuakes.map((q) => (
            <div
              id={`quake-${q.id}`}
              key={q.id}
              onClick={() => onQuakeSelect(q.id)}
              className={`p-4 rounded-lg transition-all cursor-pointer ${ 
                selectedQuakeId === q.id 
                  ? 'ring-4 ring-blue-500 scale-105' 
                  : ''
              } ${
                q.properties.tsunami === 1 
                  ? 'bg-red-50 border-2 border-red-300 dark:bg-red-900/30 dark:border-red-700' 
                  : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {q.properties.tsunami === 1 && (
                <div className="mb-2 flex items-center gap-2 text-red-600 font-bold animate-pulse">
                  <span className="text-2xl">🌊</span>
                  <span>TSUNAMI WARNING - Possible Tsunami Threat</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {q.properties.place}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(q.properties.time).toLocaleString()}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      📏 Depth: <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {q.geometry.coordinates[2].toFixed(1)} km
                      </span>
                    </span>
                    {q.properties.felt && (
                      <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>
                        👥 <span className="font-medium">{q.properties.felt} felt reports</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {q.properties.tsunami === 1 && (
                    <div className="px-2 py-1 bg-red-600 text-white rounded-full text-xs font-bold">
                      🌊 TSUNAMI
                    </div>
                  )}
                  <div className={`px-3 py-1 rounded-full font-medium ${
                    q.properties.mag >= 5 ? 'bg-red-100 text-red-800' :
                    q.properties.mag >= 4 ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    Mag: {q.properties.mag.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No earthquakes match your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-center gap-2 pt-4 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EarthquakeFeed;
