# Grocery Store Backend

This is the backend API for the FSD Grocery Store application.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize the database:
   ```bash
   node init-db.js
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Database

The application uses SQLite with the following tables:

- `products`: Stores product information
- `users`: Stores user accounts

The database file `grocery.db` will be created automatically when you run `init-db.js`.

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/login` - User login
- `POST /api/contact` - Contact form submission

## Development

For development with auto-restart:
```bash
npm run dev
```