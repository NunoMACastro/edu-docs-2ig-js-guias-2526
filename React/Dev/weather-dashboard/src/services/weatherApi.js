const BASE_URL = "https://api.open-meteo.com/v1/forecast";

function buildForecastUrl({ latitude, longitude }) {
    const params = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
        forecast_days: "7",
        timezone: "auto",
    });

    return `${BASE_URL}?${params.toString()}`;
}

function mapForecastResponse(rawData) {
    const current = {
        temperature: rawData.current.temperature_2m,
        apparentTemperature: rawData.current.apparent_temperature,
        humidity: rawData.current.relative_humidity_2m,
        windSpeed: rawData.current.wind_speed_10m,
        weatherCode: rawData.current.weather_code,
    };

    const days = rawData.daily.time.map((date, index) => ({
        date,
        min: rawData.daily.temperature_2m_min[index],
        max: rawData.daily.temperature_2m_max[index],
        precipitationProb: rawData.daily.precipitation_probability_max[index],
        windSpeedMax: rawData.daily.wind_speed_10m_max[index],
        weatherCode: rawData.daily.weather_code[index],
    }));

    return { current, days };
}

export async function fetchForecastByCoords({ latitude, longitude }) {
    const url = buildForecastUrl({ latitude, longitude });
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Falha ao obter dados meteorológicos (${response.status})`);
    }

    const json = await response.json();
    return mapForecastResponse(json);
}

export async function fetchCityWeather(city) {
    const data = await fetchForecastByCoords({
        latitude: city.latitude,
        longitude: city.longitude,
    });

    return {
        city,
        current: data.current,
        days: data.days,
        fetchedAt: new Date().toISOString(),
    };
}

export async function fetchComparison(cities) {
    const promises = cities.map((city) => fetchCityWeather(city));
    return Promise.all(promises);
}
