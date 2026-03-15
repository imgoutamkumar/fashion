
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import ShopLayout from './components/shop/layout'
import Cart from './pages/shop/cart'
import Login from './pages/auth/login'
import AuthLayout from './components/auth/layout'
import Home from './pages/shop/home'
import Register from './pages/auth/register'
import Profile from './pages/auth/profile'
import Products from './pages/admin/products'
import AdminLayout from './components/admin/AdminLayout'
import NewProduct from './pages/admin/newProduct'
import AllProducts from './pages/shop/products'
import ProductDetails from './pages/shop/productDetails'
import RoleGuard from './guards/RoleGuard'
import AdminDashboard from './pages/admin/AdminDashboard'
import Checkout from './pages/shop/Checkout'

function App() {


  return (
    <Routes>
      {/* default redirect to login */}
      {/* <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} /> 
      </Route> */}
      <Route path="/" element={<Navigate to="/auth/login" />} />

      <Route path='/auth' element={<AuthLayout />} >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route element={<RoleGuard allowedRoles={["user"]} />}>
        <Route path='/shop' element={<ShopLayout />} >
          <Route path='profile/:id' element={<Profile />} />
          <Route path="home" element={<Home />} />
          <Route path='cart' element={<Cart />} />
          <Route path='products' element={<AllProducts />} />
          <Route path="product/:productId" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Route>
       <Route element={<RoleGuard allowedRoles={["admin"]} />}>
      <Route path='/admin' element={<AdminLayout />} >
      <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='profile/:id' element={<Profile />} />
        <Route path="products" element={<Products />} />
        <Route path="product/new" element={<NewProduct />} />
      </Route>
      </Route>
    </Routes>
  )
}

export default App
