import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import About from '@/pages/About';
import Support from '@/pages/Support';
import Login from '@/pages/Login';
import CreateAccount from '@/pages/CreateAccount';
import ForgotPassword from '@/pages/ForgotPassword';
import Account from '@/pages/Account';
import SiteLayout from '@/components/abix/SiteLayout';
import { ShopProvider } from '@/lib/ShopContext';
import { AuthProvider } from '@/lib/AuthContext';
// Add page imports here

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <ShopProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Add your page Route elements here */}
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:slug" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/support" element={<Support />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/account" element={<Account />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </ShopProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App