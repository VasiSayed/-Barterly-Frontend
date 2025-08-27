import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <div className="card">
    <h3>{product.title}</h3>
    <p>
      {product.price} {product.currency}
    </p>
    <Link to={`/products/${product.id}`}>View</Link>
  </div>
);

export default ProductCard;
