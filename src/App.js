import { useState, useEffect } from 'react';
import axios from 'axios';
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiFog, WiMoonrise, WiSunrise } from 'react-icons/wi';
import './App.css';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  }, []);

  function tick() {
    setTime(new Date());
  }

  return (
    <div className="clock">
      {time.toLocaleTimeString()}
    </div>
  );
}

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using WeatherAPI.com - in production, use environment variables
        const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'b8c8ebacc8f0490bbac161654261304';
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=Seoul&aqi=no`
        );
        setWeather({
          temperature: response.data.current.temp_c,
          conditions: response.data.current.condition.text,
          location: response.data.location.name,
          humidity: response.data.current.humidity,
          windSpeed: response.data.current.wind_kph,
          icon: response.data.current.condition.icon
        });
        setLoading(false);
      } catch (err) {
        console.error('Weather API error:', err);
        
        // Fallback to mock data if API fails
        const mockWeather = {
          temperature: 22,
          conditions: "Sunny",
          location: "Seoul",
          humidity: 65,
          windSpeed: 12,
          icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
        };
        setWeather(mockWeather);
        setLoading(false);
        setError('Weather API unavailable - showing sample data');
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (conditions) => {
    const conditionLower = conditions.toLowerCase();
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return <WiDaySunny size={64} color="#FFD700" />;
    } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
      return <WiCloud size={64} color="#87CEEB" />;
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <WiRain size={64} color="#4682B4" />;
    } else if (conditionLower.includes('snow')) {
      return <WiSnow size={64} color="#FFFFFF" />;
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return <WiThunderstorm size={64} color="#4169E1" />;
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return <WiFog size={64} color="#D3D3D3" />;
    }
    return <WiDaySunny size={64} color="#FFD700" />;
  };

  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="weather-widget widget-card">
      <div className="weather-header">
        <h3>Weather in {weather.location}</h3>
      </div>
      <div className="weather-icon">{getWeatherIcon(weather.conditions)}</div>
      <div className="weather-temp">{weather.temperature}°C</div>
      <div className="weather-conditions">{weather.conditions}</div>
      <div className="weather-details">
        <span><strong>{weather.humidity}%</strong>Humidity</span>
        <span><strong>{weather.windSpeed} km/h</strong>Wind</span>
      </div>
    </div>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Google..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using NewsAPI - in production, use environment variables
        const API_KEY = process.env.REACT_APP_NEWS_API_KEY || '4408e35fef8f4231af4113f016f1786d';
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${API_KEY}`
        );
        setNews(response.data.articles.slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error('News API error:', err);
        
        // Fallback to mock data if API fails
        const mockNews = [
          {
            title: "React 19 Released with New Features",
            source: { name: "React Blog" },
            publishedAt: new Date().toISOString(),
            description: "The latest version of React brings performance improvements and new hooks.",
            url: "https://reactjs.org"
          },
          {
            title: "New AI Breakthroughs in 2024",
            source: { name: "Tech News" },
            publishedAt: new Date().toISOString(),
            description: "Researchers announce major advancements in artificial intelligence.",
            url: "https://technews.com"
          },
          {
            title: "Web Development Trends",
            source: { name: "Dev Magazine" },
            publishedAt: new Date().toISOString(),
            description: "Exploring the latest trends in web development for 2024.",
            url: "https://devmagazine.com"
          }
        ];
        setNews(mockNews);
        setLoading(false);
        setError('News API unavailable - showing sample data');
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div>Loading news...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="news-feed widget-card">
      <div className="news-header">
        <h3>Technology News</h3>
      </div>
      <ul>
        {news.map((article, index) => (
          <li key={index}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
            <div className="news-meta">
              <span>{article.source.name}</span>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <p className="news-description">{article.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      // Use saved preference if exists
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark-mode');
      }
    } else if (prefersDark) {
      // Use system preference if no saved preference
      setDarkMode(true);
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button onClick={toggleTheme} className="theme-toggle">
      <span className="theme-toggle-icon">
        {darkMode ? <WiSunrise size={24} /> : <WiMoonrise size={24} />}
      </span>
      <span className="theme-toggle-text">
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
}

function App() {
  return (
    <div className="App">
      <div className="header-controls">
        <Clock />
        <ThemeToggle />
      </div>
      <div className="container">
        <SearchBar />
        <div className="widgets">
          <WeatherWidget />
          <NewsFeed />
        </div>
      </div>
    </div>
  );
}

export default App;
