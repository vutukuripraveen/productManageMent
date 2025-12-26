import React, { useState, useMemo } from 'react';
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

function DeleteModal({ product, onConfirm, onCancel }) {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <h3>Confirm Delete</h3>

        <p>
          Are you sure you want to delete <strong>{product.name}</strong>?
        </p>

        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button className="btn danger" onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className="btn secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
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
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isActiveProduct, setIsActiveProduct] = useState('All');
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const debouncedSearch = useDebounce(search);

  // Search and sort by date first
  const filtered = useMemo(() => {
    if (!products || products.length === 0) return [];

    return (
      products
        // Search filter
        .filter((p) =>
          p.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
        )

        // Active / Inactive filter
        .filter((prod) => {
          if (isActiveProduct === 'All') return true;
          if (isActiveProduct === 'Active') return prod.isActive === true;
          if (isActiveProduct === 'InActive') return prod.isActive === false;
          return true;
        })

        // Sort by createdAt (latest first)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    );
  }, [products, debouncedSearch, isActiveProduct]);

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

  const confirmDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));

    setDeleteProduct(null);
    setShowSuccess(true);

    // Auto-hide success after 2 seconds
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const onDeleteModal = (data) => {
    setDeleteProduct(data);
    setEditing(null);
  };

  const openEditModal = (product) => {
    setEditing(product);
    setIsOpen(true);
  };

  const filterFunction = () => {
    return (
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
    );
  };

  return (
    <div className="app-container">
      <h2>Product Management</h2>
      {filterFunction()}
      {filtered.length === 0 ? (
        <div className="no-data">No products found</div>
      ) : view === 'list' ? (
        <ProductTable
          products={paginated}
          onEdit={openEditModal}
          onDelete={onDeleteModal}
        />
      ) : (
        <ProductCard
          products={paginated}
          onEdit={openEditModal}
          onDelete={onDeleteModal}
        />
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
      {deleteProduct && (
        <DeleteModal
          product={deleteProduct}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteProduct(null)}
        />
      )}
      {showSuccess && (
        <div className="success-toast">Product deleted successfully ✅</div>
      )}
    </div>
  );
}
export default App;
