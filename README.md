# Kheti Khata — Farm Management System

A MERN-stack website for farmers to track crop production, expenses, equipment, and income, with a dashboard of charts and multi-user login.

## Stack
- **Frontend:** React (Vite) + Tailwind CSS + React Router + Recharts + Axios
- **Backend:** Node.js + Express + MongoDB (Mongoose) + JWT auth + Multer (file uploads)

## Folder structure
```
farm-management-system/
├── backend/
│   ├── models/        # User, Crop, Expense, Income, Equipment
│   ├── routes/        # auth, crops, expenses, income, equipment, dashboard
│   ├── middleware/     # auth (JWT), upload (multer)
│   ├── uploads/        # receipt/invoice files land here
│   └── server.js
└── frontend/
    └── src/
        ├── pages/       # Login, Register, Dashboard, Crops, Expenses, Income, Equipment
        ├── components/  # Layout (sidebar), StatCard, ProtectedRoute
        ├── context/     # AuthContext
        └── utils/api.js # axios instance with JWT interceptor
```

## Setup

### 1. MongoDB
Use a local MongoDB instance or a free MongoDB Atlas cluster. You just need a connection string.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI and a random JWT_SECRET
npm run dev
```
Runs on `http://localhost:5000`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` and proxies `/api` and `/uploads` to the backend (see `vite.config.js`).

### 4. Use it
Open `http://localhost:5173`, register a farmer account, and start logging crops, expenses, income, and equipment. The dashboard charts populate automatically as you add entries.

## Notes for extending this
- **Auth:** JWT stored in `localStorage`; every farmer only ever sees their own records (enforced server-side by filtering on `user: req.userId` in every route).
- **File uploads:** receipts/invoices are stored on local disk under `backend/uploads/` and served statically. For production, swap `multer.diskStorage` for an S3-compatible bucket.
- **Charts:** `/api/dashboard/summary` does the aggregation (MongoDB `$group`/`$match` pipelines) so the frontend just renders what it's given — extend that route if you want more breakdowns.
- **Validation:** current validation is minimal (Mongoose schema-level). Add stricter checks (e.g. `express-validator`) before treating this as production-ready.
- **Deployment:** frontend can go to Vercel/Netlify; backend to Render/Railway; MongoDB Atlas for the database. Update `CLIENT_URL` in backend `.env` and the API base URL in the frontend accordingly.
