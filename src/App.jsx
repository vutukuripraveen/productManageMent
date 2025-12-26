import React, { useState } from 'react';
import Pagination from './components/Pagination';
import ProductCard from './components/ProductCard';
import ProductForm from './components/ProductForm';
import ProductTable from './components/ProductTable';
import SearchBar from './components/SearchBar';
import { initialProducts } from './data/products';
import useDebounce from './hooks/useDebounce';

function Modal({ children, onClose }) {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <span className="modalClose" onClick={onClose}>
          ✖
        </span>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isActiveProduct, setIsActiveProduct] = useState('All');
  const debouncedSearch = useDebounce(search);

  // Search and sort by date first
  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
    ?.sort((a, b) => {
      const timestampA = new Date(a?.createdAt);
      const timestampB = new Date(b?.createdAt);
      return timestampB > timestampA ? 1 : -1;
    })
    .filter((prod) =>
      isActiveProduct === 'All'
        ? true
        : isActiveProduct === 'Active'
        ? prod?.isActive
        : isActiveProduct === 'InActive' && prod?.isActive === false
    );

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const saveProduct = (data) => {
    const now = new Date().toISOString();

    if (editing) {
      // EDIT PRODUCT
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                ...data,
                updatedAt: now,
              }
            : p
        )
      );
      setEditing(null);
    } else {
      // ADD PRODUCT
      const newProduct = {
        id: Date.now(),
        ...data,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        tags: data.tags || [],
      };

      setProducts((prev) => [...prev, newProduct]);
    }
  };

  const openEditModal = (product) => {
    setEditing(product);
    setIsOpen(true);
  };

  const onDeleteModal = (data) => {
    setProducts((prev) => prev.filter((p) => p.id !== data.id));
    setEditing(null);
  };

  return (
    <div className="app-container">
      <h2>Product Management</h2>
      <div className="controls">
        <SearchBar value={search} onChange={setSearch} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <label style={{ fontWeight: '500' }}>Items per page:</label>

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setPage(1); // reset page
            }}
            style={{
              padding: '6px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
        </div>

        <button
          className="btn"
          onClick={() => setView(view === 'list' ? 'card' : 'list')}
        >
          Toggle {view === 'list' ? 'Card' : 'List'} View
        </button>
        <button
          className="btn"
          onClick={() => {
            if (isActiveProduct === 'All') {
              setIsActiveProduct('Active');
            } else if (isActiveProduct === 'Active') {
              setIsActiveProduct('InActive');
            } else {
              setIsActiveProduct('All');
            }
          }}
        >
          {isActiveProduct === 'All'
            ? 'Active'
            : isActiveProduct === 'Active'
            ? 'InActive'
            : 'All'}{' '}
          Product
        </button>
        <button
          className="btn"
          onClick={() => {
            setEditing(null);
            setIsOpen(true);
          }}
        >
          Add Product
        </button>
      </div>

      {view === 'list' ? (
        <ProductTable
          products={paginated}
          onEdit={openEditModal}
          onDelete={onDeleteModal}
        />
      ) : (
        <ProductCard products={paginated} onEdit={openEditModal} />
      )}

      <Pagination
        totalItems={filtered.length}
        currentPage={page}
        setPage={setPage}
        itemsPerPage={itemsPerPage}
      />

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <ProductForm
            product={editing}
            onSave={saveProduct}
            onClose={() => setIsOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
export default App;
