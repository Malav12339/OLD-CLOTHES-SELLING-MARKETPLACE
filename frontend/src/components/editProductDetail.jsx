import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./styles/EditProductDetail.css";

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
const conditionOptions = ["New with tags", "Like new", "Good", "Fair"];

const EditProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        size: "",
        condition: "",
        categoryName: "",
        subcategoryName: "",
    });

    useEffect(() => {
        async function fetchProductDetails() {
            try {
                const response = await fetch(`http://localhost:5000/products/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setFormData({
                        title: data.title,
                        description: data.description,
                        price: data.price,
                        size: data.size,
                        condition: data.condition,
                        categoryName: data.categoryName,
                        subcategoryName: data.subcategoryName,
                    });
                } else {
                    toast.error("Failed to fetch product details.");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProductDetails();
    }, [id]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/products/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success("Product updated successfully!");
                navigate(`/product/${id}`);
            } else {
                toast.error(result.message || "Failed to update product.");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Something went wrong.");
        }
    };

    if (loading) return <p>Loading product details...</p>;

    return (
        <div className="edit-product-container">
            <h2 className="edit-product-title">Edit Product</h2>
            <form className="edit-product-form" onSubmit={handleUpdateProduct}>
                <label className="edit-product-label">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="edit-product-input" />

                <label className="edit-product-label">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required className="edit-product-textarea" />

                <label className="edit-product-label">Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="edit-product-input" />

                {/* Size Dropdown */}
                <label className="edit-product-label">Size</label>
                <select name="size" value={formData.size} onChange={handleInputChange} required className="edit-product-select">
                    <option value="" disabled>Select Size</option>
                    {sizeOptions.map((size) => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>

                {/* Condition Dropdown */}
                <label className="edit-product-label">Condition</label>
                <select name="condition" value={formData.condition} onChange={handleInputChange} required className="edit-product-select">
                    <option value="" disabled>Select Condition</option>
                    {conditionOptions.map((condition) => (
                        <option key={condition} value={condition}>{condition}</option>
                    ))}
                </select>

                <label className="edit-product-label">Category</label>
                <input type="text" name="categoryName" value={formData.categoryName} disabled className="edit-product-input" />

                <label className="edit-product-label">Subcategory</label>
                <input type="text" name="subcategoryName" value={formData.subcategoryName} disabled className="edit-product-input" />

                <button type="submit" className="edit-product-btn">Update Product</button>
                <button type="button" className="edit-product-btn edit-product-cancel-btn" onClick={() => navigate(`/product/${id}`)}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditProductDetail;
