import { BrowserRouter, Routes, Route } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './components/Signup'
import Login from './components/Login'
import './App.css'
import './index.css'
import AddProduct from './components/AddProduct'
import Products from './components/Products'
import Wishlist from './components/Wishlist'
import AdminDashboard from './components/Dashboard';
import ProductDetail from './components/ProductDetail';
import MyProducts from './components/SellerProducts';
import EditProductDetail from './components/editProductDetail';

function App() {
  
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products" element={<Products />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/myproducts" element={<MyProducts />} />
          <Route path="/edit-product/:id" element={<EditProductDetail />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
