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
        
        // Fallback to enhanced mock data if API fails
        const mockNews = [
          {
            title: "React 19 Released with Groundbreaking Features",
            source: { name: "React Official Blog" },
            publishedAt: new Date().toISOString(),
            description: "React 19 introduces concurrent rendering, automatic batching, and new server components that will change how we build web applications.",
            url: "https://reactjs.org"
          },
          {
            title: "AI Revolution: How Machine Learning is Changing Web Development",
            source: { name: "TechCrunch" },
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            description: "New AI tools are automating front-end development tasks, from layout generation to code optimization, reducing development time by up to 40%.",
            url: "https://techcrunch.com"
          },
          {
            title: "The Future of CSS: New Features in 2024",
            source: { name: "CSS-Tricks" },
            publishedAt: new Date(Date.now() - 172800000).toISOString(),
            description: "CSS nesting, container queries, and new color functions are making responsive design easier than ever before.",
            url: "https://css-tricks.com"
          },
          {
            title: "JavaScript Performance Optimization Techniques",
            source: { name: "Dev.to" },
            publishedAt: new Date(Date.now() - 259200000).toISOString(),
            description: "How to make your JavaScript code run faster than ever with modern optimization techniques and WebAssembly integration.",
            url: "https://dev.to"
          },
          {
            title: "WebAssembly: The Future of Web Performance",
            source: { name: "Smashing Magazine" },
            publishedAt: new Date(Date.now() - 345600000).toISOString(),
            description: "How WASM is enabling near-native performance in browsers, allowing complex applications to run at unprecedented speeds.",
            url: "https://smashingmagazine.com"
          }
        ];
        setNews(mockNews);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div>Loading news...</div>;

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
