const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { getDb, getMongoClient } = require('./db');

const app = express();
const port = process.env.PORT || 4174;

app.use(cors());
app.use(express.json());

let db = null;

const fallbackProducts = [
  { id: 'apple', name: 'Organic Fuji Apples', category: 'Fruits', price: '₹419 / kg', badge: 'Best Seller', description: 'Crisp, sweet, and locally sourced apples for salads and snacks.', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80' },
  { id: 'banana', name: 'Ripe Bananas', category: 'Fruits', price: '₹49 / dozen', badge: 'New', description: 'Naturally sweet bananas, great for smoothies, baking, or a quick snack.', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80' },
  { id: 'strawberry', name: 'Fresh Strawberries', category: 'Fruits', price: '₹199 / punnet', badge: 'Seasonal', description: 'Juicy, sun-ripened strawberries perfect for desserts and jams.', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80' },
  { id: 'spinach', name: 'Fresh Baby Spinach', category: 'Vegetables', price: '₹59 / bag', badge: 'Farm Fresh', description: 'Tender greens perfect for smoothies, salads, and sautés.', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80' },
  { id: 'carrot', name: 'Organic Carrots', category: 'Vegetables', price: '₹79 / kg', badge: 'Organic', description: 'Crunchy and sweet carrots, ideal for snacking, soups, and roasting.', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80' },
  { id: 'broccoli', name: 'Fresh Broccoli', category: 'Vegetables', price: '₹89 / head', badge: 'Farm Fresh', description: 'Nutrient-packed broccoli florets, great for stir-fries and steaming.', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80' },
  { id: 'milk', name: 'Almond Milk', category: 'Dairy', price: '₹249 / carton', badge: 'Vegan', description: 'Creamy, unsweetened almond milk for coffee, cereals, and cooking.', image: 'https://images.unsplash.com/photo-1551854838-3c4ef6d7b7f3?auto=format&fit=crop&w=800&q=80' },
  { id: 'cheddar', name: 'Sharp Cheddar Cheese', category: 'Dairy', price: '₹459 / block', badge: 'Aged', description: 'Rich, bold cheddar aged for maximum flavor. Perfect for sandwiches and melting.', image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=800&q=80' },
  { id: 'yogurt', name: 'Greek Yogurt', category: 'Dairy', price: '₹169 / cup', badge: 'High Protein', description: 'Thick and creamy Greek yogurt packed with protein and probiotics.', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80' },
  { id: 'sourdough', name: 'Sourdough Bread', category: 'Bakery', price: '₹379 / loaf', badge: 'Freshly Baked', description: 'Artisan sourdough with a crispy crust and chewy interior, baked fresh daily.', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=800&q=80' },
  { id: 'granola', name: 'Honey Oat Granola', category: 'Snacks', price: '₹589 / bag', badge: 'Wholesome', description: 'Crunchy granola with honey, oats, and almonds. Great with yogurt or milk.', image: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=800&q=80' },
  { id: 'almonds', name: 'Roasted Almonds', category: 'Snacks', price: '₹749 / bag', badge: 'Keto Friendly', description: 'Lightly salted roasted almonds, a satisfying and nutritious snack.', image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80' },
];

// ── Routes ──────────────────────────────────────────────

app.get('/api/products', async (req, res) => {
  if (!db) return res.json(fallbackProducts);
  try {
    const products = await db.collection('products').find({}).toArray();
    res.json(products.map(({ id, name, category, price, badge, description, image }) => ({ id, name, category, price, badge, description, image })));
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    await db.collection('products').insertOne(req.body);
    res.json(req.body);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    await db.collection('products').updateOne({ id: req.params.id }, { $set: req.body });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    await db.collection('products').deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
});

// ── Admin User Management ────────────────────────────────

app.get('/api/admin/users', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const users = await db.collection('users').find({}, { projection: { password: 0, _id: 0 } }).toArray();
    res.json(users);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch users' }); }
});

app.post('/api/admin/users', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { email, name, phone, password } = req.body;
    const existing = await db.collection('users').findOne({ email });
    if (existing) return res.status(409).json({ error: 'User already exists' });
    await db.collection('users').insertOne({ email, name, phone, password });
    res.json({ email, name, phone });
  } catch (err) { res.status(500).json({ error: 'Failed to create user' }); }
});

app.put('/api/admin/users/:email', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { name, phone } = req.body;
    await db.collection('users').updateOne({ email: req.params.email }, { $set: { name, phone } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Failed to update user' }); }
});

app.delete('/api/admin/users/:email', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    await db.collection('users').deleteOne({ email: req.params.email });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Failed to delete user' }); }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Check admin credentials first
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true, role: 'admin', user: { name: 'Admin', email } });
  }

  // Check demo user instantly without DB
  if (email === 'user@grocery.com' && password === 'password123') {
    return res.json({ success: true, role: 'user', user: { name: 'Sarah Johnson', email: 'user@grocery.com' } });
  }

  if (!db) {
    return res.status(503).json({ success: false, message: 'Database unavailable. Please try again later.' });
  }

  try {
    const user = await db.collection('users').findOne({ email, password });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return res.json({ success: true, role: 'user', user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ success: false, message: 'Login failed due to server error.' });
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all contact fields.' });
  }
  console.log('Contact request received:', { name, email, message });
  res.json({ success: true, message: 'Thanks! Your message has been received.' });
});

// ── Profile ──────────────────────────────────────────────

app.get('/api/user/profile', async (req, res) => {
  const { email } = req.query;
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const user = await db.collection('users').findOne({ email }, { projection: { password: 0, _id: 0 } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch profile' }); }
});

app.put('/api/user/profile', async (req, res) => {
  const { email, name, phone } = req.body;
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    await db.collection('users').updateOne({ email }, { $set: { name, phone } }, { upsert: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Failed to update profile' }); }
});

// ── Orders ───────────────────────────────────────────────

app.get('/api/user/orders', async (req, res) => {
  const { email } = req.query;
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const orders = await db.collection('orders').find({ email }).sort({ date: -1 }).toArray();
    res.json(orders.map(({ _id, ...o }) => o));
  } catch (err) { res.status(500).json({ error: 'Failed to fetch orders' }); }
});

app.post('/api/user/orders', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const order = { ...req.body, date: new Date().toISOString() };
    await db.collection('orders').insertOne(order);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Failed to save order' }); }
});

// ── Addresses ────────────────────────────────────────────

app.get('/api/user/addresses', async (req, res) => {
  const { email } = req.query;
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const doc = await db.collection('addresses').findOne({ email });
    res.json(doc?.addresses || []);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch addresses' }); }
});

app.post('/api/user/addresses', async (req, res) => {
  const { email, address } = req.body;
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const id = Date.now().toString();
    await db.collection('addresses').updateOne({ email }, { $push: { addresses: { ...address, id } } }, { upsert: true });
    res.json({ success: true, id });
  } catch (err) { res.status(500).json({ error: 'Failed to add address' }); }
});

app.delete('/api/user/addresses/:id', async (req, res) => {
  const { email } = req.body;
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    await db.collection('addresses').updateOne({ email }, { $pull: { addresses: { id: req.params.id } } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Failed to delete address' }); }
});

// ── Payment Methods ──────────────────────────────────────

app.get('/api/user/payments', async (req, res) => {
  const { email } = req.query;
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const doc = await db.collection('payments').findOne({ email });
    res.json(doc?.cards || []);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch payments' }); }
});

app.post('/api/user/payments', async (req, res) => {
  const { email, card } = req.body;
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const id = Date.now().toString();
    await db.collection('payments').updateOne({ email }, { $push: { cards: { ...card, id } } }, { upsert: true });
    res.json({ success: true, id });
  } catch (err) { res.status(500).json({ error: 'Failed to add card' }); }
});

app.delete('/api/user/payments/:id', async (req, res) => {
  const { email } = req.body;
  if (!db) return res.status(503).json({ error: 'Database unavailable' });
  try {
    await db.collection('payments').updateOne({ email }, { $pull: { cards: { id: req.params.id } } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Failed to delete card' }); }
});

// ── Start ────────────────────────────────────────────────

const server = app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Set a different PORT in .env`);
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});

// Connect to MongoDB in the background — server is already accepting requests
getDb().then((database) => {
  db = database;
  console.log('Connected to MongoDB.');
}).catch((err) => {
  db = null;
  console.error('MongoDB connection failed:', err?.message || err);
});

// ── Shutdown ─────────────────────────────────────────────

async function shutdown() {
  try {
    const client = await getMongoClient();
    await client.close();
  } catch {
    // ignore
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
