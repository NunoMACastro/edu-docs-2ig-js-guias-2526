function ComparePanel({
    cities,
    compareCityIds,
    onToggleCompare,
    comparisonRows,
    summary,
    loading,
    errorMessage,
    limitMessage,
}) {
    return (
        <section className="panel compare-panel">
            <h3>Comparar 3 cidades</h3>
            <p className="compare-panel__helper">
                Seleciona até 3 cidades para comparar médias e condições atuais.
            </p>

            <div className="compare-panel__picker">
                {cities.map((city) => {
                    const checked = compareCityIds.includes(city.id);
                    const disableOption = !checked && compareCityIds.length >= 3;

                    return (
                        <label key={city.id} className="compare-panel__option">
                            <input
                                type="checkbox"
                                checked={checked}
                                disabled={disableOption}
                                onChange={() => onToggleCompare(city.id)}
                            />
                            <span>{city.name}</span>
                        </label>
                    );
                })}
            </div>

            {limitMessage && (
                <p className="compare-panel__warning" role="status">
                    {limitMessage}
                </p>
            )}

            {loading && (
                <p className="compare-panel__loading">
                    A atualizar dados da comparação...
                </p>
            )}

            {errorMessage && (
                <p className="compare-panel__error" role="alert">
                    {errorMessage}
                </p>
            )}

            {comparisonRows.length === 0 ? (
                <p className="empty-state">
                    Seleciona pelo menos uma cidade para comparar.
                </p>
            ) : (
                <table className="compare-panel__table">
                    <thead>
                        <tr>
                            <th>Cidade</th>
                            <th>Temp. atual</th>
                            <th>Vento atual</th>
                            <th>Máx média (7 dias)</th>
                            <th>Mín média (7 dias)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonRows.map((row) => (
                            <tr key={row.cityId}>
                                <td>{row.cityName}</td>
                                <td>{row.currentTemp}°C</td>
                                <td>{row.currentWind} km/h</td>
                                <td>{row.avgMax.toFixed(1)}°C</td>
                                <td>{row.avgMin.toFixed(1)}°C</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {summary && (
                <div className="compare-panel__summary">
                    <span className="compare-chip">
                        Média temp. atual:{" "}
                        <strong>{summary.avgCurrentTemp.toFixed(1)}°C</strong>
                    </span>
                    <span className="compare-chip">
                        Cidade mais quente: <strong>{summary.hottestCity}</strong>
                    </span>
                    <span className="compare-chip">
                        Cidade com mais vento: <strong>{summary.windiestCity}</strong>
                    </span>
                </div>
            )}
        </section>
    );
}

export default ComparePanel;
