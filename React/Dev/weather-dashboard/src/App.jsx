import { useEffect, useMemo, useState } from "react";
import cities from "@/data/cities.js";
import SearchCity from "@/components/SearchCity.jsx";
import CityList from "@/components/CityList.jsx";
import WeatherCard from "@/components/WeatherCard.jsx";
import ForecastList from "@/components/ForecastList.jsx";
import LoadingState from "@/components/LoadingState.jsx";
import ErrorState from "@/components/ErrorState.jsx";
import ComparePanel from "@/components/ComparePanel.jsx";
import { fetchCityWeather, fetchComparison } from "@/services/weatherApi.js";

function average(values) {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function normalizeText(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

const INITIAL_COMPARE_IDS = ["porto", "faro", "braga"];

function App() {
    const [selectedCityId, setSelectedCityId] = useState("lisboa");
    const [query, setQuery] = useState("");
    const [weatherByCity, setWeatherByCity] = useState({});
    const [mainLoading, setMainLoading] = useState(false);
    const [mainError, setMainError] = useState("");
    const [comparisonLoading, setComparisonLoading] = useState(false);
    const [comparisonError, setComparisonError] = useState("");
    const [compareLimitMessage, setCompareLimitMessage] = useState("");
    const [compareCityIds, setCompareCityIds] = useState(INITIAL_COMPARE_IDS);

    const filteredCities = useMemo(() => {
        const normalized = normalizeText(query);
        if (!normalized) return cities;

        return cities.filter((city) =>
            normalizeText(city.name).includes(normalized)
        );
    }, [query]);

    const selectedCity = cities.find((city) => city.id === selectedCityId);
    const selectedWeather = weatherByCity[selectedCityId] ?? null;
    const compareCities = useMemo(
        () => cities.filter((city) => compareCityIds.includes(city.id)),
        [compareCityIds]
    );

    useEffect(() => {
        let ignore = false;

        async function loadSelectedCityWeather() {
            if (!selectedCity) return;

            setMainLoading(true);
            setMainError("");

            try {
                const weatherData = await fetchCityWeather(selectedCity);

                if (ignore) return;

                setWeatherByCity((prev) => ({
                    ...prev,
                    [selectedCity.id]: weatherData,
                }));
            } catch (fetchError) {
                if (!ignore) {
                    setMainError(
                        fetchError.message ||
                            "Não foi possível carregar os dados da cidade selecionada."
                    );
                }
            } finally {
                if (!ignore) {
                    setMainLoading(false);
                }
            }
        }

        loadSelectedCityWeather();

        return () => {
            ignore = true;
        };
    }, [selectedCityId]);

    useEffect(() => {
        let ignore = false;

        async function loadComparisonCities() {
            if (compareCities.length === 0) return;
            setComparisonLoading(true);
            setComparisonError("");

            try {
                const comparisonWeather = await fetchComparison(compareCities);
                if (ignore) return;

                const mapped = Object.fromEntries(
                    comparisonWeather.map((item) => [item.city.id, item])
                );

                setWeatherByCity((prev) => ({ ...prev, ...mapped }));
            } catch (fetchError) {
                if (!ignore) {
                    setComparisonError(
                        fetchError.message ||
                            "Não foi possível atualizar os dados de comparação."
                    );
                }
            } finally {
                if (!ignore) {
                    setComparisonLoading(false);
                }
            }
        }

        loadComparisonCities();

        return () => {
            ignore = true;
        };
    }, [compareCityIds]);

    const comparisonRows = useMemo(() => {
        return compareCityIds
            .map((cityId) => {
                const weatherData = weatherByCity[cityId];
                if (!weatherData) return null;

                const dailyMax = weatherData.days.map((day) => day.max);
                const dailyMin = weatherData.days.map((day) => day.min);

                return {
                    cityId,
                    cityName: weatherData.city.name,
                    currentTemp: weatherData.current.temperature,
                    currentWind: weatherData.current.windSpeed,
                    avgMax: average(dailyMax),
                    avgMin: average(dailyMin),
                };
            })
            .filter(Boolean);
    }, [compareCityIds, weatherByCity]);

    const comparisonSummary = useMemo(() => {
        if (comparisonRows.length === 0) return null;

        const avgCurrentTemp = average(
            comparisonRows.map((row) => row.currentTemp)
        );

        const hottest = [...comparisonRows].sort(
            (a, b) => b.currentTemp - a.currentTemp
        )[0];

        const windiest = [...comparisonRows].sort(
            (a, b) => b.currentWind - a.currentWind
        )[0];

        return {
            avgCurrentTemp,
            hottestCity: hottest.cityName,
            windiestCity: windiest.cityName,
        };
    }, [comparisonRows]);

    function onToggleCompare(cityId) {
        setCompareCityIds((prev) => {
            if (prev.includes(cityId)) {
                setCompareLimitMessage("");
                return prev.filter((id) => id !== cityId);
            }

            if (prev.length >= 3) {
                setCompareLimitMessage("Podes comparar no máximo 3 cidades.");
                return prev;
            }

            setCompareLimitMessage("");
            return [...prev, cityId];
        });
    }

    async function handleRetry() {
        if (!selectedCity) return;
        setMainError("");
        setComparisonError("");
        setMainLoading(true);
        setComparisonLoading(true);

        const [mainResult, compareResult] = await Promise.allSettled([
            fetchCityWeather(selectedCity),
            compareCities.length > 0
                ? fetchComparison(compareCities)
                : Promise.resolve([]),
        ]);

        if (mainResult.status === "fulfilled") {
            setWeatherByCity((prev) => ({
                ...prev,
                [selectedCity.id]: mainResult.value,
            }));
        } else {
            setMainError(
                mainResult.reason?.message ||
                    "Não foi possível carregar os dados da cidade selecionada."
            );
        }

        if (compareResult.status === "fulfilled") {
            const mapped = Object.fromEntries(
                compareResult.value.map((item) => [item.city.id, item])
            );
            setWeatherByCity((prev) => ({ ...prev, ...mapped }));
        } else {
            setComparisonError(
                compareResult.reason?.message ||
                    "Não foi possível atualizar os dados de comparação."
            );
        }

        setMainLoading(false);
        setComparisonLoading(false);
    }

    return (
        <div className="weather-app">
            <header className="weather-hero">
                <h1>Weather Dashboard</h1>
                <p>Previsão atual e semanal para cidades portuguesas.</p>
            </header>

            <div className="weather-grid">
                <aside className="panel">
                    <SearchCity query={query} onChange={setQuery} />

                    {filteredCities.length === 0 ? (
                        <p className="empty-state">
                            Nenhuma cidade encontrada. Ajusta a pesquisa.
                        </p>
                    ) : (
                        <CityList
                            cities={filteredCities}
                            selectedCityId={selectedCityId}
                            onSelectCity={setSelectedCityId}
                        />
                    )}
                </aside>

                <section className="weather-main">
                    {mainLoading && (
                        <LoadingState label="A carregar dados da cidade selecionada..." />
                    )}
                    {!mainLoading && mainError && (
                        <ErrorState message={mainError} onRetry={handleRetry} />
                    )}
                    {!mainLoading && !mainError && selectedWeather && (
                        <>
                            <WeatherCard
                                cityName={selectedWeather.city.name}
                                current={selectedWeather.current}
                            />
                            <ForecastList days={selectedWeather.days} />
                        </>
                    )}
                    {!mainLoading && !mainError && !selectedWeather && (
                        <p className="empty-state">
                            Sem dados disponíveis para esta cidade.
                        </p>
                    )}

                    <ComparePanel
                        cities={cities}
                        compareCityIds={compareCityIds}
                        onToggleCompare={onToggleCompare}
                        comparisonRows={comparisonRows}
                        summary={comparisonSummary}
                        loading={comparisonLoading}
                        errorMessage={comparisonError}
                        limitMessage={compareLimitMessage}
                    />
                </section>
            </div>
        </div>
    );
}

export default App;
