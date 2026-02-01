# OneKart - MERN Stack Migration

This project has been migrated from PHP to the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

- **backend/**: Node.js/Express API
  - `server.js`: Main entry point
  - `models/`: Mongoose models (User, Product, Order)
  - `routes/`: API routes (Auth, Products, Orders)
  - `.env`: Environment variables
- **frontend/**: React + Vite application
  - `src/pages/`: React components for pages
  - `src/context/`: State management (Auth)
  - `vite.config.js`: Configuration with API proxy
- **php_legacy/**: Archived PHP version of the project

## Prerequisites

1.  **Node.js**: Ensure Node.js is installed.
2.  **MongoDB**: Ensure MongoDB is running locally on port `27017` or update `backend/.env`.

## How to Run

### 1. Start the Backend

Open a terminal in the `backend` folder:

```bash
cd backend
npm install   # Install dependencies (only needed once)
npm run dev   # Start the server with Nodemon
```

 The server will start on `http://localhost:5000`.

### 2. Start the Frontend

Open a new terminal in the `frontend` folder:

```bash
cd frontend
npm install   # Install dependencies (only needed once)
npm run dev   # Start the React development server
```

Access the application at the URL provided (usually `http://localhost:5173`).

## Features Ported

-   **User Authentication**: Register (Customer/Farmer) and Login.
-   **Product Listing**: Homepage displays products from the database.
-   **Data Models**: Structured schemas for Users, Products, and Orders.
