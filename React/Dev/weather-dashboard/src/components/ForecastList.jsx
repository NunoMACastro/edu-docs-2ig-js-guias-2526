import {
    WiCloudy,
    WiDayCloudy,
    WiDaySunny,
    WiFog,
    WiRain,
    WiSnow,
    WiStrongWind,
    WiThermometer,
    WiThunderstorm,
} from "react-icons/wi";

function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-PT", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
    });
}

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

function ForecastList({ days }) {
    if (!days || days.length === 0) {
        return <p className="empty-state">Sem previsão disponível.</p>;
    }

    return (
        <section className="panel">
            <h3>Previsão para 7 dias</h3>
            <div className="forecast-list">
                {days.map((day) => {
                    const DayIcon = getWeatherIcon(day.weatherCode);

                    return (
                        <article key={day.date} className="forecast-card">
                            <header className="forecast-card__header">
                                <span className="forecast-card__day">{formatDate(day.date)}</span>
                                <span className="forecast-card__condition">
                                    <DayIcon
                                        className="forecast-card__condition-icon"
                                        aria-hidden="true"
                                    />
                                    {getWeatherLabel(day.weatherCode)}
                                </span>
                            </header>

                            <div className="forecast-card__metrics">
                                <div className="forecast-metric">
                                    <span className="forecast-metric__label">
                                        <WiThermometer
                                            className="forecast-metric__icon"
                                            aria-hidden="true"
                                        />
                                        Temperatura
                                    </span>
                                    <strong>{day.min}°C / {day.max}°C</strong>
                                </div>

                                <div className="forecast-metric">
                                    <span className="forecast-metric__label">
                                        <WiRain
                                            className="forecast-metric__icon"
                                            aria-hidden="true"
                                        />
                                        Chuva máx
                                    </span>
                                    <strong>{day.precipitationProb}%</strong>
                                </div>

                                <div className="forecast-metric">
                                    <span className="forecast-metric__label">
                                        <WiStrongWind
                                            className="forecast-metric__icon"
                                            aria-hidden="true"
                                        />
                                        Vento máx
                                    </span>
                                    <strong>{day.windSpeedMax} km/h</strong>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export default ForecastList;
