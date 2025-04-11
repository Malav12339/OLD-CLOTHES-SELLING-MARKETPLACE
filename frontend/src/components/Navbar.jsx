import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../store/atoms";
import { Navbar as BootstrapNavbar, Container, Nav, Button, Badge, Dropdown } from "react-bootstrap";
import { Heart } from "react-bootstrap-icons";
import { BsBag as ShoppingBag } from "react-icons/bs"; 
import { User, ShoppingCart, Search } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/Navbar.css"; 

const Navbar = () => {
    const navigate = useNavigate()
    function customToast(msg) {
        // Use a more robust approach to handle existing toasts
        try {
            // First try to dismiss any existing toasts
            toast.dismiss();
            
            // Small delay to ensure dismissal completes
            setTimeout(() => {
                toast.success(msg, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    // Remove the toastId to avoid conflicts
                });
            }, 100);
        } catch (error) {
            console.error("Toast error:", error);
        }
    }
    
    const [auth, setAuth] = useRecoilState(authState);

    const handleLogout = () => {
        console.log("logout function called")
        if (!auth.isAuthenticated) return;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuth({ isAuthenticated: false, user: null });
        customToast("Logged out successfully")
        setTimeout(() => navigate("/login"), 1000)
    };

    const handleSellClick = (e) => {
        if (!auth.isAuthenticated) {
            e.preventDefault();
            customToast("Login to add Product")
        }
    };

    // Function to scroll to bottom of the page
    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <BootstrapNavbar bg="white" expand="lg" className="shadow-sm sticky-top">
                <Container>
                    <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
                        <ShoppingBag className="me-2" size={24} color="#198754" />
                        <span className="fw-bold">VintageThreads</span>
                    </BootstrapNavbar.Brand>
                    
                    <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                    <BootstrapNavbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <Nav.Link as={Link} to="/" className="mx-2">Home</Nav.Link>
                            <Nav.Link as={Link} to="/products" className="mx-2">Shop</Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/add-product"
                                className="mx-2"
                                onClick={handleSellClick}
                            >
                                Sell
                            </Nav.Link>
                            {/* Modified About and Contact links */}
                            <Nav.Link 
                                className="mx-2" 
                                onClick={scrollToBottom}
                                style={{ cursor: 'pointer' }}
                            >
                                About
                            </Nav.Link>
                            <Nav.Link 
                                className="mx-2" 
                                onClick={scrollToBottom}
                                style={{ cursor: 'pointer' }}
                            >
                                Contact
                            </Nav.Link>
                        </Nav>
                        
                        <div className="d-flex align-items-center">
                            <Button variant="link" className="p-1 text-dark">
                                <Search size={20} />
                            </Button>
                            <Button onClick={() => navigate("/wishlist")} variant="link" className="p-1 text-dark">
                                <Heart size={20} />
                            </Button>
                            <Dropdown>
                                <Dropdown.Toggle variant="link" className="p-1 text-dark">
                                    <User size={20} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {auth.isAuthenticated ? (
                                        <>
                                            <Dropdown.Item disabled>{auth.user}</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/myproducts">My Uploads</Dropdown.Item>
                                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                        </>
                                    ) : (
                                        <>
                                            <Dropdown.Item as={Link} to="/signup">Signup</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
                                        </>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </BootstrapNavbar.Collapse>
                </Container>
            </BootstrapNavbar>
            <ToastContainer />
        </>
    );
};

export default Navbar;