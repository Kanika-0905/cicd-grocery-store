import { FormEvent, useEffect, useState } from 'react';

// ── My Profile ───────────────────────────────────────────
export function ProfilePage({ email }: { email: string }) {
  const [form, setForm] = useState({ name: '', email, phone: '' });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/user/profile?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data) => { if (!data.error) setForm({ name: data.name || '', email: data.email || email, phone: data.phone || '' }); })
      .finally(() => setLoading(false));
  }, [email]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/user/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <section className="page-panel">
      <div className="page-header">
        <span className="eyebrow">Account</span>
        <h2>My Profile</h2>
        <p>Update your personal information and account details.</p>
      </div>
      {loading ? <p className="admin-empty">Loading...</p> : (
        <div className="profile-page-grid">
          <div className="profile-avatar-card">
            <div className="profile-avatar-xl">👤</div>
            <p className="profile-name">{form.name || 'User'}</p>
            <p className="profile-email">{form.email}</p>
            <span className="product-tag" style={{ marginTop: '0.5rem' }}>Member since 2024</span>
          </div>
          <form className="profile-form" onSubmit={handleSubmit}>
            <label>Full Name<input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required /></label>
            <label>Email Address<input type="email" value={form.email} disabled style={{ background: '#f1f5f9', color: '#94a3b8' }} /></label>
            <label>Phone Number<input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></label>
            <button type="submit" className="primary-button">{saved ? '✓ Saved!' : 'Save Changes'}</button>
          </form>
        </div>
      )}
    </section>
  );
}

// ── Order History ────────────────────────────────────────
type Order = { id: string; date: string; status: string; total: string; items: string[] };

export function OrderHistoryPage({ email }: { email: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/orders?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setOrders(data); })
      .finally(() => setLoading(false));
  }, [email]);

  return (
    <section className="page-panel">
      <div className="page-header">
        <span className="eyebrow">Account</span>
        <h2>Order History</h2>
        <p>View all your past orders and their status.</p>
      </div>
      {loading ? <p className="admin-empty">Loading...</p> : orders.length === 0 ? (
        <p className="admin-empty">No orders yet. Start shopping!</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <p className="order-id">{order.id}</p>
                  <p className="order-date">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="order-status">{order.status}</span>
                  <p className="order-total">{order.total}</p>
                </div>
              </div>
              <div className="order-items">
                {order.items.map((item) => <span key={item} className="order-item-chip">{item}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Saved Addresses ──────────────────────────────────────
type Address = { id: string; label: string; line1: string; city: string; zip: string };

export function SavedAddressesPage({ email }: { email: string }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: '', line1: '', city: '', zip: '' });

  useEffect(() => {
    fetch(`/api/user/addresses?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAddresses(data); })
      .finally(() => setLoading(false));
  }, [email]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/user/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, address: form }) });
    const data = await res.json();
    setAddresses((a) => [...a, { ...form, id: data.id }]);
    setForm({ label: '', line1: '', city: '', zip: '' });
    setShowForm(false);
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/user/addresses/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    setAddresses((a) => a.filter((x) => x.id !== id));
  };

  return (
    <section className="page-panel">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="eyebrow">Account</span>
          <h2>Saved Addresses</h2>
          <p>Manage your delivery addresses for faster checkout.</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(true)}>+ Add Address</button>
      </div>
      {loading ? <p className="admin-empty">Loading...</p> : addresses.length === 0 ? (
        <p className="admin-empty">No saved addresses yet.</p>
      ) : (
        <div className="address-grid">
          {addresses.map((addr) => (
            <div key={addr.id} className="address-card">
              <div className="address-label">{addr.label}</div>
              <p>{addr.line1}</p>
              <p>{addr.city} {addr.zip}</p>
              <button className="admin-delete-btn" style={{ marginTop: '0.75rem' }} onClick={() => handleRemove(addr.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Address</h3>
            <form className="admin-form" onSubmit={handleAdd}>
              <label>Label (e.g. Home)<input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} required /></label>
              <label>Street Address<input value={form.line1} onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))} required /></label>
              <label>City, State<input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} required /></label>
              <label>ZIP Code<input value={form.zip} onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))} required /></label>
              <div className="admin-form-actions">
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="primary-button">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Payment Methods ──────────────────────────────────────
type Card = { id: string; brand: string; last4: string; expiry: string };

export function PaymentMethodsPage({ email }: { email: string }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ brand: 'Visa', last4: '', expiry: '' });

  useEffect(() => {
    fetch(`/api/user/payments?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCards(data); })
      .finally(() => setLoading(false));
  }, [email]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/user/payments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, card: form }) });
    const data = await res.json();
    setCards((c) => [...c, { ...form, id: data.id }]);
    setForm({ brand: 'Visa', last4: '', expiry: '' });
    setShowForm(false);
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/user/payments/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    setCards((c) => c.filter((x) => x.id !== id));
  };

  return (
    <section className="page-panel">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="eyebrow">Account</span>
          <h2>Payment Methods</h2>
          <p>Manage your saved cards for quick and secure checkout.</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(true)}>+ Add Card</button>
      </div>
      {loading ? <p className="admin-empty">Loading...</p> : cards.length === 0 ? (
        <p className="admin-empty">No saved payment methods yet.</p>
      ) : (
        <div className="address-grid">
          {cards.map((card) => (
            <div key={card.id} className="payment-card">
              <div className="payment-card-top">
                <span className="payment-icon">💳</span>
                <span className="payment-brand">{card.brand}</span>
              </div>
              <p className="payment-number">•••• •••• •••• {card.last4}</p>
              <p className="payment-expiry">Expires {card.expiry}</p>
              <button className="admin-delete-btn" style={{ marginTop: '0.75rem' }} onClick={() => handleRemove(card.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Card</h3>
            <form className="admin-form" onSubmit={handleAdd}>
              <label>
                Card Brand
                <select value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} style={{ border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '0.85rem 1rem', font: 'inherit' }}>
                  <option>Visa</option>
                  <option>Mastercard</option>
                  <option>Amex</option>
                </select>
              </label>
              <label>Last 4 Digits<input maxLength={4} value={form.last4} onChange={(e) => setForm((f) => ({ ...f, last4: e.target.value }))} required /></label>
              <label>Expiry (MM/YY)<input placeholder="08/27" value={form.expiry} onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))} required /></label>
              <div className="admin-form-actions">
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="primary-button">Save Card</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
