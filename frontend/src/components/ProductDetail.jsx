import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, ArrowLeft, Edit, Trash, Flag } from "lucide-react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { authState } from "../store/atoms";
import "./styles/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [auth] = useRecoilState(authState);
  const [showReportModal, setShowReportModal] = useState(false); 
  const [reportReason, setReportReason] = useState("");
  const [reportTarget, setReportTarget] = useState(null); // "seller" or "product"
  const navigate = useNavigate();

  function customToast(msg, type = "error") {
    try {
      toast.dismiss();
      setTimeout(() => {
        toast[type](msg, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }, 100);
    } catch (error) {
      console.error("Toast error:", error);
    }
  }

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/products/${id}`);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        try {
          const sellerResponse = await fetch(`http://localhost:5000/seller/userInfo`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const sellerResult = await sellerResponse.json();
          if (sellerResponse.ok) {
            setUserInfo(sellerResult);
          }
          setProduct(data);
        } catch (sellerError) {
          console.log("Seller fetch error:", sellerError);
          setProduct(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleAddToWishlist = async () => {
    if (!auth.isAuthenticated) {
      customToast("Login to add to wishlist");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/wishlist/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        customToast(result.message, "success");
      } else {
        customToast(result.message || "Can't add to wishlist right now");
      }
    } catch (error) {
      customToast("Error adding to wishlist");
    }
  };

  const handleAddToCart = () => {
    if (!auth.isAuthenticated) {
      customToast("Login to add to cart");
      return;
    }
    customToast("Added to cart successfully", "success");
  };

  const handleEdit = () => {
    navigate(`/edit-product/${product._id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/products/${product._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        customToast("Product deleted successfully", "success");
        navigate(-1);
      } else {
        customToast(result.message || "Failed to delete product");
      }
    } catch (error) {
      customToast("Error deleting product");
    }
  };

  // Function to update status
  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = (product.status.toLowerCase() === "sold" ? "Available": "Sold")
      const response = await fetch(`http://localhost:5000/products/${product._id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json()
      console.log("result -> ", result)
      if (response.ok) {
        customToast("Product marked as sold!", "success");
        setProduct((prevProd) => ({...prevProd, status: newStatus}) );
      } else {
        customToast("Failed to update status");
      }
    } catch (error) {
      customToast("Error updating product status");
    }
  };

  const handleContactSeller = () => {
    if (!auth.isAuthenticated) {
      customToast("Login to contact seller");
      return;
    }
    customToast("Contact seller feature coming soon", "info");
  };

  // Open report modal with specified target
  const openReportModal = (target) => {
    if (!auth.isAuthenticated) {
      customToast("Login to report");
      return;
    }
    setReportTarget(target);
    setShowReportModal(true);
  };

  // Close report modal and reset values
  const closeReportModal = () => {
    setShowReportModal(false);
    setReportReason("");
    setReportTarget(null);
  };

  // Handle report submission
  const handleSubmitReport = async () => {
    if (!reportReason.trim()) {
      customToast("Please provide a reason for reporting");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const reportData = {
        reportedSellerId: product.sellerId,
        reason: reportReason,
      };

      // Add product ID only when reporting a product
      if (reportTarget === "product") {
        reportData.reportedProductId = product._id;
      }

      const response = await fetch(`http://localhost:5000/auth/report`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();
      if (response.ok) {
        customToast(`${reportTarget === "product" ? "Product" : "Seller"} reported successfully`, "success");
        closeReportModal();
      } else {
        customToast(result.message || "Failed to submit report");
      }
    } catch (error) {
      customToast("Error submitting report");
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button className="btn-primary" onClick={goBack}>
          Go Back
        </button>
      </div>
    );

  if (!product)
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <button className="btn-primary" onClick={goBack}>
          Go Back
        </button>
      </div>
    );

  return (
    <div className="product-detail-container">
      <button className="back-button" onClick={goBack}>
        <ArrowLeft size={20} />
        <span>Back to Products</span>
      </button>

      <div className="product-detail-content">
        <div className="product-detail-gallery">
          <div className="main-image-container">
            <img src={`http://localhost:5000/uploads/${product.images[selectedImage]}`} alt={product.title} className="main-image" />
          </div>

          {product.images.length > 1 && (
            <div className="thumbnail-container">
              {product.images.map((image, index) => (
                <div key={index} className={`thumbnail ${selectedImage === index ? "active" : ""}`} onClick={() => setSelectedImage(index)}>
                  <img src={`http://localhost:5000/uploads/${image}`} alt={`${product.title} - view ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <div className="product-header">
            <h1 className="product-title">{product.title}</h1>
            <p className="product-price">₹{product.price}</p>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Condition:</span>
              <span className="meta-value condition-badge">{product.condition}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Status:</span>
              <span className={`meta-value status-badge ${product.status.toLowerCase()}`}>{product.status}</span>
            </div>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-actions">
            {userInfo && product.sellerId === userInfo._id ? (
              <>
                <button className="btn-primary action-button" onClick={handleEdit}>
                  <Edit size={18} />
                  Edit
                </button>
                <button className="btn-danger action-button" onClick={handleDelete}>
                  <Trash size={18} />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button className="btn-primary action-button" onClick={handleAddToCart}>
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
                <button className="btn-outline action-button" onClick={handleAddToWishlist}>
                  <Heart size={18} />
                  Add to Wishlist
                </button>
              </>
            )}
          </div>

          <div className="product-footer">
            {userInfo && product.sellerId === userInfo._id ? (
              <div>
              <button className="contact-seller-button" onClick={handleToggleStatus}>
                {product.status.toLowerCase() === "sold" ? "✅ Available to Sell" : "✅ Mark as Sold"}
              </button>
              <div className="action-buttons-group">
                {/* <button className="contact-seller-button" onClick={handleContactSeller}>
                  Contact Seller
                </button> */}
                <div className="report-buttons">
                  <button className="btn-report" onClick={() => openReportModal("product")}>
                    <Flag size={16} />
                    Report Product
                  </button>
                  <button className="btn-report" onClick={() => openReportModal("seller")}>
                    <Flag size={16} />
                    Report Seller
                  </button>
                </div>
              </div>
              </div>
            ) : (
              <div className="action-buttons-group">
                {/* <button className="contact-seller-button" onClick={handleContactSeller}>
                  Contact Seller
                </button> */}
                <div className="report-buttons">
                  <button className="btn-report" onClick={() => openReportModal("product")}>
                    <Flag size={16} />
                    Report Product
                  </button>
                  <button className="btn-report" onClick={() => openReportModal("seller")}>
                    <Flag size={16} />
                    Report Seller
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h2>Report {reportTarget === "product" ? "Product" : "Seller"}</h2>
            <p>Please provide details about why you are reporting this {reportTarget === "product" ? "product" : "seller"}:</p>
            
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Describe the issue..."
              rows={5}
            ></textarea>
            
            <div className="modal-actions">
              <button className="btn-outline" onClick={closeReportModal}>Cancel</button>
              <button className="btn-danger" onClick={handleSubmitReport}>Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;