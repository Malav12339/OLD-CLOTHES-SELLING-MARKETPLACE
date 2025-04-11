import React, { useEffect, useState } from "react";
import { Heart } from 'lucide-react';
import { toast } from "react-toastify";
import "./styles/Products.css";
import { authState } from "../store/atoms";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({
        category: "",
        subcategory: "",
        size: "",
        condition: "",
        priceRange: ""
    });
    const [tempFilters, setTempFilters] = useState({ ...selectedFilters });

    const [auth] = useRecoilState(authState);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    const handleTempFilterChange = (e) => {
        setTempFilters({ ...tempFilters, [e.target.name]: e.target.value });
    };
    
    // Apply filters when button is clicked
    const applyFilters = () => {
        setSelectedFilters(tempFilters);
    };
    
    // Reset filters
    const resetFilters = () => {
        setTempFilters({
            category: "", subcategory: "", size: "", condition: ""
        });
        setSelectedFilters({
            category: "", subcategory: "", size: "", condition: ""
        });
    };

    function customToast(msg) {
        toast.dismiss();
        setTimeout(() => {
            toast.error(msg, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }, 100);
    }

    useEffect(() => {
        async function fetchFiltersAndProducts() {
            try {
                const [categoryRes, subcategoryRes, productsRes] = await Promise.all([
                    fetch("http://localhost:5000/products/categories"),
                    fetch("http://localhost:5000/products/subcategories"),
                    fetch("http://localhost:5000/products")
                ]);

                const [categoryData, subcategoryData, productsData] = await Promise.all([
                    categoryRes.json(),
                    subcategoryRes.json(),
                    productsRes.json()
                ]);

                setCategories(categoryData);
                setSubcategories(subcategoryData);
                setProducts(productsData);
                setFilteredProducts(productsData);

                // Extract unique filter values
                const uniqueSizes = [...new Set(productsData.map(p => p.size))];
                const uniqueConditions = [...new Set(productsData.map(p => p.condition))];
                
                setSizes(uniqueSizes);
                setConditions(uniqueConditions);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchFiltersAndProducts();
    }, []);

    // Handle product clicks
    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    // Handle wishlist addition
    const handleHeartClick = async (productId, e) => {
        e.stopPropagation();
        if (!auth.isAuthenticated) {
            customToast("Login to Add to wishlist");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/wishlist/${productId}`, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await response.json();
            response.ok ? customToast(result.message) : customToast(result.message || "Can't add to wishlist right now");
        } catch (error) {
            customToast(error);
        }
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setSelectedFilters(prev => ({ ...prev, [name]: value }));
    };

    // Apply filters
    useEffect(() => {
        let filtered = products;

        if (selectedFilters.category) {
            filtered = filtered.filter(p => p.categoryName === selectedFilters.category);
        }
        if (selectedFilters.subcategory) {
            filtered = filtered.filter(p => p.subcategoryName === selectedFilters.subcategory);
        }
        if (selectedFilters.size) {
            filtered = filtered.filter(p => p.size === selectedFilters.size);
        }
        if (selectedFilters.condition) {
            filtered = filtered.filter(p => p.condition === selectedFilters.condition);
        }
        
        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [selectedFilters, products]);

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div className="products-container">
            <h2 className="products-title">Available Old Clothes</h2>

{/* Filters Section */}
<div className="filters-container">
    <select name="category" className="filter-dropdown" onChange={handleTempFilterChange} value={tempFilters.category}>
        <option value="">All Categories</option>
        {categories.map(cat => (
            <option key={cat.name} value={cat.name}>{cat.displayName}</option>
        ))}
    </select>

    <select name="subcategory" className="filter-dropdown" onChange={handleTempFilterChange} value={tempFilters.subcategory}>
        <option value="">All Subcategories</option>
        {subcategories.filter(sub => sub.categoryName === tempFilters.category).map(sub => (
            <option key={sub.name} value={sub.name}>{sub.displayName}</option>
        ))}
    </select>

    <select name="size" className="filter-dropdown" onChange={handleTempFilterChange} value={tempFilters.size}>
        <option value="">All Sizes</option>
        {sizes.map(size => (
            <option key={size} value={size}>{size}</option>
        ))}
    </select>

    <select name="condition" className="filter-dropdown" onChange={handleTempFilterChange} value={tempFilters.condition}>
        <option value="">All Conditions</option>
        {conditions.map(cond => (
            <option key={cond} value={cond}>{cond}</option>
        ))}
    </select>

    {/* Apply Filters Button */}
    <button className="apply-filters" onClick={applyFilters}>Apply Filters</button>

    {/* Reset Filters Button */}
    <button className="reset-filters" onClick={resetFilters}>Reset Filters</button>
</div>



            {/* Products Grid */}
            <div className="products-grid">
                {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                        <div 
                            key={product._id} 
                            className="product-card"
                            onClick={() => handleProductClick(product._id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="product-image-container">
                                <img
                                    src={product.images?.[0] ? `http://localhost:5000/uploads/${product.images[0]}` : "placeholder.jpg"}
                                    alt={product.title}
                                    className="product-image"
                                />
                                <button
                                    className="heart-button"
                                    onClick={(e) => handleHeartClick(product._id, e)}
                                >
                                    <Heart size={16} />
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Products;
