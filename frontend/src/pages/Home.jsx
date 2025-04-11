import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShoppingBag, Leaf, DollarSign, ArrowRight, Heart, User, ShoppingCart, Search } from 'lucide-react';
import { Container, Row, Col, Button, Card, Form, Nav, Navbar, Badge } from 'react-bootstrap';
import { authState } from "../store/atoms";

const Home = () => {
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();
        setFeaturedProducts(data.slice(0, 3)); // Get first 3 products
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleSellClick = (e) => {
    if (!auth.isAuthenticated) {
      e.preventDefault();
      toast.error("Login to add product", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      navigate("/add-product");
    }
  };

  const handleHeartClick = async (productId, e) => {
    e.preventDefault();
    if (!auth.isAuthenticated) {
      toast.error("Login to add to wishlist", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/wishlist/${productId}`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok) {
        console.log("toast from Home.jsx")
        toast.success(result.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/wishlist");
      } else {
        toast.error(result.message || "Can't add to wishlist right now", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  function handleProductClick(productId) {
    navigate(`/product/${productId}`)
  }
  return (
    <div>
      <ToastContainer />

      <section className="hero-section py-5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')", minHeight: "600px" }}>
        <div className="hero-overlay"></div>
        <Container className="py-5 position-relative">
          <Row className="min-vh-50 align-items-center">
            <Col md={7} className="text-white py-5">
              <h1 className="display-4 fw-bold mb-4">Give Your Old Clothes a New Home</h1>
              <p className="lead mb-4">Sell or buy second-hand clothes at affordable prices. Help reduce waste and promote sustainable fashion.</p>
              <div className="d-flex flex-wrap gap-3">
                <Button variant="primary" size="lg" className="d-flex align-items-center" onClick={() => navigate("/products")}>
                  Browse Products
                  <ArrowRight size={18} className="ms-2" />
                </Button>
                <Button variant="outline-light" size="lg" onClick={handleSellClick}>
                  Sell Now
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container >
          <Row>
            {featuredProducts.map((product) => (
              <Col md={4} className="mb-4" key={product._id}>
                <Card className="product-card border-0 h-100 shadow-sm" onClick={() => handleProductClick(product._id)}>
                  <div className="product-img-container position-relative">
                    <Card.Img variant="top" src={`http://localhost:5000/uploads/${product.images[0]}`} alt={product.title} className="product-img" />
                    <Button variant="light" className="position-absolute top-0 end-0 m-3 rounded-circle p-2" style={{ width: "40px", height: "40px" }} onClick={(e) => handleHeartClick(product._id, e)}>
                      <Heart size={16} />
                    </Button>
                  </div>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Card.Title className="fw-bold mb-0">{product.title}</Card.Title>
                      <span className="text-success fw-bold">₹{product.price}</span>
                    </div>
                    <Card.Text className="text-muted small mb-3">{product.description}</Card.Text>

                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Why Choose Us?</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
              We help you buy and sell used clothes easily while contributing to sustainable fashion.
            </p>
          </div>

          <Row>
            <Col md={4} className="mb-4">
              <Card className="border-0 h-100 shadow-sm text-center p-4">
                <div className="feature-icon bg-success bg-opacity-10">
                  <DollarSign size={32} className="text-success" />
                </div>
                <Card.Body>
                  <Card.Title className="fw-bold mb-3">Save Money</Card.Title>
                  <Card.Text className="text-muted">
                    Buy quality second-hand clothes at budget-friendly prices that won't break the bank.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-4">
              <Card className="border-0 h-100 shadow-sm text-center p-4">
                <div className="feature-icon bg-success bg-opacity-10">
                  <ShoppingBag size={32} className="text-success" />
                </div>
                <Card.Body>
                  <Card.Title className="fw-bold mb-3">Sell Your Clothes</Card.Title>
                  <Card.Text className="text-muted">
                    Turn your unused clothes into cash by listing them on our easy-to-use platform.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-4">
              <Card className="border-0 h-100 shadow-sm text-center p-4">
                <div className="feature-icon bg-success bg-opacity-10">
                  <Leaf size={32} className="text-success" />
                </div>
                <Card.Body>
                  <Card.Title className="fw-bold mb-3">Eco-Friendly</Card.Title>
                  <Card.Text className="text-muted">
                    Reduce textile waste and support a sustainable future by giving clothes a second life.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <Container>
          <Row className="text-center">
            <Col sm={6} md={3} className="mb-4 mb-md-0">
              <h3 className="display-5 fw-bold mb-1">5000+</h3>
              <p className="mb-0 text-white-50">Happy Customers</p>
            </Col>
            <Col sm={6} md={3} className="mb-4 mb-md-0">
              <h3 className="display-5 fw-bold mb-1">10000+</h3>
              <p className="mb-0 text-white-50">Items Sold</p>
            </Col>
            <Col sm={6} md={3} className="mb-4 mb-md-0">
              <h3 className="display-5 fw-bold mb-1">2000+</h3>
              <p className="mb-0 text-white-50">Active Sellers</p>
            </Col>
            <Col sm={6} md={3}>
              <h3 className="display-5 fw-bold mb-1">500+</h3>
              <p className="mb-0 text-white-50">Daily Listings</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section
        className="cta-section py-5"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          minHeight: "400px"
        }}
      >
        <div className="cta-overlay"></div>
        <Container className="py-5 position-relative">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h2 className="display-5 fw-bold mb-3">Start Selling Today!</h2>
              <p className="lead mb-4">Join thousands of sellers making extra income while contributing to a more sustainable future.</p>
              <Button variant="light" size="lg" onClick={handleSellClick}>
                Sell Now
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer py-5">
        <Container>
          <Row className="mb-5">
            <Col lg={3} md={6} className="mb-4 mb-md-0">
              <div className="d-flex align-items-center mb-3">
                <ShoppingBag size={24} className="text-success me-2" />
                <span className="fw-bold text-white">VintageThreads</span>
              </div>
              <p className="mb-4">Your marketplace for pre-loved fashion. Buy and sell second-hand clothes with ease.</p>
              <div className="d-flex">
                <a href="#" className="social-icon me-2">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="social-icon me-2">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="social-icon me-2">
                  <i className="bi bi-twitter"></i>
                </a>
              </div>
            </Col>

            <Col lg={3} md={6} className="mb-4 mb-md-0">
              <h5 className="text-white mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#">Home</a></li>
                <li className="mb-2"><a href="#">Shop</a></li>
                <li className="mb-2"><a href="#">Sell</a></li>
                <li className="mb-2"><a href="#">About Us</a></li>
                <li className="mb-2"><a href="#">Contact</a></li>
              </ul>
            </Col>

            <Col lg={3} md={6} className="mb-4 mb-md-0">
              <h5 className="text-white mb-3">Categories</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#">Women's Clothing</a></li>
                <li className="mb-2"><a href="#">Men's Clothing</a></li>
                <li className="mb-2"><a href="#">Kids' Clothing</a></li>
                <li className="mb-2"><a href="#">Accessories</a></li>
                <li className="mb-2"><a href="#">Footwear</a></li>
              </ul>
            </Col>

            <Col lg={3} md={6}>
              <h5 className="text-white mb-3">Newsletter</h5>
              <p className="mb-3">Subscribe to get updates on new arrivals and special offers.</p>
              <Form className="d-flex">
                <Form.Control
                  type="email"
                  placeholder="Your email"
                  className="me-2"
                />
                <Button variant="success">
                  Subscribe
                </Button>
              </Form>
            </Col>
          </Row>

          <hr className="my-4 border-secondary" />

          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0">&copy; 2025 VintageThreads. All rights reserved.</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <a href="#" className="me-3">Privacy Policy</a>
              <a href="#" className="me-3">Terms of Service</a>
              <a href="#">FAQ</a>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;