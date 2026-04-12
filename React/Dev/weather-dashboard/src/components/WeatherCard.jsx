import {
    WiCloudy,
    WiDayCloudy,
    WiDaySunny,
    WiFog,
    WiHumidity,
    WiRain,
    WiSnow,
    WiStrongWind,
    WiThermometer,
    WiThunderstorm,
} from "react-icons/wi";

const weatherCodeLabels = {
    0: "Céu limpo",
    1: "Maioritariamente limpo",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Nevoeiro",
    48: "Nevoeiro com geada",
    51: "Chuvisco fraco",
    53: "Chuvisco moderado",
    55: "Chuvisco intenso",
    61: "Chuva fraca",
    63: "Chuva moderada",
    65: "Chuva forte",
    71: "Neve fraca",
    73: "Neve moderada",
    75: "Neve forte",
    80: "Aguaceiros fracos",
    81: "Aguaceiros moderados",
    82: "Aguaceiros fortes",
    95: "Trovoada",
};

function getWeatherLabel(code) {
    return weatherCodeLabels[code] ?? `Condição (${code})`;
}

function getWeatherIcon(code) {
    if (code === 0) return WiDaySunny;
    if ([1, 2].includes(code)) return WiDayCloudy;
    if (code === 3) return WiCloudy;
    if ([45, 48].includes(code)) return WiFog;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return WiRain;
    if ([71, 73, 75].includes(code)) return WiSnow;
    if (code === 95) return WiThunderstorm;
    return WiCloudy;
}

function WeatherCard({ cityName, current }) {
    if (!current) return null;

    const ConditionIcon = getWeatherIcon(current.weatherCode);

    return (
        <article className="panel weather-card">
            <div>
                <h2 className="weather-card__title">{cityName}</h2>
                <p className="weather-card__condition">
                    <ConditionIcon
                        className="weather-card__condition-icon"
                        aria-hidden="true"
                    />
                    <strong>{getWeatherLabel(current.weatherCode)}</strong>
                </p>
                <div className="weather-card__meta">
                    <span className="badge">
                        <WiThermometer className="badge__icon" aria-hidden="true" />
                        <strong>Temperatura:</strong> {current.temperature}°C
                    </span>
                    <span className="badge">
                        <WiThermometer className="badge__icon" aria-hidden="true" />
                        <strong>Sensação:</strong> {current.apparentTemperature}°C
                    </span>
                    <span className="badge">
                        <WiHumidity className="badge__icon" aria-hidden="true" />
                        <strong>Humidade:</strong> {current.humidity}%
                    </span>
                    <span className="badge">
                        <WiStrongWind className="badge__icon" aria-hidden="true" />
                        <strong>Vento:</strong> {current.windSpeed} km/h
                    </span>
                </div>
            </div>
            <div className="weather-icon" aria-hidden="true">
                <ConditionIcon className="weather-icon__svg" />
            </div>
        </article>
    );
}

export default WeatherCard;
