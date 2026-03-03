function MenuItem({ item, quantity, onAddItem, onIncreaseItem, onDecreaseItem }) {
  return (
    <article className="menu-item">
      <div className="item-header">
        <h3>{item.nome}</h3>
        <strong>{item.preco.toFixed(2)} EUR</strong>
      </div>
      <p className="item-category">{item.categoria}</p>
      <p>{item.descricao}</p>

      <div className="item-actions">
        {quantity === 0 ? (
          <button
            type="button"
            className="add-btn"
            onClick={() => onAddItem(item.id)}
          >
            Adicionar
          </button>
        ) : (
          <div className="quantity-controls">
            <button
              type="button"
              className="qty-btn"
              onClick={() => onDecreaseItem(item.id)}
            >
              -
            </button>
            <span className="qty-badge">{quantity}</span>
            <button
              type="button"
              className="qty-btn"
              onClick={() => onIncreaseItem(item.id)}
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default MenuItem;
