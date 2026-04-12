function SearchCity({ query, onChange }) {
    return (
        <div className="search-city">
            <label className="search-city__label" htmlFor="city-search">
                Pesquisar cidade
            </label>
            <input
                id="city-search"
                className="search-city__input"
                type="text"
                placeholder="Ex.: Lisboa"
                value={query}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    );
}

export default SearchCity;
