import MenuItem from "./MenuItem";

function MenuList({ items, quantities, onAddItem, onIncreaseItem, onDecreaseItem }) {
  return (
    <section className="card">
      <h2>Itens do menu</h2>
      {items.length === 0 ? (
        <p>Nao ha itens para esta categoria.</p>
      ) : (
        <div className="menu-grid">
          {items.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              quantity={quantities[item.id] ?? 0}
              onAddItem={onAddItem}
              onIncreaseItem={onIncreaseItem}
              onDecreaseItem={onDecreaseItem}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default MenuList;
