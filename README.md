# 🌍 AI Disaster Management Dashboard

A real-time disaster monitoring web application that displays live data about natural disasters worldwide, including earthquakes and various natural hazards from USGS and NASA data sources.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [Technology Stack](#️-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Component Details](#-component-details)
- [Data Sources](#-data-sources)
- [Available Scripts](#-available-scripts)
- [Features Breakdown](#-features-breakdown)

---

## 🎯 Project Overview

The AI Disaster Management Dashboard is a comprehensive web application designed to provide real-time monitoring and visualization of natural disasters around the world. It aggregates data from trusted sources like USGS (United States Geological Survey) and NASA's EONET (Earth Observatory Natural Event Tracker) to deliver up-to-date information about earthquakes, wildfires, storms, volcanoes, and more.

**Key Highlights:**
- 🌊 Real-time tsunami warning alerts
- 🗺️ Interactive global map with disaster markers
- 📊 Statistical analysis and visualizations
- 🌙 Dark/Light mode support
- 📱 Fully responsive design
- 📥 Export data to CSV/JSON

---

## ✨ Core Features

### 1. **Earthquake Monitoring (USGS Data)**

- **Real-time Updates:** Fetches earthquake data every 60 seconds
- **24-Hour Coverage:** Displays all earthquakes from the last 24 hours
- **Advanced Filtering:**
  - Magnitude filters: All, 2.0+, 3.0+, 4.0+, 5.0+, 6.0+
  - Location/region search
  - Pagination (10 items per page)
- **Tsunami Warnings:** 🌊 Special alerts for earthquakes with tsunami threats
- **Detailed Information:**
  - Magnitude and depth
  - Exact location and time
  - Felt reports from users
  - Tsunami risk indicators
- **Export Options:** Download data as CSV or JSON

### 2. **Natural Disasters Feed (NASA EONET Data)**

- **Real-time Tracking:** Updates every 2 minutes
- **Disaster Types Monitored:**
  - 🔥 Wildfires
  - 🌀 Severe Storms
  - 🌋 Volcanoes
  - 🌊 Floods
  - ☀️ Drought
  - 💨 Dust/Haze
  - ❄️ Sea/Lake Ice
- **Features:**
  - Filter by disaster type
  - Location-based search
  - Status tracking (Active/Closed)
  - Event history and links
  - Export to CSV/JSON

### 3. **Interactive Map Visualization**

- **Leaflet Integration:** Interactive OpenStreetMap-based visualization
- **Color-Coded Markers:**
  - **Earthquakes:**
    - 🔴 Red: Magnitude 5.0+ (Strong)
    - 🟠 Orange: Magnitude 3.0-5.0 (Moderate)
    - 🟡 Yellow: Magnitude <3.0 (Minor)
  - **Disasters:** Category-specific colors
- **Interactive Features:**
  - Circle overlays showing earthquake impact radius
  - Click markers to highlight in list view
  - Detailed popups with event information
  - Synchronized selection between map and list
  - Real-time marker updates

### 4. **Statistics Dashboard** (Earthquakes Only)

- **Key Metrics Cards:**
  - Total earthquake count (24 hours)
  - Average magnitude
  - Maximum magnitude
  - Minimum magnitude
  - Tsunami warning count (with pulse animation)
- **Data Visualizations:**
  - **Bar Chart:** Magnitude distribution across ranges
  - **Pie Chart:** Severity breakdown (Minor/Light/Moderate/Strong)
- **Top 5 Rankings:** Strongest earthquakes with details

### 5. **User Interface Features**

- **Theme Switching:** 🌙 Dark Mode / ☀️ Light Mode with localStorage persistence
- **Responsive Design:** Optimized for mobile, tablet, and desktop
- **Tab Navigation:** Easy switching between Earthquakes and Disasters
- **Auto-Refresh:** Continuous data updates
- **Loading States:** Smooth loading animations
- **Error Handling:** User-friendly error messages with retry buttons
- **Smooth Animations:** Scroll-to-view and highlight effects
- **Visual Feedback:** Ring animations for selected items

---

## 🛠️ Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Frontend Framework** | React | 19.1.1 | UI component library |
| **Build Tool** | Vite | 7.1.7 | Fast development and building |
| **Styling** | TailwindCSS | 4.1.13 | Utility-first CSS framework |
| **Maps** | Leaflet | 1.9.4 | Interactive map library |
| **Maps (React)** | React-Leaflet | 5.0.0 | React components for Leaflet |
| **Charts** | Recharts | 3.2.1 | Data visualization library |
| **HTTP Client** | Axios | 1.12.2 | API requests |
| **Linting** | ESLint | 9.36.0 | Code quality and consistency |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** Version 16.x or higher
- **npm:** Version 7.x or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd AI-Disaster-Management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

---

## 📁 Project Structure

```
AI-Disaster-Management/
├── public/                      # Static assets
├── src/
│   ├── components/
│   │   ├── EarthquakeFeed.jsx  # Earthquake list component
│   │   │                        # - Data fetching from USGS
│   │   │                        # - Filtering and pagination
│   │   │                        # - Export functionality
│   │   │
│   │   ├── DisasterFeed.jsx    # Natural disasters list
│   │   │                        # - NASA EONET data integration
│   │   │                        # - Category filtering
│   │   │                        # - Status tracking
│   │   │
│   │   ├── MapView.jsx         # Interactive Leaflet map
│   │   │                        # - Dynamic markers
│   │   │                        # - Click interactions
│   │   │                        # - Synchronized highlighting
│   │   │
│   │   └── Statistics.jsx      # Analytics dashboard
│   │                            # - Metrics calculation
│   │                            # - Charts (Bar, Pie)
│   │                            # - Top rankings
│   │
│   ├── assets/                  # Images and static files
│   ├── App.jsx                  # Main application component
│   │                            # - Theme management
│   │                            # - Tab switching logic
│   │                            # - State coordination
│   │
│   ├── main.jsx                 # React entry point
│   ├── App.css                  # Component-specific styles
│   └── index.css                # Global styles & Tailwind imports
│
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint rules
└── README.md                    # This file
```

---

## 🧩 Component Details

### **App.jsx** (Main Component)
- **Responsibilities:**
  - Theme management (dark/light mode)
  - Tab state management (earthquakes/disasters)
  - Coordination between components
  - Selection state handling
- **State Variables:**
  - `darkMode`: Theme preference
  - `selectedQuakeId`: Currently selected earthquake
  - `selectedDisasterId`: Currently selected disaster
  - `activeTab`: Active view (earthquakes/disasters)

### **EarthquakeFeed.jsx**
- **Data Source:** USGS GeoJSON API
- **Update Frequency:** Every 60 seconds
- **Key Functions:**
  - `fetchData()`: Retrieves earthquake data
  - `exportToCSV()`: Exports filtered data to CSV
  - `exportToJSON()`: Exports filtered data to JSON
- **Features:**
  - Magnitude and location filtering
  - Pagination controls
  - Tsunami warning highlights
  - Click-to-select functionality

### **DisasterFeed.jsx**
- **Data Source:** NASA EONET API
- **Update Frequency:** Every 120 seconds
- **Key Functions:**
  - `fetchData()`: Retrieves disaster events
  - `exportToCSV()`: CSV export
  - `exportToJSON()`: JSON export
- **Features:**
  - Disaster type filtering (8 categories)
  - Location search
  - Status indicators (Active/Closed)
  - Synchronized map interaction

### **MapView.jsx**
- **Mapping Library:** Leaflet with React-Leaflet
- **Tile Provider:** OpenStreetMap
- **Key Functions:**
  - `fetchQuakes()`: Loads earthquake markers
  - `fetchDisasters()`: Loads disaster markers
  - `getQuakeIcon()`: Determines marker color by magnitude
  - `getDisasterIcon()`: Sets disaster-specific icons
- **Features:**
  - Circle overlays for earthquake impact areas
  - Interactive popups with detailed info
  - Marker click handlers
  - Dynamic rendering based on active tab

### **Statistics.jsx**
- **Data Processing:** Real-time calculation of metrics
- **Visualization:**
  - Recharts Bar Chart for magnitude distribution
  - Recharts Pie Chart for severity breakdown
- **Key Calculations:**
  - Total count, average, min, max magnitudes
  - Tsunami warning detection
  - Magnitude categorization (6 ranges)
  - Severity classification (4 levels)
- **Features:**
  - Responsive card grid
  - Top 5 strongest earthquakes
  - Animated tsunami alerts

---

## 📊 Data Sources (APIs)

### 1. **USGS Earthquake API**
```
Endpoint: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
Method: GET
Format: GeoJSON
Coverage: Last 24 hours
Update Interval: Every 60 seconds in app
```

**Data Provided:**
- Earthquake magnitude
- Location (place name)
- Coordinates (latitude, longitude, depth)
- Timestamp
- Felt reports count
- Tsunami warning flag

### 2. **NASA EONET API**
```
Endpoint: https://eonet.gsfc.nasa.gov/api/v3/events
Method: GET
Format: JSON
Coverage: Active natural events
Update Interval: Every 120 seconds in app
```

**Data Provided:**
- Event title and description
- Event category/type
- Coordinates and geometry
- Date information
- Status (open/closed)
- Source links

---

## 📜 Available Scripts

```bash
# Start development server with hot module replacement
npm run dev

# Build production-ready application
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality checks
npm run lint
```

---

## 🎨 Features Breakdown

### Data Filtering & Search
- ✅ Magnitude-based filtering (earthquakes)
- ✅ Category-based filtering (disasters)
- ✅ Text-based location search
- ✅ Real-time filter application
- ✅ Pagination with page controls

### Data Export
- ✅ CSV export with formatted headers
- ✅ JSON export with structured data
- ✅ Filename with timestamp
- ✅ Browser download integration

### Visual Indicators
- ✅ Color-coded severity levels
- ✅ Tsunami warning badges
- ✅ Loading spinners
- ✅ Error states with retry
- ✅ Selected item highlights
- ✅ Pulse animations for alerts

### User Experience
- ✅ Dark/Light theme toggle
- ✅ LocalStorage persistence
- ✅ Smooth scrolling
- ✅ Responsive breakpoints
- ✅ Touch-friendly controls
- ✅ Keyboard navigation support

### Performance Optimizations
- ✅ Interval-based auto-refresh
- ✅ Cleanup on component unmount
- ✅ Conditional rendering
- ✅ Efficient state updates
- ✅ Memoized calculations

---

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Contact & Support

For questions or support, please open an issue in the repository.

---

## 🔮 Future Enhancements

Potential features for future versions:
- 📍 User location-based alerts
- 🔔 Browser notifications for major events
- 📈 Historical data analysis
- 🌡️ Weather integration
- 🗺️ Heatmap visualization
- 💾 Offline mode with caching
- 🌍 Multi-language support
- 📱 Progressive Web App (PWA) capabilities

---

**Built with ❤️ using React, Vite, and open data from USGS & NASA**
"# AI_DISASTER_MANAGEMENT" 
