export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  badge?: string;
  description: string;
  image: string;
}

export const categories = [
  { title: 'Fruits', accent: 'orange', icon: '🍎' },
  { title: 'Vegetables', accent: 'green', icon: '🥦' },
  { title: 'Dairy', accent: 'teal', icon: '🧀' },
  { title: 'Bakery', accent: 'amber', icon: '🍞' },
  { title: 'Snacks', accent: 'amber', icon: '🥜' },
];

export const featuredProducts: Product[] = [
  {
    id: 'apple',
    name: 'Organic Fuji Apples',
    category: 'Fruits',
    price: '₹419 / kg',
    badge: 'Best Seller',
    description: 'Crisp, sweet, and locally sourced apples for salads and snacks.',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'banana',
    name: 'Ripe Bananas',
    category: 'Fruits',
    price: '₹49 / dozen',
    badge: 'New',
    description: 'Naturally sweet bananas, great for smoothies, baking, or a quick snack.',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'strawberry',
    name: 'Fresh Strawberries',
    category: 'Fruits',
    price: '₹199 / punnet',
    badge: 'Seasonal',
    description: 'Juicy, sun-ripened strawberries perfect for desserts and jams.',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'spinach',
    name: 'Fresh Baby Spinach',
    category: 'Vegetables',
    price: '₹59 / bag',
    badge: 'Farm Fresh',
    description: 'Tender greens perfect for smoothies, salads, and sautés.',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'carrot',
    name: 'Organic Carrots',
    category: 'Vegetables',
    price: '₹79 / kg',
    badge: 'Organic',
    description: 'Crunchy and sweet carrots, ideal for snacking, soups, and roasting.',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'broccoli',
    name: 'Fresh Broccoli',
    category: 'Vegetables',
    price: '₹89 / head',
    badge: 'Farm Fresh',
    description: 'Nutrient-packed broccoli florets, great for stir-fries and steaming.',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'milk',
    name: 'Almond Milk',
    category: 'Dairy',
    price: '₹249 / carton',
    badge: 'Vegan',
    description: 'Creamy, unsweetened almond milk for coffee, cereals, and cooking.',
    image: 'https://images.unsplash.com/photo-1551854838-3c4ef6d7b7f3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cheddar',
    name: 'Sharp Cheddar Cheese',
    category: 'Dairy',
    price: '₹459 / block',
    badge: 'Aged',
    description: 'Rich, bold cheddar aged for maximum flavor. Perfect for sandwiches and melting.',
    image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'yogurt',
    name: 'Greek Yogurt',
    category: 'Dairy',
    price: '₹169 / cup',
    badge: 'High Protein',
    description: 'Thick and creamy Greek yogurt packed with protein and probiotics.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sourdough',
    name: 'Sourdough Bread',
    category: 'Bakery',
    price: '₹379 / loaf',
    badge: 'Freshly Baked',
    description: 'Artisan sourdough with a crispy crust and chewy interior, baked fresh daily.',
    image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'granola',
    name: 'Honey Oat Granola',
    category: 'Snacks',
    price: '₹589 / bag',
    badge: 'Wholesome',
    description: 'Crunchy granola with honey, oats, and almonds. Great with yogurt or milk.',
    image: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'almonds',
    name: 'Roasted Almonds',
    category: 'Snacks',
    price: '₹749 / bag',
    badge: 'Keto Friendly',
    description: 'Lightly salted roasted almonds, a satisfying and nutritious snack.',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
  },
];

export const deals = [
  {
    title: 'Weekly Fresh Picks',
    subtitle: 'Save up to 25% on seasonal produce and pantry essentials.',
    action: 'Shop Seasonal Savings',
  },
  {
    title: 'Quick Grocery Delivery',
    subtitle: 'Get fresh grocery orders delivered in under 60 minutes.',
    action: 'Start Shopping',
  },
];
