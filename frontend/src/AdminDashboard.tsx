import { FormEvent, useEffect, useState } from 'react';
import { Product } from './data';

type User = { email: string; name: string; phone?: string };

const emptyProduct = (): Omit<Product, 'id'> & { id: string } => ({
  id: '', name: '', category: '', price: '', badge: '', description: '', image: '',
});

const emptyUser = (): User => ({ email: '', name: '', phone: '' });

export default function AdminDashboard() {
  const [tab, setTab] = useState<'products' | 'users'>('products');

  // ── Products state ──
  const [products, setProducts] = useState<Product[]>([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodSearch, setProdSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showProdForm, setShowProdForm] = useState(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [prodForm, setProdForm] = useState(emptyProduct());

  // ── Users state ──
  const [users, setUsers] = useState<User[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserEmail, setEditingUserEmail] = useState<string | null>(null);
  const [userForm, setUserForm] = useState(emptyUser());

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then((d) => { if (Array.isArray(d)) setProducts(d); }).finally(() => setProdLoading(false));
    fetch('/api/admin/users').then((r) => r.json()).then((d) => { if (Array.isArray(d)) setUsers(d); }).finally(() => setUserLoading(false));
  }, []);

  // ── Product handlers ──
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase()) &&
    (filterCategory === 'All' || p.category === filterCategory)
  );

  async function handleProdSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingProdId) {
      await fetch(`/api/products/${editingProdId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(prodForm) });
      setProducts((prev) => prev.map((p) => p.id === editingProdId ? { ...prodForm } : p));
    } else {
      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(prodForm) });
      const created = await res.json();
      setProducts((prev) => [...prev, created]);
    }
    setShowProdForm(false);
  }

  async function handleProdDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  // ── User handlers ──
  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  async function handleUserSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingUserEmail) {
      await fetch(`/api/admin/users/${encodeURIComponent(editingUserEmail)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userForm) });
      setUsers((prev) => prev.map((u) => u.email === editingUserEmail ? { ...userForm } : u));
    } else {
      const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userForm) });
      const created = await res.json();
      setUsers((prev) => [...prev, created]);
    }
    setShowUserForm(false);
  }

  async function handleUserDelete(email: string) {
    if (!confirm(`Delete user ${email}?`)) return;
    await fetch(`/api/admin/users/${encodeURIComponent(email)}`, { method: 'DELETE' });
    setUsers((prev) => prev.filter((u) => u.email !== email));
  }

  const stats = [
    { label: 'Total Products', value: products.length, icon: '🛒', color: 'stat-green' },
    { label: 'Categories', value: categories.length - 1, icon: '📦', color: 'stat-blue' },
    { label: 'Total Users', value: users.length, icon: '👥', color: 'stat-teal' },
    { label: 'Active Users', value: users.length, icon: '✅', color: 'stat-amber' },
  ];

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div>
          <span className="eyebrow">Admin</span>
          <h2 className="admin-title">Dashboard</h2>
        </div>
        <button className="primary-button" onClick={() => {
          if (tab === 'products') { setProdForm(emptyProduct()); setEditingProdId(null); setShowProdForm(true); }
          else { setUserForm(emptyUser()); setEditingUserEmail(null); setShowUserForm(true); }
        }}>
          + Add {tab === 'products' ? 'Product' : 'User'}
        </button>
      </div>

      <div className="admin-stats">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <span className="stat-icon">{s.icon}</span>
            <div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab${tab === 'products' ? ' admin-tab-active' : ''}`} onClick={() => setTab('products')}>🛒 Products</button>
        <button className={`admin-tab${tab === 'users' ? ' admin-tab-active' : ''}`} onClick={() => setTab('users')}>👥 Users</button>
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div className="admin-table-panel">
          <div className="admin-table-toolbar">
            <input className="admin-search" placeholder="Search products..." value={prodSearch} onChange={(e) => setProdSearch(e.target.value)} />
            <select className="admin-filter" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          {prodLoading ? <p className="admin-empty">Loading...</p> : filteredProducts.length === 0 ? <p className="admin-empty">No products found.</p> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Badge</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td><div className="admin-thumb" style={{ backgroundImage: `url(${p.image})` }} /></td>
                      <td className="admin-name">{p.name}</td>
                      <td><span className="admin-badge">{p.category}</span></td>
                      <td className="admin-price">{p.price}</td>
                      <td>{p.badge && <span className="product-tag">{p.badge}</span>}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-edit-btn" onClick={() => { setProdForm({ ...p }); setEditingProdId(p.id); setShowProdForm(true); }}>Edit</button>
                          <button className="admin-delete-btn" onClick={() => handleProdDelete(p.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="admin-table-panel">
          <div className="admin-table-toolbar">
            <input className="admin-search" placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
          </div>
          {userLoading ? <p className="admin-empty">Loading...</p> : filteredUsers.length === 0 ? <p className="admin-empty">No users found.</p> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.email}>
                      <td className="admin-name">{u.name || '—'}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || '—'}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-edit-btn" onClick={() => { setUserForm({ email: u.email, name: u.name || '', phone: u.phone || '' }); setEditingUserEmail(u.email); setShowUserForm(true); }}>Edit</button>
                          <button className="admin-delete-btn" onClick={() => handleUserDelete(u.email)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Product Form Modal */}
      {showProdForm && (
        <div className="admin-modal-overlay" onClick={() => setShowProdForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingProdId ? 'Edit Product' : 'Add Product'}</h3>
            <form className="admin-form" onSubmit={handleProdSubmit}>
              {(['id', 'name', 'category', 'price', 'badge', 'image'] as const).map((field) => (
                <label key={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  <input value={prodForm[field]} onChange={(e) => setProdForm((f) => ({ ...f, [field]: e.target.value }))}
                    required={field !== 'badge'} disabled={field === 'id' && !!editingProdId} placeholder={field === 'image' ? 'https://...' : ''} />
                </label>
              ))}
              <label>Description<textarea rows={3} value={prodForm.description} onChange={(e) => setProdForm((f) => ({ ...f, description: e.target.value }))} required /></label>
              <div className="admin-form-actions">
                <button type="button" className="secondary-button" onClick={() => setShowProdForm(false)}>Cancel</button>
                <button type="submit" className="primary-button">{editingProdId ? 'Save Changes' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {showUserForm && (
        <div className="admin-modal-overlay" onClick={() => setShowUserForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingUserEmail ? 'Edit User' : 'Add User'}</h3>
            <form className="admin-form" onSubmit={handleUserSubmit}>
              <label>Full Name<input value={userForm.name} onChange={(e) => setUserForm((f) => ({ ...f, name: e.target.value }))} required /></label>
              <label>Email<input type="email" value={userForm.email} onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))} required disabled={!!editingUserEmail} /></label>
              <label>Phone<input value={userForm.phone || ''} onChange={(e) => setUserForm((f) => ({ ...f, phone: e.target.value }))} /></label>
              {!editingUserEmail && <label>Password<input type="password" onChange={(e) => setUserForm((f) => ({ ...f, password: e.target.value } as any))} required /></label>}
              <div className="admin-form-actions">
                <button type="button" className="secondary-button" onClick={() => setShowUserForm(false)}>Cancel</button>
                <button type="submit" className="primary-button">{editingUserEmail ? 'Save Changes' : 'Add User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
