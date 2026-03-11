import React, { useEffect, useState } from "react";
import axios from "axios";

const DisasterFeed = ({ darkMode, selectedDisasterId, onDisasterSelect }) => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const [filterRegion, setFilterRegion] = useState("");
  const itemsPerPage = 10;

  const disasterTypes = {
    all: { label: "All Disasters", icon: "🌍", color: "blue" },
    wildfires: { label: "Wildfires", icon: "🔥", color: "orange" },
    severeStorms: { label: "Severe Storms", icon: "🌀", color: "purple" },
    volcanoes: { label: "Volcanoes", icon: "🌋", color: "red" },
    floods: { label: "Floods", icon: "🌊", color: "blue" },
    drought: { label: "Drought", icon: "☀️", color: "yellow" },
    dustHaze: { label: "Dust/Haze", icon: "💨", color: "gray" },
    seaLakeIce: { label: "Sea/Lake Ice", icon: "❄️", color: "cyan" },
  };

  const fetchData = async () => {
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
    fetchData();
    const interval = setInterval(fetchData, 120000); // refresh every 2 min
    return () => clearInterval(interval);
  }, []);

  // Filter disasters
  const filteredDisasters = disasters.filter((d) => {
    const typeFilter =
      filterType === "all" || d.categories[0]?.id === filterType;
    const regionFilter =
      filterRegion === "" ||
      d.title.toLowerCase().includes(filterRegion.toLowerCase());
    return typeFilter && regionFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDisasters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDisasters = filteredDisasters.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterRegion]);

  // Scroll to selected disaster
  useEffect(() => {
    if (selectedDisasterId) {
      const element = document.getElementById(`disaster-${selectedDisasterId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("ring-4", "ring-blue-500");
        setTimeout(() => {
          element.classList.remove("ring-4", "ring-blue-500");
        }, 2000);
      }
    }
  }, [selectedDisasterId]);

  // Export functions
  const exportToCSV = () => {
    const headers = ["Title", "Type", "Date", "Status", "Latitude", "Longitude"];
    const csvData = filteredDisasters.map((d) => [
      d.title,
      d.categories[0]?.title || "Unknown",
      d.geometry && d.geometry.length > 0
        ? new Date(d.geometry[0].date).toLocaleString()
        : "N/A",
      d.closed ? "Closed" : "Active",
      d.geometry && d.geometry.length > 0 ? d.geometry[0].coordinates[1] : "N/A",
      d.geometry && d.geometry.length > 0 ? d.geometry[0].coordinates[0] : "N/A",
    ]);

    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `disasters_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonData = filteredDisasters.map((d) => ({
      title: d.title,
      type: d.categories[0]?.title || "Unknown",
      date:
        d.geometry && d.geometry.length > 0 ? d.geometry[0].date : null,
      status: d.closed ? "Closed" : "Active",
      coordinates:
        d.geometry && d.geometry.length > 0
          ? {
              latitude: d.geometry[0].coordinates[1],
              longitude: d.geometry[0].coordinates[0],
            }
          : null,
      link: d.link,
    }));

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `disasters_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDisasterIcon = (categoryId) => {
    const icons = {
      wildfires: "🔥",
      severeStorms: "🌀",
      volcanoes: "🌋",
      floods: "🌊",
      drought: "☀️",
      dustHaze: "💨",
      seaLakeIce: "❄️",
    };
    return icons[categoryId] || "⚠️";
  };

  const getDisasterColor = (categoryId) => {
    const colors = {
      wildfires: "orange",
      severeStorms: "purple",
      volcanoes: "red",
      floods: "blue",
      drought: "yellow",
      dustHaze: "gray",
      seaLakeIce: "cyan",
    };
    return colors[categoryId] || "gray";
  };

  if (loading && disasters.length === 0) {
    return (
      <div
        className={`p-6 rounded-lg shadow-lg max-h-[600px] flex items-center justify-center ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Loading disaster data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-6 rounded-lg shadow-lg max-h-[600px] ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="text-center py-12">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3
            className={`text-xl font-semibold mb-2 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Error Loading Data
          </h3>
          <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {error}
          </p>
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
    <div
      className={`p-6 rounded-lg shadow-lg max-h-[600px] overflow-y-auto ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-2xl font-bold flex items-center ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          🌍 Natural Disasters
          <span
            className={`ml-2 text-sm font-normal ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            (Active Events)
          </span>
        </h2>
        <div className="flex items-center gap-2">
          {loading && disasters.length > 0 && (
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
      <div
        className={`mb-4 space-y-3 pb-4 border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Disaster Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "border-gray-300"
              }`}
            >
              {Object.entries(disasterTypes).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.icon} {val.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Filter by Location
            </label>
            <input
              type="text"
              placeholder="Enter location..."
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "border-gray-300"
              }`}
            />
          </div>
        </div>
        <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Showing {currentDisasters.length} of {filteredDisasters.length} disasters
        </div>
      </div>

      {/* Disaster List */}
      <div className="space-y-3 mb-4">
        {currentDisasters.length > 0 ? (
          currentDisasters.map((d) => {
            const categoryId = d.categories[0]?.id || "unknown";
            const isActive = !d.closed;
            return (
              <div
                id={`disaster-${d.id}`}
                key={d.id}
                onClick={() => onDisasterSelect(d.id)}
                className={`p-4 rounded-lg transition-all cursor-pointer ${
                  selectedDisasterId === d.id
                    ? "ring-4 ring-blue-500 scale-105"
                    : ""
                } ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">
                        {getDisasterIcon(categoryId)}
                      </span>
                      <h3
                        className={`font-semibold ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {d.title}
                      </h3>
                    </div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {d.geometry && d.geometry.length > 0
                        ? new Date(d.geometry[0].date).toLocaleString()
                        : "Date unknown"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          darkMode
                            ? "bg-gray-600 text-gray-300"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {d.categories[0]?.title || "Unknown Type"}
                      </span>
                      {isActive && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                          ● Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className={`text-center py-8 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No disasters match your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className={`flex items-center justify-center gap-2 pt-4 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>
          <span
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DisasterFeed;
