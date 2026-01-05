// src/App.jsx
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Gallery from "./pages/Gallery.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Shop from "./pages/Shop.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import AdminProductDetails from "./pages/admin/AdminProductDetails.jsx";
import AdminCoupons from "./pages/admin/AdminCoupons.jsx";


import { Toaster } from "react-hot-toast";



function App() {
  const isAuth = localStorage.getItem("isAuth") === "true";
  const token = localStorage.getItem("token");
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isAuth && token) {
      (async () => {
        try {
          const res = await fetch("/api/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (Array.isArray(data.items)) {
            const count = data.items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(count);
          }
        } catch (err) {
          console.error("Failed to fetch cart:", err);
        }
      })();
    }
  }, [isAuth, token]);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      {isAuth && location.pathname !== "/login" && <Header cartCount={cartCount} />}

      <main className="flex-grow">
        <Routes>
          <Route
            path="/login"
            element={isAuth ? <Navigate to="/home" replace /> : <Login />}
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home setCartCount={setCartCount} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <Shop setCartCount={setCartCount} />
              </ProtectedRoute>
            }
          />
          <Route
  path="/admin/products/:id"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminProductDetails />
    </ProtectedRoute>
  }
/>

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart setCartCount={setCartCount} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }

          />
          <Route
  path="/admin/categories"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminCategories />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/coupons"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminCoupons />
    </ProtectedRoute>
  }
/>


          <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/product/:id" element={<ProductDetails />} />


          <Route
            path="*"
            element={<Navigate to={isAuth ? "/home" : "/login"} replace />}
          />

        </Routes>
      </main>

      {isAuth && location.pathname !== "/login" && <Footer />}
    </div>
  );
}

export default App;
