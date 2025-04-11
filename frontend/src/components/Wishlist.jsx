import React, { useEffect, useState } from "react";
import { Heart, Trash2 } from 'lucide-react'; // Import the Heart and Trash2 icons
import { toast } from "react-toastify";
import "./styles/Products.css"; // Import your existing CSS
import { authState } from "../store/atoms";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
    const [products, setProducts] = useState([]);
    const [auth, setAuth] = useRecoilState(authState);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    function customToast(msg) {
        toast.error(msg, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("http://localhost:5000/wishlist", {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5000/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                setProducts(products.filter(product => product._id !== productId));
                toast.success("Product removed from wishlist!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                customToast("Failed to remove product.");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            customToast("An error occurred.");
        }
    };

    return (
        <div className="products-container">
            <h2 className="products-title">Your favourites</h2>
            <div className="products-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id} className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
                            <div className="product-image-container">
                                <img
                                    src={`http://localhost:5000/uploads/${product.images[0]}`}
                                    alt={product.title}
                                    className="product-image"
                                />
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="product-info">
                                <h3 className="product-title">{product.title}</h3>
                                <p className="product-price">₹{product.price}</p>
                                <p className="product-description">{product.description}</p>
                                <p className="product-condition">Condition: {product.condition}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
        </div>
    );
};

export default Wishlist;