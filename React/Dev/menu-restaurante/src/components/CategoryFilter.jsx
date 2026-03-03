function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <section className="card">
      <h2>Filtrar por categoria</h2>
      <div className="filters">
        {categories.map((category) => {
          const isActive = category === selectedCategory;

          return (
            <button
              key={category}
              type="button"
              className={isActive ? "filter-btn active" : "filter-btn"}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryFilter;
