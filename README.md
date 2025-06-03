# DERMATIQUE 🧴✨

## 📸 Screenshots

### Homepage
![Homepage](./Screenshots/Screenshot%202025-06-02%20at%204.38.03 PM.png)

### Fastshop homepage
![fastshop homepage](./Screenshots/Screenshot%202025-06-02%20at%204.38.21 PM.png)

### Signup page
![Signup page](./Screenshots/Screenshot%202025-06-02%20at%204.39.45 PM.png)

### SignIn Page
![SignIn Page](./Screenshots/Screenshot%202025-06-02%20at%204.40.01 PM.png)

### Opened Empty
![Opened Empty](./Screenshots/Screenshot%202025-06-02%20at%204.40.20 PM.png)

### Shop page
![Shop page](./Screenshots/Screenshot%202025-06-02%20at%204.40.43 PM.png)

### Search suggestions inshop page
![Search suggestions inshop page](./Screenshots/Screenshot%202025-06-02%20at%204.40.54 PM.png)

### Sign in with Google
![Sign in with Google](./Screenshots/Screenshot%202025-06-02%20at%204.42.17 PM.png)

### Account settings with fill address options 
![Account settings with fill options ](./Screenshots/Screenshot%202025-06-02%20at%204.42.55 PM.png)

### Cart Drawer with Items (control buttons number, delete items order summary)
![Drawer with cart](./Screenshots/Screenshot%202025-06-02%20at%204.45.00 PM.png)

### CheckoutPage with order summary and Paypal payment
![CheckoutPage with order summary and Paypal payment](./Screenshots/Screenshot%202025-06-02%20at%204.45.25 PM.png)

### Paypal payment
![Paypal payment](./Screenshots/Screenshot%202025-06-02%20at%204.46.23 PM.png)

### Order history
![Order history](./Screenshots/Screenshot%202025-06-02%20at%204.47.39 PM.png)

### Responsive for different screens
![Homepage](./Screenshots/Screenshot%202025-06-02%20at%205.21.59 PM.png)
![Homepage](./Screenshots/Screenshot%202025-06-02%20at%205.22.49 PM.png)
![Homepage](./Screenshots/Screenshot%202025-06-02%20at%205.23.19 PM.png)
![Homepage](./Screenshots/Screenshot%202025-06-02%20at%205.23.36 PM.png)

**A Premium Skincare & Cosmetics E-commerce Platform**


## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

DERMATIQUE is a full-stack e-commerce platform specializing in premium skincare and cosmetics products. The platform offers a seamless shopping experience with modern UI/UX design, secure payment processing, and comprehensive user management features.

## ✨ Features

### 🛒 **E-commerce Core**
- Product catalog with detailed descriptions and images
- Advanced search functionality with real-time suggestions
- Shopping cart management with add/remove/update quantities
- Secure checkout process with order summary
- Order history and tracking

### 👤 **User Management**
- User registration and authentication
- Google OAuth integration for seamless login
- Email verification system
- User profile management with delivery address
- Account deletion option
- Secure session management with JWT

### 💳 **Payment Integration**
- PayPal payment gateway integration
- Secure payment processing
- Order confirmation and receipts
- Payment method preferences

### 🎨 **UI/UX Features**
- Responsive design for all devices
- Modern drawer-based navigation
- Real-time search with suggestions dropdown
- Shopping bag drawer with live updates
- Clean, minimalist design aesthetic
- Ant Design component library integration

### 🔧 **Technical Features**
- RESTful API architecture
- MongoDB database with Mongoose ODM
- JWT-based authentication
- Password encryption with bcrypt
- CORS enabled for cross-origin requests
- Request logging with Morgan
- Security headers with Helmet
- Graceful server shutdown handling

## 🛠 Tech Stack

### **Frontend**
- **React 18.3.1** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Ant Design (antd)** - Enterprise-class UI components
- **Material-UI (@mui/material)** - React component library
- **Styled Components** - CSS-in-JS styling
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcrypt** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### **Payment & Authentication**
- **PayPal React SDK** - Payment processing
- **Google OAuth** - Social authentication
- **Resend** - Email service integration
- **Crypto-JS** - Cryptographic functions

### **Development Tools**
- **ESLint** - Code linting
- **Nodemon** - Development server auto-restart
- **Autoprefixer** - CSS vendor prefixing
- **PostCSS** - CSS processing

## 📁 Project Structure

```
DERMATIQUE/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authenticationController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   ├── productController.js
│   │   │   ├── searchController.js
│   │   │   ├── updateProductKeywords.js
│   │   │   └── userController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── Cart.js
│   │   │   ├── Order.js
│   │   │   ├── Product.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authenticationRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── productsRoutes.js
│   │   │   ├── searchRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── utils/
│   │   │   └── validators.js
│   │   └── app.js
│   ├── .env
│   ├── importProducts.js
│   ├── package.json
│   └── products.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js
│   │   ├── assets/
│   │   ├── css/
│   │   ├── dashboard/
│   │   ├── home-Page/
│   │   ├── CheckoutPage/
│   │   ├── Navbars/
│   │   ├── hooks/
│   │   ├── providers/
│   │   ├── reducers/
│   │   ├── saloon components/
│   │   ├── shop components/
│   │   ├── stories component/
│   │   └── utils/
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/dermatique.git
cd dermatique
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=4000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RESEND_API_KEY=your_resend_api_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:4000/api
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 4. Database Setup
Import sample products (if available):
```bash
cd backend
node importProducts.js
```

### 5. Run the Application

**Start Backend Server:**
```bash
cd backend
npm run dev
```

**Start Frontend Development Server:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `CLIENT_URL` | Frontend application URL | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `RESEND_API_KEY` | Email service API key | Yes |
| `PAYPAL_CLIENT_ID` | PayPal application client ID | Yes |
| `PAYPAL_CLIENT_SECRET` | PayPal application secret | Yes |

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_PAYPAL_CLIENT_ID` | PayPal client ID for frontend | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |

## 🛣 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/google` - Google OAuth login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/search` - Search products with suggestions

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

### Payment
- `POST /api/paypal/create-order` - Create PayPal order
- `POST /api/paypal/capture-order` - Capture PayPal payment

## 📱 Screenshots

### Home Page
- Clean, minimalist design with hero section
- "Buy Better, Not More" philosophy
- Featured products showcase

### Authentication
- Email/password registration and login
- Google OAuth integration
- Password security features

### Shopping Experience
- Product catalog with search functionality
- Real-time search suggestions
- Shopping cart with quantity management
- Secure checkout with PayPal integration

### User Dashboard
- Profile management
- Order history
- Delivery address management
- Account settings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Secure session management

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

- **Frontend Developer** - React, UI/UX Design
- **Backend Developer** - Node.js, API Development
- **Full Stack Developer** - Integration & Deployment

---

## 🚀 Deployment

### Production Build
```bash
# Frontend
npm run build

# Backend
npm start
```

### Environment Setup
Ensure all environment variables are properly configured for production deployment.

---


**DERMATIQUE** - Crafting the future of skincare e-commerce with premium quality and exceptional user experience. 🧴✨