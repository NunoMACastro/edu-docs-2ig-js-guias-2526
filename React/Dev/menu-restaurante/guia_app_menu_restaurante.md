![Header](../../../Images/Header.png)

# App React: Menu de Restaurante (componentes, props e useState)

Este guia mostra todos os passos para criar e implementar uma app simples em React para praticar:

- Componentes
- Props
- `useState`

Objetivo funcional desta versao:

- Filtrar itens por categoria
- Adicionar itens ao pedido
- Controlar quantidade por item (`+` e `-`)
- Calcular totais na coluna da direita

## 1. Criar o projeto com Vite

Na pasta `React/Dev`, corre:

```bash
npm create vite@latest menu-restaurante -- --template react
cd menu-restaurante
npm install
```

Depois, para arrancar o projeto:

```bash
npm run dev
```

## 2. Estrutura final de ficheiros

```text
menu-restaurante/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    App.css
    index.css
    data/
      menuData.js
    components/
      CategoryFilter.jsx
      MenuList.jsx
      MenuItem.jsx
      OrderPanel.jsx
```

## 3. Dados do menu

Criar `src/data/menuData.js`:

```js
export const menuData = [
  {
    id: 1,
    nome: "Bruschetta",
    categoria: "Entradas",
    preco: 4.5,
    descricao: "Pao tostado com tomate, azeite e alho.",
  },
  {
    id: 2,
    nome: "Sopa do dia",
    categoria: "Entradas",
    preco: 3.5,
    descricao: "Sopa fresca preparada diariamente.",
  },
  {
    id: 3,
    nome: "Lasanha de carne",
    categoria: "Pratos",
    preco: 11.9,
    descricao: "Lasanha caseira com molho de tomate e queijo.",
  },
  {
    id: 4,
    nome: "Bacalhau grelhado",
    categoria: "Pratos",
    preco: 14.5,
    descricao: "Bacalhau com batata a murro e legumes.",
  },
  {
    id: 5,
    nome: "Cheesecake",
    categoria: "Sobremesas",
    preco: 5,
    descricao: "Cheesecake cremoso com doce de frutos vermelhos.",
  },
  {
    id: 6,
    nome: "Mousse de chocolate",
    categoria: "Sobremesas",
    preco: 4.2,
    descricao: "Mousse leve com raspas de chocolate.",
  },
  {
    id: 7,
    nome: "Limonada",
    categoria: "Bebidas",
    preco: 2.8,
    descricao: "Limonada natural com hortela.",
  },
  {
    id: 8,
    nome: "Cha gelado",
    categoria: "Bebidas",
    preco: 2.6,
    descricao: "Cha preto frio com toque citrico.",
  },
];
```

## 4. Criar os componentes

### 4.1 `src/components/CategoryFilter.jsx`

Componente que recebe categorias por `props` e permite escolher uma categoria.

```jsx
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
```

### 4.2 `src/components/MenuItem.jsx`

Cada card mostra o item e os controlos de quantidade.

```jsx
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
          <button type="button" className="add-btn" onClick={() => onAddItem(item.id)}>
            Adicionar
          </button>
        ) : (
          <div className="quantity-controls">
            <button type="button" className="qty-btn" onClick={() => onDecreaseItem(item.id)}>
              -
            </button>
            <span className="qty-badge">{quantity}</span>
            <button type="button" className="qty-btn" onClick={() => onIncreaseItem(item.id)}>
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default MenuItem;
```

### 4.3 `src/components/MenuList.jsx`

Lista de itens filtrados com quantidade por item.

```jsx
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
```

### 4.4 `src/components/OrderPanel.jsx`

Coluna da direita com itens do pedido, quantidades e total.

```jsx
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
                  <button type="button" className="qty-btn" onClick={() => onDecreaseItem(entry.id)}>
                    -
                  </button>
                  <span className="qty-badge">{entry.quantity}</span>
                  <button type="button" className="qty-btn" onClick={() => onIncreaseItem(entry.id)}>
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
```

## 5. Ligar tudo no `App.jsx`

Criar `src/App.jsx`:

```jsx
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
```

## 6. Entradas da app (`main.jsx`, `index.html`, `vite.config.js`)

### `src/main.jsx`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `index.html`

```html
<!doctype html>
<html lang="pt-PT">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Menu Restaurante</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `vite.config.js`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

## 7. Correr e testar

Na pasta `menu-restaurante`:

```bash
npm install
npm run dev
```

Checklist rapido:

1. Filtra por categoria.
2. Clica em `Adicionar` num item.
3. Usa `+` e `-` para alterar quantidades.
4. Confirma que a coluna da direita atualiza quantidade e total.

## Nota sobre esta sessao

Nesta sessao, a criacao automatica com `npm create vite@latest` falhou por falta de acesso a rede (`registry.npmjs.org`).
A estrutura e os ficheiros da app foram criados manualmente com o mesmo resultado final esperado para um projeto Vite + React.

![Footer](../../../Images/Footer.png)
