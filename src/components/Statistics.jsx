import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Statistics = ({ darkMode }) => {
  const [quakes, setQuakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      );
      setQuakes(res.data.features);
    } catch (err) {
      setError("Failed to fetch statistics data.");
      console.error("Error fetching statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`p-6 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center py-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
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

  // Calculate statistics
  const totalCount = quakes.length;
  const avgMagnitude = totalCount > 0
    ? (quakes.reduce((sum, q) => sum + q.properties.mag, 0) / totalCount).toFixed(2)
    : 0;
  const maxMagnitude = totalCount > 0
    ? Math.max(...quakes.map(q => q.properties.mag)).toFixed(1)
    : 0;
  const minMagnitude = totalCount > 0
    ? Math.min(...quakes.map(q => q.properties.mag)).toFixed(1)
    : 0;
  const tsunamiCount = quakes.filter(q => q.properties.tsunami === 1).length;

  // Magnitude distribution for bar chart
  const magCategories = {
    "0-2": 0,
    "2-3": 0,
    "3-4": 0,
    "4-5": 0,
    "5-6": 0,
    "6+": 0,
  };

  quakes.forEach((q) => {
    const mag = q.properties.mag;
    if (mag < 2) magCategories["0-2"]++;
    else if (mag < 3) magCategories["2-3"]++;
    else if (mag < 4) magCategories["3-4"]++;
    else if (mag < 5) magCategories["4-5"]++;
    else if (mag < 6) magCategories["5-6"]++;
    else magCategories["6+"]++;
  });

  const barChartData = Object.entries(magCategories).map(([range, count]) => ({
    range,
    count,
  }));

  // Severity distribution for pie chart
  const severityData = [
    { name: "Minor (< 3.0)", value: magCategories["0-2"] + magCategories["2-3"], color: "#10b981" },
    { name: "Light (3.0-4.0)", value: magCategories["3-4"], color: "#fbbf24" },
    { name: "Moderate (4.0-5.0)", value: magCategories["4-5"], color: "#f97316" },
    { name: "Strong (5.0+)", value: magCategories["5-6"] + magCategories["6+"], color: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      {/* Tsunami Alert Banner */}
      {tsunamiCount > 0 && (
        <div className="p-4 sm:p-6 bg-red-600 text-white rounded-lg shadow-lg border-2 sm:border-4 border-red-700 animate-pulse">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <div className="text-4xl sm:text-6xl">🌊</div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">TSUNAMI WARNING ACTIVE</h2>
              <p className="text-base sm:text-lg md:text-xl">
                {tsunamiCount} earthquake{tsunamiCount > 1 ? 's' : ''} with possible tsunami threat detected!
              </p>
              <p className="text-xs sm:text-sm mt-2">Please check official tsunami warning centers for your region.</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg text-white">
          <div className="text-2xl sm:text-3xl font-bold mb-2">{totalCount}</div>
          <div className="text-sm sm:text-base text-blue-100">Total Earthquakes</div>
          <div className="text-xs text-blue-200 mt-1">Last 24 hours</div>
        </div>
        <div className="p-4 sm:p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg text-white">
          <div className="text-2xl sm:text-3xl font-bold mb-2">{avgMagnitude}</div>
          <div className="text-sm sm:text-base text-green-100">Average Magnitude</div>
          <div className="text-xs text-green-200 mt-1">Mean value</div>
        </div>
        <div className="p-4 sm:p-6 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg text-white">
          <div className="text-2xl sm:text-3xl font-bold mb-2">{maxMagnitude}</div>
          <div className="text-sm sm:text-base text-red-100">Maximum Magnitude</div>
          <div className="text-xs text-red-200 mt-1">Strongest quake</div>
        </div>
        <div className="p-4 sm:p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg text-white">
          <div className="text-2xl sm:text-3xl font-bold mb-2">{minMagnitude}</div>
          <div className="text-sm sm:text-base text-purple-100">Minimum Magnitude</div>
          <div className="text-xs text-purple-200 mt-1">Weakest quake</div>
        </div>
        <div className={`p-4 sm:p-6 col-span-2 sm:col-span-1 rounded-lg shadow-lg text-white ${
          tsunamiCount > 0 
            ? 'bg-gradient-to-br from-red-600 to-red-700 animate-pulse' 
            : 'bg-gradient-to-br from-cyan-500 to-cyan-600'
        }`}>
          <div className="text-2xl sm:text-3xl font-bold mb-2">
            {tsunamiCount > 0 ? '🌊 ' : ''}{tsunamiCount}
          </div>
          <div className={`text-sm sm:text-base ${tsunamiCount > 0 ? 'text-red-100' : 'text-cyan-100'}`}>
            Tsunami Warnings
          </div>
          <div className={`text-xs mt-1 ${
            tsunamiCount > 0 ? 'text-red-200 font-bold' : 'text-cyan-200'
          }`}>
            {tsunamiCount > 0 ? 'ACTIVE THREAT' : 'No threats'}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Bar Chart */}
        <div className={`p-4 sm:p-6 rounded-lg shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg sm:text-xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>Magnitude Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className={`p-4 sm:p-6 rounded-lg shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg sm:text-xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>Severity Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 Strongest Earthquakes */}
      <div className={`p-4 sm:p-6 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg sm:text-xl font-bold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>🔥 Top 5 Strongest Earthquakes</h3>
        <div className="space-y-3">
          {quakes
            .sort((a, b) => b.properties.mag - a.properties.mag)
            .slice(0, 5)
            .map((q, idx) => (
              <div key={q.id} className={`flex items-center justify-between p-3 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <div className={`font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>{q.properties.place}</div>
                    <div className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {new Date(q.properties.time).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full font-bold ${
                  q.properties.mag >= 6 ? 'bg-red-100 text-red-800' :
                  q.properties.mag >= 5 ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {q.properties.mag.toFixed(1)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
