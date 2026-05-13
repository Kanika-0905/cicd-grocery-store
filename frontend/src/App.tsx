import { BrowserRouter, NavLink, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { categories, deals, Product } from './data';
import AdminDashboard from './AdminDashboard';
import { ProfilePage, OrderHistoryPage, SavedAddressesPage, PaymentMethodsPage } from './ProfilePages';
type CredentialState = {
  email: string;
  password: string;
  remember: boolean;
};

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/cart', label: 'Cart' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const CategoryCard = ({ title, accent, icon }: { title: string; accent: string; icon: string }) => (
  <article className={`category-card category-${accent}`}>
    <div className="category-icon">{icon}</div>
    <div>
      <h3>{title}</h3>
      <p>Fresh picks for every meal</p>
    </div>
  </article>
);

const ProductCard = ({ product, onAdd }: { product: Product; onAdd?: (product: Product) => void }) => (
  <div className="product-card">
    <div className="product-media" style={{ backgroundImage: `url(${product.image})` }} />
    <div className="product-content">
      <div className="product-tag">{product.badge}</div>
      <h3>{product.name}</h3>
      <p className="product-category">{product.category}</p>
      <p>{product.description}</p>
      <div className="product-footer">
        <span className="product-price">{product.price}</span>
        <button type="button" className="primary-button" onClick={() => onAdd?.(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

type CartEntry = { product: Product; qty: number };

const CartItem = ({ entry, onIncrease, onDecrease, onRemove }: {
  entry: CartEntry;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}) => (
  <article className="cart-item">
    <div className="cart-image" style={{ backgroundImage: `url(${entry.product.image})` }} />
    <div className="cart-item-details">
      <h3>{entry.product.name}</h3>
      <p>{entry.product.category}</p>
      <span className="product-price">{entry.product.price}</span>
      <div className="cart-qty-row">
        <button type="button" className="qty-btn" onClick={() => onDecrease(entry.product.id)}>−</button>
        <span className="qty-value">{entry.qty}</span>
        <button type="button" className="qty-btn" onClick={() => onIncrease(entry.product.id)}>+</button>
        <button type="button" className="text-button remove-button" onClick={() => onRemove(entry.product.id)}>Remove</button>
      </div>
    </div>
  </article>
);

function LoginPage({ onLogin, onSocialLogin }: { onLogin: (email: string, password: string) => Promise<boolean>; onSocialLogin: () => void }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<CredentialState>({
    email: '',
    password: '',
    remember: false,
  });

  const handleInputChange = (field: keyof CredentialState, value: string | boolean) => {
    setCredentials((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = await onLogin(credentials.email, credentials.password);
    if (success) {
      navigate('/');
    }
  };

  const handleSocialLogin = (provider: string) => {
    onSocialLogin();
    navigate('/');
    alert(`Signed in with ${provider}.`);
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <section className="login-aside">
          <span className="eyebrow">User Login</span>
          <h2>Sign in to your grocery account</h2>
          <p>Access your saved lists, order history, and tailored grocery recommendations.</p>
          <div className="login-benefits">
            <p>Fast checkout</p>
            <p>Delivery tracking</p>
            <p>Personalized discounts</p>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-header">
            <span className="eyebrow">Welcome back</span>
            <h3>Login to continue</h3>
            <p>Enter your credentials to access fresh groceries and exclusive offers.</p>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Email address
              <input
                type="email"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={(event) => handleInputChange('email', event.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(event) => handleInputChange('password', event.target.value)}
                required
              />
            </label>

            <div className="login-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={credentials.remember}
                  onChange={(event) => handleInputChange('remember', event.target.checked)}
                />
                Remember me
              </label>
              <button type="button" className="text-link button-link" onClick={() => navigate('/contact')}>
                Forgot password?
              </button>
            </div>

            <button type="submit" className="primary-button full-width">
              Sign in
            </button>
          </form>

          <div className="login-divider">
            <span>or continue with</span>
          </div>
          <div className="social-row">
            <button type="button" className="social-pill" onClick={() => handleSocialLogin('Google')}>
              Google
            </button>
            <button type="button" className="social-pill" onClick={() => handleSocialLogin('Apple')}>
              Apple
            </button>
          </div>
          <p className="login-footer">
            New to Grocery?{' '}
            <button type="button" className="text-link button-link" onClick={() => alert('Create account flow is coming soon!')}>
              Create an account
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}

function HomePage({ onAddToCart, products, loading, error }: { onAddToCart: (product: Product) => void; products: Product[]; loading: boolean; error: string | null }) {
  const navigate = useNavigate();

  return (
    <>
      <section className="page-banner">
        <div>
          <span className="eyebrow">Fresh groceries</span>
          <h2>Welcome to your easy grocery experience</h2>
          <p>Shop fresh produce, dairy, and pantry essentials with a smooth checkout and fast delivery.</p>
        </div>
        <div className="banner-actions">
          <button type="button" className="primary-button" onClick={() => navigate('/products')}>
            Shop now
          </button>
          <button type="button" className="secondary-button" onClick={() => navigate('/products')}>
            Browse categories
          </button>
        </div>
      </section>

      <section className="section section-grid">
        <div className="section-intro">
          <span className="eyebrow">What’s fresh today</span>
          <h2>Browse grocery categories</h2>
          <p>Shop fruits, vegetables, dairy, and pantry staples with an intuitive shopper experience.</p>
        </div>
        <div className="grid-columns">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      <section className="section section-featured">
        <div className="section-intro">
          <span className="eyebrow">Featured items</span>
          <h2>Fresh groceries picked for you</h2>
          <p>High-quality produce and essentials chosen to keep your kitchen stocked and your family happy.</p>
        </div>
        {loading ? (
          <p>Loading featured items...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="product-grid">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAddToCart} />
            ))}
          </div>
        )}
      </section>

      <section className="section section-deals">
        {deals.map((deal) => (
          <article className="deal-card" key={deal.title}>
            <h3>{deal.title}</h3>
            <p>{deal.subtitle}</p>
            <button type="button" className="text-button" onClick={() => navigate('/products')}>
              {deal.action}
            </button>
          </article>
        ))}
      </section>
    </>
  );
}

function ProductsPage({ onAddToCart, products, loading, error }: { onAddToCart: (product: Product) => void; products: Product[]; loading: boolean; error: string | null }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('default');

  const allCategories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return Number(a.price.replace(/[^\d.]/g, '')) - Number(b.price.replace(/[^\d.]/g, ''));
      if (sort === 'price-desc') return Number(b.price.replace(/[^\d.]/g, '')) - Number(a.price.replace(/[^\d.]/g, ''));
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <section className="page-panel">
      <div className="page-header">
        <span className="eyebrow">Products</span>
        <h2>Shop everything in one place</h2>
        <p>Filter by category and discover the freshest groceries ready for your cart.</p>
      </div>

      <div className="products-toolbar">
        <input
          className="products-search"
          placeholder="🔍  Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="products-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">Sort: Default</option>
          <option value="name">Sort: Name A–Z</option>
          <option value="price-asc">Sort: Price Low–High</option>
          <option value="price-desc">Sort: Price High–Low</option>
        </select>
      </div>

      <div className="products-categories">
        {allCategories.map((cat) => (
          <button
            key={cat}
            className={`cat-pill${activeCategory === cat ? ' cat-pill-active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filtered.length === 0 ? (
        <p className="admin-empty">No products match your search.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAddToCart} />
          ))}
        </div>
      )}
    </section>
  );
}

function CartPage({ cart, onIncrease, onDecrease, onRemove, onCheckout }: {
  cart: CartEntry[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => Promise<void>;
}) {
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const subtotal = cart.reduce((sum, { product, qty }) => sum + Number(product.price.replace(/[^\d.]/g, '')) * qty, 0);
  const delivery = cart.length ? 40 : 0;
  const total = subtotal + delivery;

  const handlePlace = async () => {
    setPlacing(true);
    await onCheckout();
    const orderId = `#ORD-${Date.now().toString().slice(-6)}`;
    setConfirmed(orderId);
    setPlacing(false);
  };

  if (confirmed) {
    return (
      <section className="page-panel">
        <div className="order-confirmed">
          <div className="order-confirmed-icon">✅</div>
          <h2>Order Placed!</h2>
          <p>Your order <strong>{confirmed}</strong> has been placed successfully and is now being processed.</p>
          <div className="order-confirmed-actions">
            <button className="primary-button" onClick={() => { setConfirmed(null); navigate('/orders'); }}>View Order History</button>
            <button className="secondary-button" onClick={() => { setConfirmed(null); navigate('/products'); }}>Continue Shopping</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-panel cart-page">
      <div className="page-header">
        <span className="eyebrow">Cart</span>
        <h2>Your shopping cart</h2>
        <p>Review items, update quantities, and complete checkout with confidence.</p>
      </div>
      {cart.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty. Add a few fresh items to get started.</p>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-list">
            {cart.map((entry) => (
              <CartItem key={entry.product.id} entry={entry} onIncrease={onIncrease} onDecrease={onDecrease} onRemove={onRemove} />
            ))}
          </div>
          <aside className="cart-summary">
            <div className="cart-summary-panel">
              <h3>Order summary</h3>
              {cart.map(({ product, qty }) => (
                <div key={product.id} className="summary-row" style={{ fontSize: '0.9rem' }}>
                  <span>{product.name} × {qty}</span>
                  <span>₹{(Number(product.price.replace(/[^\d.]/g, '')) * qty).toFixed(0)}</span>
                </div>
              ))}
              <div className="summary-row" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span>₹{delivery.toFixed(0)}</span>
              </div>
              <div className="summary-row total-row">
                <strong>Total</strong>
                <strong>₹{total.toFixed(0)}</strong>
              </div>
              <button type="button" className="primary-button full-width" onClick={handlePlace} disabled={placing}>
                {placing ? 'Placing order...' : 'Place Order'}
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function AboutPage() {
  return (
    <section className="page-panel">
      <div className="page-header">
        <span className="eyebrow">About us</span>
        <h2>Local grocery with premium convenience</h2>
        <p>We bring fresh ingredients and household staples to your door with speed and care.</p>
      </div>
      <div className="about-grid">
        <article className="info-card">
          <h3>Our mission</h3>
          <p>Deliver quality groceries, support local farms, and make healthy food accessible to busy families.</p>
        </article>
        <article className="info-card">
          <h3>Our promise</h3>
          <p>Freshness first, friendly service, and reliable delivery when you need it most.</p>
        </article>
        <article className="info-card">
          <h3>Our customers</h3>
          <p>We build grocery routines around your life with curated selections and smart weekly deals.</p>
        </article>
      </div>
    </section>
  );
}

function ContactPage() {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    alert(data.message || 'Message submitted.');
    if (response.ok) {
      form.reset();
    }
  };

  return (
    <section className="page-panel contact-page">
      <div className="page-header">
        <span className="eyebrow">Contact</span>
        <h2>Get in touch</h2>
        <p>Need help with an order? Our support team is ready to help you find fresh groceries fast.</p>
      </div>
      <div className="contact-grid">
        <div className="info-card contact-info">
          <h3>Contact details</h3>
          <p>support@fsdgrocery.com</p>
          <p>+1 (800) 555-0192</p>
          <p>Open Monday–Friday, 8am–8pm</p>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" type="text" placeholder="Your name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            Message
            <textarea name="message" placeholder="How can we help you?" rows={6} required />
          </label>
          <button type="submit" className="primary-button full-width">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('user@grocery.com');
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setProductsLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Could not load product list.');
        }
        const data = await response.json();
        setProducts(data);
        setProductsError(null);
      } catch (error) {
        // MongoDB/backend may be down; keep the UI working with local seed data
        // NOTE: this uses the same Product shape as the backend.
        setProductsError(error instanceof Error ? error.message : 'Unknown error');
        setProducts((await import('./data')).featuredProducts);
      } finally {
        setProductsLoading(false);
      }
    }


    fetchProducts();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Login failed.');
        return false;
      }

      if (data.role === 'admin') {
        window.location.href = '/admin.html';
        return false;
      }

      setIsLoggedIn(true);
      setUserEmail(data.user?.email || 'user@grocery.com');
      return true;
    } catch (error) {
      alert('Unable to login. Please try again later.');
      return false;
    }
  };

  const handleSocialLogin = async () => {
    await handleLogin('user@grocery.com', 'password123');
  };

  const handleLogout = () => setIsLoggedIn(false);
  const handleAddToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((e) => e.product.id === product.id);
      if (existing) return current.map((e) => e.product.id === product.id ? { ...e, qty: e.qty + 1 } : e);
      return [...current, { product, qty: 1 }];
    });
    alert(`${product.name} added to cart.`);
  };

  const handleIncrease = (id: string) => setCart((c) => c.map((e) => e.product.id === id ? { ...e, qty: e.qty + 1 } : e));

  const handleDecrease = (id: string) => setCart((c) =>
    c.map((e) => e.product.id === id ? { ...e, qty: e.qty - 1 } : e).filter((e) => e.qty > 0)
  );

  const handleRemoveFromCart = (id: string) => setCart((c) => c.filter((e) => e.product.id !== id));

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const subtotal = cart.reduce((sum, { product, qty }) => sum + Number(product.price.replace(/[^\d.]/g, '')) * qty, 0);
    const order = {
      email: userEmail,
      id: `#ORD-${Date.now().toString().slice(-6)}`,
      items: cart.map((e) => `${e.product.name}${e.qty > 1 ? ` ×${e.qty}` : ''}`),
      total: `₹${(subtotal + 40).toFixed(0)}`,
      status: 'Processing',
    };
    try { await fetch('/api/user/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }); } catch {}
    setCart([]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} onSocialLogin={handleSocialLogin} />}
        />
        <Route path="/" element={<ProtectedLayout isLoggedIn={isLoggedIn} onLogout={handleLogout} cartCount={cart.reduce((s, e) => s + e.qty, 0)} />}>
          <Route index element={<HomePage onAddToCart={handleAddToCart} products={products} loading={productsLoading} error={productsError} />} />
          <Route path="products" element={<ProductsPage onAddToCart={handleAddToCart} products={products} loading={productsLoading} error={productsError} />} />
          <Route path="cart" element={<CartPage cart={cart} onIncrease={handleIncrease} onDecrease={handleDecrease} onRemove={handleRemoveFromCart} onCheckout={handleCheckout} />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="profile" element={<ProfilePage email={userEmail} />} />
          <Route path="orders" element={<OrderHistoryPage email={userEmail} />} />
          <Route path="addresses" element={<SavedAddressesPage email={userEmail} />} />
          <Route path="payments" element={<PaymentMethodsPage email={userEmail} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedLayout({
  isLoggedIn,
  onLogout,
  cartCount,
}: {
  isLoggedIn: boolean;
  onLogout: () => void;
  cartCount: number;
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleLogoutClick = () => {
    setIsProfileOpen(false);
    onLogout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="site-header nav-header">
        <div className="nav-brand">
          <span className="brand-chip">Grocery</span>
          <p className="site-slogan">Daily essentials, fresh and fast.</p>
        </div>
        <nav className="site-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link${isActive ? ' active-link' : ''}`}>
              {item.label}
              {item.to === '/cart' && cartCount > 0 && (
                <span className="nav-cart-bubble">{cartCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="nav-controls">
          <div className="profile-menu">
            <button type="button" className="profile-button" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <span className="profile-avatar">👤</span>
              <span className="profile-label">Account</span>
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-avatar-large">👤</div>
                  <div>
                    <p className="profile-name">Sarah Johnson</p>
                    <p className="profile-email">sarah@example.com</p>
                  </div>
                </div>
                <nav className="profile-nav">
                  <button type="button" className="profile-link" onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}>My Profile</button>
                  <button type="button" className="profile-link" onClick={() => { navigate('/orders'); setIsProfileOpen(false); }}>Order History</button>
                  <button type="button" className="profile-link" onClick={() => { navigate('/addresses'); setIsProfileOpen(false); }}>Saved Addresses</button>
                  <button type="button" className="profile-link" onClick={() => { navigate('/payments'); setIsProfileOpen(false); }}>Payment Methods</button>
                </nav>
                <button type="button" className="profile-logout" onClick={handleLogoutClick}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="page-shell">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div>
          <h3>FSD Grocery Store</h3>
          <p>Modern grocery shopping with fresh ingredients, premium savings, and local delivery.</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Shop</strong>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/cart">Cart</NavLink>
            <NavLink to="/about">About</NavLink>
          </div>
          <div>
            <strong>Support</strong>
            <a href="#">Orders</a>
            <a href="#">Delivery</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
