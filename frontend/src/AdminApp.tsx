import AdminDashboard from './AdminDashboard';
import './styles.css';

export default function AdminApp() {
  return (
    <div className="app-shell">
      <header className="nav-header" style={{ marginBottom: '1.5rem' }}>
        <div className="nav-brand">
          <span className="brand-chip">🛡️ Admin Panel</span>
          <p className="site-slogan">FSD Grocery Store Management</p>
        </div>
        <div className="nav-controls">
          <a href="/" className="secondary-button" style={{ borderRadius: '9999px', padding: '0.65rem 1.25rem', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Store
          </a>
        </div>
      </header>
      <AdminDashboard />
    </div>
  );
}
