import React, { useEffect, useState } from "react";
import "./styles/SellerProducts.css";
import { useNavigate } from "react-router-dom";

function MyProducts() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        async function fetchMyProds() {
            try {
                const response = await fetch('http://localhost:5000/seller/sellerProds', {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                    }
                });
                const data = await response.json();
                if (response.ok) setProducts(data);
            } catch (err) {
                console.error("Error fetching my uploads: ", err);
            }
        }
        fetchMyProds();
    }, []);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`)
    };

    return (
        <div className="seller-products-container">
            <h2 className="seller-products-title">My Uploaded Products</h2>
            <div className="seller-products-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div 
                            key={product._id} 
                            className="seller-product-card"
                            onClick={() => handleProductClick(product._id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="seller-product-image-container">
                                <img
                                    src={`http://localhost:5000/uploads/${product.images[0]}`}
                                    alt={product.title}
                                    className="seller-product-image"
                                />
                            </div>
                            <div className="seller-product-info">
                                <h3 className="seller-product-title">{product.title}</h3>
                                <p className="seller-product-price">₹{product.price}</p>
                                <p className="seller-product-description">{product.description}</p>
                                <p className="seller-product-condition">Condition: {product.condition}</p>
                                <p className="seller-product-status">Status: {product.status}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products uploaded for sale</p>
                )}
            </div>
        </div>
    );
}

export default MyProducts;