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

## Quick Start

The project is structured with a root orchestrator to make development easier.

1.  **Install everything**:
    ```bash
    npm run install-all
    ```
2.  **Seed the database** (Optional - if db is empty):
    ```bash
    npm run seed
    ```
3.  **Run both Frontend & Backend**:
    ```bash
    npm run dev
    ```

## Individual Service Commands

### Backend
Open a terminal in the `backend` folder:
- `npm run dev`: Start server with nodemon.
- `npm run data:import`: Reset and seed database with dummy data.

### Frontend
Open a terminal in the `frontend` folder:
- `npm run dev`: Start Vite development server.

## Features Ported

-   **User Authentication**: Register (Customer/Farmer) and Login.
-   **Product Listing**: Homepage displays products from the database.
-   **Data Models**: Structured schemas for Users, Products, and Orders.
