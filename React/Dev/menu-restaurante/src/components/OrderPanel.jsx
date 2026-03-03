function OrderPanel({ orderItems, totalItems, totalPrice, onIncreaseItem, onDecreaseItem }) {
  return (
    <aside className="card">
      <h2>Pedido ({totalItems})</h2>
      {orderItems.length === 0 ? (
        <p>Ainda nao adicionaste itens.</p>
      ) : (
        <>
          <ul className="order-list">
            {orderItems.map((entry) => (
              <li key={entry.id} className="order-item-row">
                <div>
                  <strong>{entry.nome}</strong>
                  <p>
                    {entry.quantity} x {entry.preco.toFixed(2)} EUR ={" "}
                    {(entry.quantity * entry.preco).toFixed(2)} EUR
                  </p>
                </div>

                <div className="mini-controls">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => onDecreaseItem(entry.id)}
                  >
                    -
                  </button>
                  <span className="qty-badge">{entry.quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => onIncreaseItem(entry.id)}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="order-total">
            <strong>Total:</strong>
            <span>{totalPrice.toFixed(2)} EUR</span>
          </div>
        </>
      )}
    </aside>
  );
}

export default OrderPanel;
