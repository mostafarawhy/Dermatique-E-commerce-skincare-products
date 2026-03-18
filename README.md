# DERMATIQUE

**A full-stack e-commerce platform for premium skincare — with real payment processing, JWT authentication, Google OAuth, and persistent cart management across sessions.**

> React · Node.js · Express · MongoDB · PayPal · Vercel + Render

**Live Demo:** [dermatique-e-commerce-skincare-prod.vercel.app](https://dermatique-e-commerce-skincare-prod.vercel.app)

---

## Screenshots

### Homepage
![Homepage](./Screenshots/Screenshot%202025-06-02%20at%204.38.03 PM.png)

### Shop Page
![Shop page](./Screenshots/Screenshot%202025-06-02%20at%204.38.21 PM.png)

### Real-time Search Suggestions
![Search suggestions](./Screenshots//Screenshot%202025-06-02%20at%204.40.54 PM.png)

### Cart Drawer
![Cart Drawer](./Screenshots/Screenshot%202026-03-18%20at%209.57.57 PM.png)

### Checkout with PayPal
![Checkout](./Screenshots/Screenshot%202025-06-02%20at%204.45.25 PM.png)

### PayPal Payment Modal
![PayPal](./Screenshots/Screenshot%202025-06-02%20at%204.46.23 PM.png)

### Order History
![Order history](./Screenshots/Screenshot%202025-06-02%20at%204.47.39 PM.png)

### Account & Delivery Settings
![Account settings](./Screenshots/Screenshot%202025-06-02%20at%204.44.31 PM.png)

### Sign In with Google
![Google OAuth](./Screenshots/Screenshot%202025-06-02%20at%204.42.17 PM.png)

### Mobile Responsive
![Mobile](./Screenshots/Screenshot%202025-06-02%20at%205.21.59 PM.png)
![Mobile](./Screenshots/Screenshot%202025-06-02%20at%205.23.19 PM.png)
![Mobile](./Screenshots/Screenshot%202025-06-02%20at%205.23.36 PM.png)
![Mobile](./Screenshots/Screenshot%202025-06-02%20at%205.22.49 PM.png)


---

## Why I Built This

I wanted to build a complete production e-commerce experience — not a tutorial clone, but something that handles the real complexity: actual PayPal transactions, JWTs in HttpOnly cookies, Google OAuth with upsert logic, guest-to-authenticated cart merging, and order confirmation emails. The goal was to understand how all of these systems connect end-to-end, and to be forced to debug the problems that only show up in a real production environment — CORS misconfigurations, cookie sameSite issues, PayPal compliance violations, race conditions in cart state. Every piece of this was built, broken, and fixed from scratch.

---

## Features

### Product Catalog
Paginated product grid (12 per page) with category-based browsing. Products are stored in MongoDB with text indexes on name, description, category, and a keywords array for improved search recall.

### Debounced Real-Time Search with Suggestions
As users type in the search bar, a 300ms debounced request fires to `/api/search/suggestions`, returning the top 5 name/category matches rendered in an Ant Design AutoComplete dropdown. Full search supports filtering by category, price range (min/max), and sort order (price ascending/descending, newest, oldest). An AbortController cancels in-flight requests when a new keystroke fires before the previous response completes.

### Cart Drawer with Live Updates
A slide-out drawer shows the current cart with per-item quantity controls, individual removal, running subtotal, shipping cost, and order total — all updating live without a page reload. For unauthenticated users, cart state is stored in localStorage. On login, the guest cart is automatically merged with the server-side cart (additive — quantities combine rather than overwrite).

### PayPal Checkout
A full PayPal sandbox integration using the PayPal Orders API directly via Axios on the backend. The backend generates an access token via OAuth2 client credentials, creates the order, and captures payment. A COMPLIANCE_VIOLATION error path is handled explicitly — when PayPal returns this error on capture, the backend fetches the order details separately to recover the transaction data before persisting the order record.

### Google OAuth
Users can sign in with Google using `@react-oauth/google`. The frontend exchanges the Google token for user info from the Google API, then posts the profile data to the backend. The backend uses Mongoose upsert logic: creates a new user if the email doesn't exist, or links the Google account to an existing email if one already exists without a `googleId`.

### JWT Authentication
Tokens are signed with a 1-week expiry and stored in HttpOnly cookies — not localStorage. In production, cookies are `Secure` and `SameSite: none` (required for cross-origin requests between Vercel and Render). In development, `SameSite: lax` is used. A middleware validates the JWT on every protected route and attaches the `userId` to `req.user`.

### Email Verification & Transactional Email
The User model includes `isVerified`, `verificationToken`, and `verificationTokenExpiry` fields. Transactional emails (order confirmations with itemized HTML tables, payer info, and shipping details) are sent via the Resend API after a successful PayPal capture.

### Order History
The dashboard shows all past orders in reverse-chronological order, with full line-item detail, totals, PayPal order IDs, and status. Orders are stored as an array of sub-documents under the user's Order record, with duplicate prevention via paypalOrderId checking before insert.

### Account Management
Users can update their delivery address (country, city, apartment, phone number via `country-state-city` and `react-phone-input-2`), view order history, and permanently delete their account. Account deletion requires password confirmation for email/password users; Google-authenticated users skip that step.

---

## Tech Stack

### Frontend

| Technology | Why |
|---|---|
| **React 18** | Component model and hooks-based architecture fit the complexity of managing auth, cart, search, and drawer state simultaneously |
| **Vite** | Significantly faster dev server startup and HMR compared to CRA. Native ESM in development, Rollup for production builds |
| **React Router DOM v6** | Declarative client-side routing with nested route support |
| **Axios** | Interceptor support for consistent error handling and the ability to attach an AbortController to cancel in-flight search requests |
| **Ant Design** | Used for AutoComplete (search suggestions), Form, Input, Spin, and notification message components |
| **Material-UI** | Used for Drawer components (cart, mobile navigation) and a few layout primitives |
| **Tailwind CSS** | Utility classes for rapid layout and spacing without writing custom CSS |
| **Styled Components** | Dynamic component-level styles that needed to respond to props (e.g., active drawer state, theme tokens) |
| **@paypal/react-paypal-js** | Renders the PayPal payment button and manages the PayPal JS SDK lifecycle |
| **@react-oauth/google** | Handles the Google OAuth flow and exposes `useGoogleLogin` hook |
| **country-state-city** | Provides structured geographic data for the delivery address form dropdowns |

> **Note on UI libraries:** Ant Design, MUI, Tailwind, and Styled Components are all present in this codebase. This reflects an active learning phase where each library was explored for different UI needs. In a production codebase I was maintaining long-term, I would consolidate to a single design system from the start to reduce bundle size, eliminate specificity conflicts, and simplify onboarding.

### Backend

| Technology | Why |
|---|---|
| **Node.js + Express** | Lightweight and well-suited for a JSON API. Middleware composition made it straightforward to apply auth, error handling, and CORS globally |
| **MongoDB + Mongoose** | Document model maps naturally to nested cart items and order sub-documents. Text indexes on the Product model power the search endpoint without a separate search service |
| **JWT (jsonwebtoken)** | Stateless authentication — no server-side session store required. HttpOnly cookie storage prevents XSS-based token theft |
| **bcrypt** | Industry-standard password hashing with configurable salt rounds (10) |
| **Helmet** | Sets security-relevant HTTP headers (X-Frame-Options, CSP, HSTS, etc.) with minimal configuration |
| **Morgan** | Structured HTTP request logging in development |
| **Resend** | Simple API for transactional email — used for order confirmation emails with full HTML templates |
| **Cookie-parser** | Parses the JWT from incoming request cookies for the auth middleware |

---

## Architecture

### Separation of Concerns

The frontend is a React SPA deployed on Vercel. The backend is a standalone Express API deployed on Render. They communicate exclusively over HTTP — the frontend never touches the database, and the backend never renders UI. This separation means each can be scaled, deployed, and debugged independently.

### Backend: Controller / Model / Routes

Each domain (auth, users, cart, orders, products, search, payment) has its own route file, controller file, and Mongoose model. Routes define the endpoint and apply middleware (auth guard, validation). Controllers contain business logic and call the model. Models define the schema and any instance methods (e.g., `comparePassword` on the User model). This keeps each layer testable in isolation.

### Frontend: Reducer-Based State with Context + Custom Hooks

Global state is managed with React's `useReducer` + `createContext`, a pattern popularized by Kent C. Dodds. There are four domain-level providers: `AuthProvider`, `CartProvider`, `SearchProvider`, and `DrawerProvider`. Each provider owns a reducer with explicit action types (e.g., `LOGIN_SUCCESS`, `ADD_TO_CART`, `SET_SUGGESTIONS`), a dispatch function, and a context value.

Consumers never import context directly — they use custom hooks (`useAuthContext`, `useCartContext`, `useSearchContext`, `useDrawerContext`) that throw descriptive errors if used outside their provider. Business logic (API calls, side effects) lives in a second layer of hooks (`useAuth`, `useCart`, `useSearch`, `useDrawers`) that wrap the context hooks. Components are kept as thin as possible.

### RESTful API Design

All endpoints follow REST conventions: nouns for resources, HTTP verbs for actions, appropriate status codes (200, 201, 400, 401, 403, 404, 500). Protected routes run the `authenticateToken` middleware before the controller. The auth middleware validates the JWT from the cookie, handles `TokenExpiredError` and `JsonWebTokenError` separately, and attaches `req.user.userId` for downstream use.

---

## Key Engineering Decisions

### JWT in HttpOnly Cookies
Storing the token in an HttpOnly cookie (rather than localStorage) means JavaScript on the page cannot access the token — which eliminates a whole class of XSS-based token theft. The tradeoff is more careful CORS and SameSite configuration, especially when the frontend and backend are on different domains in production.

### PayPal Server-Side Integration
Rather than using only the frontend PayPal SDK, order creation and payment capture both happen on the backend via direct calls to the PayPal Orders API. This ensures the amount can't be tampered with on the client, and gives full control over error handling — including the COMPLIANCE_VIOLATION edge case where PayPal rejects the capture but the transaction has still been recorded on their side.

### Google OAuth Upsert Pattern
The backend handles four cases on Google login: new user (create), existing Google user (return), existing email user without googleId (link and return), and conflict errors. This prevents duplicate accounts when a user has previously signed up with email and later tries Google.

### Debounced Search with Request Cancellation
The search hook debounces at 300ms using `setTimeout`/`clearTimeout` and attaches an `AbortController` to each request. When the user types a new character before the previous request resolves, the controller aborts the stale request. This prevents stale responses from overwriting newer results and avoids hammering the API on every keystroke.

### Guest-to-Authenticated Cart Merge
Cart state for unauthenticated users is stored in localStorage and managed by the same cart reducer. On login, the frontend calls `/api/cart/merge` with the local cart contents. The backend iterates the incoming items and adds them to the user's server cart (additive — if an item already exists in the server cart, quantities combine). After the merge succeeds, the local cart is cleared from localStorage.

---

## What I'd Do Differently

**TypeScript.** The absence of types made refactoring more error-prone than it needed to be — especially across the reducer action types and API response shapes. TypeScript would have caught several bugs at compile time that only surfaced at runtime.

**Single UI library.** Having Ant Design, MUI, Tailwind, and Styled Components in the same project was fine for exploration, but it created bundle size overhead and occasional specificity conflicts. Starting with one system (probably Tailwind + a headless component library like Radix UI or shadcn/ui) would be cleaner.

**More granular commit history.** Many features were built and committed in large chunks. A more disciplined commit cadence — one logical change per commit — would make the git history genuinely useful for understanding why decisions were made.

**Unit and integration tests.** There are no automated tests. Given the complexity of the cart merge logic, PayPal capture flow, and auth middleware, these are exactly the places where tests would have prevented regressions and made refactoring less risky. I'd add Vitest for unit tests and Supertest for API integration tests.

---

## Installation & Setup

### Prerequisites

- Node.js v18 or higher
- A MongoDB Atlas cluster (or local MongoDB instance)
- A PayPal developer account (sandbox credentials)
- A Google Cloud project with OAuth 2.0 credentials
- A Resend account for transactional email

### 1. Clone the Repository
```bash
git clone https://github.com/mostafarawhy/Dermatique-E-commerce-skincare-products.git
cd dermatique
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_min_32_chars
DERMATIQUE_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
RESEND_API_KEY=your_resend_api_key
```

Start the backend server:
```bash
npm run dev
```

The API will be available at `http://localhost:4000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:4000/api
VITE_DERMATIQUE_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
```

> The Google OAuth client ID is configured in `src/App.jsx`. Replace the value passed to `GoogleOAuthProvider` with your own client ID from Google Cloud Console.

Start the frontend dev server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Seed Product Data
```bash
cd backend
node importProducts.js
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `NODE_ENV` | `development` or `production` — controls cookie security settings | Yes |
| `PORT` | Port for the Express server | Yes |
| `CLIENT_URL` | Frontend origin — used in CORS allowlist | Yes |
| `MONGODB_URI` | MongoDB connection string (Atlas or local) | Yes |
| `JWT_SECRET` | Secret used to sign and verify JWTs — keep this long and random | Yes |
| `DERMATIQUE_APP_PAYPAL_CLIENT_ID` | PayPal application client ID | Yes |
| `PAYPAL_CLIENT_SECRET` | PayPal application secret | Yes |
| `RESEND_API_KEY` | Resend API key for transactional email | Yes |

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Base URL for all backend API requests | Yes |
| `VITE_DERMATIQUE_APP_PAYPAL_CLIENT_ID` | PayPal client ID used by the frontend SDK | Yes |

---

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Register with email and password |
| POST | `/api/auth/login` | — | Login with email and password |
| POST | `/api/auth/google-login` | — | Login or register via Google OAuth |
| POST | `/api/auth/logout` | — | Clear auth cookie |
| GET | `/api/auth/check-auth` | Required | Verify token validity and return user info |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/current` | Required | Get the currently authenticated user |
| POST | `/api/users/update-delivery-info` | Required | Update saved delivery address |
| DELETE | `/api/users/delete-account` | Required | Permanently delete account (requires password for non-Google users) |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products/get` | — | Get all products |
| POST | `/api/products/add` | — | Insert a product record |

### Search

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/search/products` | — | Search products — query params: `q`, `category`, `minPrice`, `maxPrice`, `sort` |
| GET | `/api/search/suggestions` | — | Return top 5 name/category suggestions for a query |

### Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/cart/` | Required | Get the current user's cart |
| POST | `/api/cart/add` | Required | Add a product to the cart (increments quantity if already present) |
| PUT | `/api/cart/update` | Required | Update the quantity of a cart item |
| DELETE | `/api/cart/remove/:productId` | Required | Remove a specific item from the cart |
| DELETE | `/api/cart/empty` | Required | Clear all items from the cart |
| POST | `/api/cart/merge` | Required | Merge a guest (localStorage) cart into the authenticated cart |

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/orders/` | Required | Get all orders for the authenticated user |
| GET | `/api/orders/:orderId` | Required | Get a specific order by ID |

### Payment

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/paypal/create-order` | Required | Create a PayPal order on the backend and return the order ID |
| POST | `/api/paypal/capture-payment` | Required | Capture an approved PayPal payment, persist the order, send confirmation email |

---

## Development Scripts

### Backend
```bash
npm run dev    # Start development server with nodemon
npm start      # Start production server
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Production build to /dist
npm run preview  # Serve the production build locally
npm run lint     # Run ESLint
```

---

## Deployment

The frontend is deployed on **Vercel** — the `vercel.json` at the root configures the build command, framework, and output directory.

The backend API is deployed on **Render**. Production CORS is configured to allow the `CLIENT_URL` environment variable, `localhost` origins in development, and any Vercel preview deployment matching `https://dermatique*.vercel.app`.

---

## License

ISC

---

Built by [Mostafa Rawhy](https://github.com/mostafarawhy) · [LinkedIn](https://www.linkedin.com/in/mostafa-rawhy-b7ab522b2/)
