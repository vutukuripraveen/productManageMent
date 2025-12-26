import React from 'react';

const ProductCard = ({ products, onEdit }) => {
  return (
    <div className="card-grid">
      {products.map((p) => (
        <div key={p.id} className="product-card">
          <h4>{p.name}</h4>
          <p>₹{p.price}</p>
          <p>{p.category}</p>
          <p>Stock: {p.stock}</p>
          <p>
            {p.tags?.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </p>
          <p className={p.isActive ? 'status active' : 'status inactive'}>
            {p.isActive ? 'Active' : 'Inactive'}
          </p>
          <button className="btn secondary" onClick={() => onEdit(p)}>
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
