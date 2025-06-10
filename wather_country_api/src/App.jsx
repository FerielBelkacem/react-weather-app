import { useState, useEffect } from "react";
import "./App.css";

// Access the OpenWeatherMap API key from environment variables
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const App = () => {
  // State to store weather data
  const [weather, setWeather] = useState(null);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to store error messages
  const [error, setError] = useState(null);
  // City name for the weather query
  const city = "London";

  // Fetch weather data when the component mounts
  useEffect(() => {
    // Async function to fetch weather data from OpenWeatherMap API
    const fetchWeather = async () => {
      try {
        console.log("Starting request for", city);
        // Make HTTP GET request to the OpenWeatherMap API
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        console.log("Response data:", response);
        console.log("Response status:", response.status);

        // Check if the response is not OK (e.g., 404, 401)
        if (!response.ok) {
          throw new Error(
            `HTTP error: ${response.status} - ${response.statusText}`
          );
        }

        // Parse the JSON response
        const data = await response.json();
        console.log("Received data:", data);

        // Update weather state with relevant data
        setWeather({
          name: data.name, // City name
          temp: data.main.temp, // Temperature in Celsius
          description: data.weather[0].description, // Weather description
          icon: data.weather[0].icon, // Weather icon code
          wind: data.wind.deg, // Wind direction in degrees
        });

        // Set loading to false once data is fetched
        setLoading(false);
      } catch (err) {
        // Handle errors (e.g., network issues, invalid API key)
        console.error("Caught error:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    // Call the fetchWeather function
    fetchWeather();
  }, []); // Empty dependency array ensures this runs once on mount

  // Render the UI
  return (
    <div className="container">
      <h1>Weather in {city}</h1>

      {/* Display loading message while fetching data */}
      {loading && <p>Loading...</p>}

      {/* Display error message if an error occurs */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Display weather data if available */}
      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <p>{weather.description}</p>
          <div className="temp">
            <img
              src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
              alt="Weather icon"
            />
            <p>{weather.temp}°C</p>
          </div>
          <p style={{ color: "red" }}>{weather.wind}</p>
        </div>
      )}
    </div>
  );
};

// Export the component for use in other files
export default App;
