# OneKart - Organic Marketplace

OneKart is a full-stack e-commerce platform connecting farmers with customers.

## 🚀 Running Locally (Developer Mode)
1. Ensure **XAMPP** (Apache & MySQL) is running.
2. Open terminal in `onekart-frontend/`.
3. Run `npm start`.
4. App opens at `http://localhost:3000`.

## 🌍 Deployment Guide (Free Hosting)
Since this is a **PHP + MySQL** application, the best free deployment option is **InfinityFree** or **000webhost**.

### 1. Database Setup (Production)
1. Create a MySQL database on your hosting panel.
2. Import `database/onekart_schema.sql` via phpMyAdmin.
3. Edit `onekart/config/Database.php` with your **new hosting credentials** (Host, DB Name, User, Password).

### 2. File Upload
1. Upload the **entire** contents of the `OneKart` folder to the `public_html` or `htdocs` folder on your host.
2. **Note**: On the server, you do **not** run `npm start`. The built-in PHP router (`index.php`) will handle everything automatically.

## 📁 Project Structure
- **/onekart**: Backend APIs (PHP)
- **/onekart-frontend**: Frontend UI (HTML/JS)
- **/database**: SQL Schema
