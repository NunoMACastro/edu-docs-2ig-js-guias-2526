function CityList({ cities, selectedCityId, onSelectCity }) {
    return (
        <ul className="city-list">
            {cities.map((city) => (
                <li key={city.id}>
                    <button
                        type="button"
                        className={`city-list__button ${
                            city.id === selectedCityId ? "active" : ""
                        }`}
                        onClick={() => onSelectCity(city.id)}
                    >
                        {city.name}
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default CityList;
