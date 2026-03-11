import './App.css'
import { useState, useEffect } from 'react'
import EarthquakeFeed from './components/EarthquakeFeed'
import DisasterFeed from './components/DisasterFeed'
import MapView from './components/MapView'
import Statistics from './components/Statistics'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [selectedQuakeId, setSelectedQuakeId] = useState(null);
  const [selectedDisasterId, setSelectedDisasterId] = useState(null);
  const [activeTab, setActiveTab] = useState('earthquakes'); // 'earthquakes' or 'disasters'

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
        <header className="text-center mb-6 sm:mb-8 relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`absolute right-0 top-0 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base rounded-lg font-medium transition-colors ${
              darkMode 
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold pr-16 sm:pr-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🌍 Disaster Management Dashboard
          </h1>
          <p className={`mt-2 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Real-time monitoring of natural disasters and emergencies
          </p>
          
          {/* Tab Selector */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6">
            <button
              onClick={() => {
                setActiveTab('earthquakes');
                setSelectedDisasterId(null);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all ${
                activeTab === 'earthquakes'
                  ? darkMode
                    ? 'bg-blue-600 text-white shadow-lg sm:scale-105'
                    : 'bg-blue-600 text-white shadow-lg sm:scale-105'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🌍 Earthquakes (USGS)
            </button>
            <button
              onClick={() => {
                setActiveTab('disasters');
                setSelectedQuakeId(null);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all ${
                activeTab === 'disasters'
                  ? darkMode
                    ? 'bg-blue-600 text-white shadow-lg sm:scale-105'
                    : 'bg-blue-600 text-white shadow-lg sm:scale-105'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔥 All Disasters (NASA)
            </button>
          </div>
        </header>
        
        {/* Statistics Dashboard (Only for Earthquakes) */}
        {activeTab === 'earthquakes' && (
          <div className="mb-6 sm:mb-8">
            <Statistics darkMode={darkMode} />
          </div>
        )}

        {/* Feed and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {activeTab === 'earthquakes' ? (
            <EarthquakeFeed 
              darkMode={darkMode} 
              selectedQuakeId={selectedQuakeId}
              onQuakeSelect={setSelectedQuakeId}
            />
          ) : (
            <DisasterFeed
              darkMode={darkMode}
              selectedDisasterId={selectedDisasterId}
              onDisasterSelect={setSelectedDisasterId}
            />
          )}
          <MapView 
            darkMode={darkMode}
            selectedQuakeId={selectedQuakeId}
            onQuakeSelect={setSelectedQuakeId}
            selectedDisasterId={selectedDisasterId}
            onDisasterSelect={setSelectedDisasterId}
            activeTab={activeTab}
          />
        </div>
      </div>
    </div>
  )
}

export default App
