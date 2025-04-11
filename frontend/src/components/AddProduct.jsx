import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/AddProduct.css";

export default function AddProduct() {
    const [product, setProduct] = useState({
        title: "",
        description: "",
        price: "",
        categoryName: "",
        subcategoryName: "",
        size: "",
        condition: ""
    });
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const navigate = useNavigate();

    // Fetch categories and subcategories when component mounts
    useEffect(() => {
        const fetchCategoriesAndSubcategories = async () => {
            try {
                const token = localStorage.getItem("token");
                
                // Fetch categories
                const catResponse = await fetch("http://localhost:5000/products/categories", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const catData = await catResponse.json();
                
                // Fetch subcategories
                const subcatResponse = await fetch("http://localhost:5000/products/subcategories", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const subcatData = await subcatResponse.json();
                
                if (catResponse.ok && subcatResponse.ok) {
                    setCategories(catData);
                    setSubcategories(subcatData);
                }
            } catch (error) {
                console.error("Error fetching categories/subcategories:", error);
            }
        };

        fetchCategoriesAndSubcategories();
    }, []);

    // Filter subcategories when category changes
    useEffect(() => {
        if (product.categoryName) {
            const filtered = subcategories.filter(
                subcat => subcat.categoryName === product.categoryName
            );
            setFilteredSubcategories(filtered);
            
            // Reset subcategory when category changes
            setProduct(prev => ({
                ...prev,
                subcategoryName: ""
            }));
        } else {
            setFilteredSubcategories([]);
        }
    }, [product.categoryName, subcategories]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You need to be logged in to add a product.");
            return;
        }

        const formData = new FormData();
        formData.append("title", product.title);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("categoryName", product.categoryName);
        formData.append("subcategoryName", product.subcategoryName);
        formData.append("size", product.size);
        formData.append("condition", product.condition);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await fetch("http://localhost:5000/products", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "Product added successfully!");
                navigate("/products");
            } else {
                alert(result.message || "Failed to add product.");
            }
        } catch (error) {
            alert("Error adding product. Please try again.");
            console.error("Add Product Error:", error);
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add a New Product</h2>
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input type="text" name="title" value={product.title} onChange={handleChange} required />

                <label>Description:</label>
                <textarea name="description" value={product.description} onChange={handleChange} required />

                <label>Price:</label>
                <input type="number" name="price" value={product.price} onChange={handleChange} required />

                <label>Category:</label>
                <select name="categoryName" value={product.categoryName} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.name} value={category.name}>
                            {category.displayName}
                        </option>
                    ))}
                </select>

                <label>Subcategory:</label>
                <select 
                    name="subcategoryName" 
                    value={product.subcategoryName} 
                    onChange={handleChange} 
                    required
                    disabled={!product.categoryName}
                >
                    <option value="">Select Subcategory</option>
                    {filteredSubcategories.map(subcat => (
                        <option key={subcat.name} value={subcat.name}>
                            {subcat.displayName}
                        </option>
                    ))}
                </select>

                <label>Size:</label>
                <select name="size" value={product.size} onChange={handleChange} required>
                    <option value="">Select Size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="3XL">3XL</option>
                </select>

                <label>Condition:</label>
                <select name="condition" value={product.condition} onChange={handleChange} required>
                    <option value="">Select Condition</option>
                    <option value="New with tags">New with tags</option>
                    <option value="Like new">Like new</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                </select>

                <label>Upload Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} required />

                <button type="submit">Add Product</button>
            </form>
        </div>
    );
}