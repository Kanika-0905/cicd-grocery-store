# TODO - MongoDB integration

- [ ] Update `backend/package.json` to use `mongodb` dependency (remove sqlite3)
- [ ] Add `backend/.env.example` with MongoDB connection variables
- [ ] Add `backend/db.js` to manage a singleton MongoDB connection
- [ ] Rewrite `backend/server.js` to use MongoDB for `/api/products` and `/api/login`
- [ ] Rewrite `backend/init-db.js` as a MongoDB seeding script (idempotent)
- [ ] Run quick local verification steps (npm install, seed, start server, test endpoints)

