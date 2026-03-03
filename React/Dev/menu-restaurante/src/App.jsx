import { useMemo, useState } from "react";
import CategoryFilter from "./components/CategoryFilter";
import MenuList from "./components/MenuList";
import OrderPanel from "./components/OrderPanel";
import { menuData } from "./data/menuData";
import "./App.css";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [quantities, setQuantities] = useState({});

  const categories = useMemo(
    () => ["Todos", ...new Set(menuData.map((item) => item.categoria))],
    []
  );

  const filteredItems =
    selectedCategory === "Todos"
      ? menuData
      : menuData.filter((item) => item.categoria === selectedCategory);

  function increaseItem(itemId) {
    setQuantities((current) => ({
      ...current,
      [itemId]: (current[itemId] ?? 0) + 1,
    }));
  }

  function decreaseItem(itemId) {
    setQuantities((current) => {
      const currentQuantity = current[itemId] ?? 0;

      if (currentQuantity <= 1) {
        const { [itemId]: _removed, ...rest } = current;
        return rest;
      }

      return {
        ...current,
        [itemId]: currentQuantity - 1,
      };
    });
  }

  const orderItems = menuData
    .map((item) => ({
      ...item,
      quantity: quantities[item.id] ?? 0,
    }))
    .filter((item) => item.quantity > 0);

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.quantity * item.preco,
    0
  );

  return (
    <main className="page">
      <header>
        <h1>Menu Interativo do Restaurante</h1>
        <p>
          Exemplo simples para praticar componentes, props e useState em React.
        </p>
      </header>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <section className="content-layout">
        <MenuList
          items={filteredItems}
          quantities={quantities}
          onAddItem={increaseItem}
          onIncreaseItem={increaseItem}
          onDecreaseItem={decreaseItem}
        />
        <OrderPanel
          orderItems={orderItems}
          totalItems={totalItems}
          totalPrice={totalPrice}
          onIncreaseItem={increaseItem}
          onDecreaseItem={decreaseItem}
        />
      </section>
    </main>
  );
}

export default App;
