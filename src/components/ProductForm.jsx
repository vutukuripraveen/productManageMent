import { useState, useEffect } from 'react';

const ProductForm = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    tags: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        tags: product.tags?.join(', ') || '',
      });
    }
  }, [product]);

  const validate = () => {
    const err = {};
    if (!form.name) err.name = 'Name required';
    if (!form.price) err.price = 'Price required';
    if (!form.category) err.category = 'Category required';
    return err;
  };

  const submit = () => {
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    onSave({
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
    });

    onClose();
  };

  return (
    <>
      <h3>{product ? 'Edit Product' : 'Add Product'}</h3>

      {['name', 'price', 'category', 'stock'].map((field) => (
        <div className="form-group" key={field}>
          <input
            placeholder={field}
            type={field === 'price' || field === 'stock' ? 'number' : 'text'}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
          {errors[field] && <div className="error">{errors[field]}</div>}
        </div>
      ))}

      <div className="form-group">
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="form-group">
        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
      </div>
      <div
        className="form-group"
        style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            color: form.isActive ? '#1e7e34' : '#b02a37',
          }}
        >
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            style={{
              width: '16px',
              height: '16px',
              accentColor: form.isActive ? '#1e7e34' : '#b02a37',
              cursor: 'pointer',
            }}
          />
          {form.isActive ? 'Active' : 'Inactive'}
        </label>
      </div>

      <button className="btn" onClick={submit}>
        {product ? 'Update' : 'Add'}
      </button>
    </>
  );
};

export default ProductForm;
