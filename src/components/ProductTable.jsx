import React from 'react';

const ProductTable = ({ products, onEdit }) => {
  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Stock</th>
          <th>Tags</th>
          <th>Active</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>₹{p.price}</td>
            <td>{p.category}</td>
            <td>{p.stock}</td>

            <td>
              {p.tags?.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </td>
            <td>
              <span
                className={p.isActive ? 'status active' : 'status inactive'}
              >
                {p.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td>
              <button className="btn secondary" onClick={() => onEdit(p)}>
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
