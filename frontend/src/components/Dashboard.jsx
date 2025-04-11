import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, User, Package, Check, X, RefreshCw } from "lucide-react";
import { Modal, Button, Badge, Spinner, Tabs, Tab } from "react-bootstrap";
import "./styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [actionType, setActionType] = useState(""); // "removeProduct" or "removeSeller"
  const [processingAction, setProcessingAction] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/auth/reports", {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      setReports(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleReportAction = (report, action) => {
    setCurrentReport(report);
    setActionType(action);
    setShowModal(true);
  };

  // Function to delete all products of a seller
  const deleteSellerProducts = async (sellerId) => {
    try {
      // 1. Fetch all products
      const response = await fetch("http://localhost:5000/products/", {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const allProducts = await response.json();
      
      // 2. Filter products by sellerId
      const sellerProducts = allProducts.filter(
        product => product.sellerId === sellerId || 
                  (product.sellerId._id && product.sellerId._id === sellerId)
      );

      // 3. Delete each product
      const deletePromises = sellerProducts.map(product => 
        fetch(`http://localhost:5000/products/${product._id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        })
      );

      // Wait for all delete operations to complete
      await Promise.all(deletePromises);
      
      console.log(`Successfully deleted ${sellerProducts.length} products from seller ${sellerId}`);
      return true;
    } catch (error) {
      console.error("Error deleting seller products:", error);
      throw error;
    }
  };

  const handleConfirmAction = async () => {
    setProcessingAction(true);
    try {
      let endpoint, body, method;
      const sellerId = currentReport.reportedSellerId._id;

      if (actionType === "removeProduct" && currentReport.reportedProductId) {
        endpoint = `http://localhost:5000/admin/products/${currentReport.reportedProductId._id}`;
        method = "PUT";
        body = { reportId: currentReport._id };
      } else if (actionType === "removeSeller") {
        // First delete all products by this seller
        await deleteSellerProducts(sellerId);
        
        // Then remove the seller
        endpoint = `http://localhost:5000/admin/users/${sellerId}`;
        method = "PUT";
        body = { reportId: currentReport._id };
      } else if (actionType === "resolveReport" || actionType === "dismissReport") {
        endpoint = `http://localhost:5000/auth/reports/${currentReport._id}/status`;
        method = "PUT";
        body = { status: actionType === "resolveReport" ? "resolved" : "dismissed" };
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to perform action");
      }

      // Update the local state to reflect the changes
      if (actionType === "resolveReport" || actionType === "dismissReport") {
        setReports(
          reports.map((r) =>
            r._id === currentReport._id
              ? { ...r, status: actionType === "resolveReport" ? "resolved" : "dismissed" }
              : r
          )
        );
      } else {
        // For remove actions, we update the report status
        setReports(
          reports.map((r) =>
            r._id === currentReport._id ? { ...r, status: "actioned" } : r
          )
        );
      }

      setShowModal(false);
      setProcessingAction(false);
      
      // Show success notification
      alert(`Action completed successfully!`);
    } catch (error) {
      console.error("Error performing action:", error);
      alert(`Error: ${error.message}`);
      setProcessingAction(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge bg="warning">Pending</Badge>;
      case "resolved":
        return <Badge bg="success">Resolved</Badge>;
      case "dismissed":
        return <Badge bg="secondary">Dismissed</Badge>;
      case "actioned":
        return <Badge bg="info">Actioned</Badge>;
      default:
        return <Badge bg="light" text="dark">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filterReports = () => {
    let filtered = [...reports];
    
    // Filter by tab (all, product, seller)
    if (activeTab === "product") {
      filtered = filtered.filter(report => report.reportedProductId !== null);
    } else if (activeTab === "seller") {
      filtered = filtered.filter(report => report.reportedProductId === null);
    }
    
    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(report => report.status.toLowerCase() === filterStatus.toLowerCase());
    }
    
    return filtered;
  };

  const filteredReports = filterReports();

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>
          <AlertTriangle className="icon" size={32} />
          Reports Management
        </h1>
        <div className="admin-actions">
          <button className="refresh-btn" onClick={fetchReports}>
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      <div className="dashboard-controls">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="all" title={`All Reports (${reports.length})`} />
          <Tab 
            eventKey="product" 
            title={`Product Reports (${reports.filter(r => r.reportedProductId !== null).length})`}
          />
          <Tab 
            eventKey="seller" 
            title={`Seller Reports (${reports.filter(r => r.reportedProductId === null).length})`}
          />
        </Tabs>

        <div className="filter-controls">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select 
            id="statusFilter" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
            <option value="actioned">Actioned</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" role="status" variant="primary" />
          <p>Loading reports...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <AlertTriangle size={30} color="#dc3545" />
          <h3>Error</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchReports}>Try Again</button>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="no-reports-container">
          <h3>No reports found</h3>
          <p>There are no reports matching your filters.</p>
        </div>
      ) : (
        <div className="reports-table-container">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Reporter</th>
                <th>Reported</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report._id}>
                  <td>{report._id.substring(report._id.length - 6)}</td>
                  <td>
                    <div className="user-info">
                      <span className="user-name">{report.reporterId.name}</span>
                      <span className="user-email">{report.reporterId.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="user-info">
                      <span className="user-name">{report.reportedSellerId.name}</span>
                      <span className="user-email">{report.reportedSellerId.email}</span>
                    </div>
                  </td>
                  <td>
                    {report.reportedProductId ? (
                      <span className="report-type product-type">
                        <Package size={16} />
                        Product
                      </span>
                    ) : (
                      <span className="report-type seller-type">
                        <User size={16} />
                        Seller
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="report-reason">{report.reason}</div>
                  </td>
                  <td>{formatDate(report.createdAt)}</td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>
                    <div className="action-buttons">
                      {report.status.toLowerCase() === "pending" && (
                        <>
                          {report.reportedProductId && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleReportAction(report, "removeProduct")}
                            >
                              Remove Product
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleReportAction(report, "removeSeller")}
                          >
                            Remove Seller
                          </button>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleReportAction(report, "resolveReport")}
                          >
                            <Check size={14} /> Resolve
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleReportAction(report, "dismissReport")}
                          >
                            <X size={14} /> Dismiss
                          </button>
                        </>
                      )}
                      {report.status.toLowerCase() !== "pending" && (
                        <span className="no-actions">No actions available</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "removeProduct" && "Remove Product"}
            {actionType === "removeSeller" && "Remove Seller"}
            {actionType === "resolveReport" && "Resolve Report"}
            {actionType === "dismissReport" && "Dismiss Report"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {actionType === "removeProduct" && (
            <>
              <p>Are you sure you want to remove this product?</p>
              <div className="product-details">
                <strong>Product:</strong> {currentReport?.reportedProductId?.title}
                <br />
                <strong>Price:</strong> ₹{currentReport?.reportedProductId?.price}
                <br />
                <strong>Seller:</strong> {currentReport?.reportedSellerId?.name}
              </div>
              <div className="report-details mt-3">
                <strong>Report Reason:</strong>
                <p>{currentReport?.reason}</p>
              </div>
            </>
          )}
          {actionType === "removeSeller" && (
            <>
              <p>Are you sure you want to remove this seller? This action will remove all their products and listings.</p>
              <div className="seller-details">
                <strong>Seller:</strong> {currentReport?.reportedSellerId?.name}
                <br />
                <strong>Email:</strong> {currentReport?.reportedSellerId?.email}
              </div>
              <div className="report-details mt-3">
                <strong>Report Reason:</strong>
                <p>{currentReport?.reason}</p>
              </div>
            </>
          )}
          {actionType === "resolveReport" && (
            <>
              <p>Are you sure you want to mark this report as resolved?</p>
              <p>This action indicates that the issue has been addressed appropriately.</p>
            </>
          )}
          {actionType === "dismissReport" && (
            <>
              <p>Are you sure you want to dismiss this report?</p>
              <p>This action indicates that no further action is required for this report.</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={processingAction}>
            Cancel
          </Button>
          <Button 
            variant={
              actionType === "resolveReport" 
                ? "success" 
                : actionType === "dismissReport" 
                  ? "secondary" 
                  : "danger"
            } 
            onClick={handleConfirmAction}
            disabled={processingAction}
          >
            {processingAction ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Processing...</span>
              </>
            ) : (
              <>
                {actionType === "removeProduct" && "Remove Product"}
                {actionType === "removeSeller" && (
                  <>Remove Seller & All Products</>
                )}
                {actionType === "resolveReport" && "Mark as Resolved"}
                {actionType === "dismissReport" && "Dismiss Report"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;