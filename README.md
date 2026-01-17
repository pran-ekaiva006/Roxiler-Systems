# Roxiler Store Rating System

A full-stack web application for users to submit ratings for stores registered on the platform.

## Tech Stack
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL/MySQL
- **Frontend:** React + Vite
- **Authentication:** JWT

## Installation

### Backend Setup

1. Navigate to backend folder:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=roxiler
JWT_SECRET=your_jwt_secret_key_change_in_production
```

4. Setup database:
```bash
# Run the SQL schema
psql -U postgres -d roxiler -f database.sql
```

5. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/update-password` - Update password (Protected)

### Stores
- `GET /api/stores/admin/all` - Get all stores (Admin only)
- `GET /api/stores/user/list` - Get stores for normal user (Protected)
- `GET /api/stores/:id` - Get store details (Protected)
- `POST /api/stores` - Create store (Admin only)
- `DELETE /api/stores/:id` - Delete store (Admin only)

### Ratings
- `POST /api/ratings/submit` - Submit/update rating (Normal user only)
- `GET /api/ratings/user/:storeId` - Get user's rating (Normal user only)
- `GET /api/ratings/store/:storeId` - Get store ratings (Store owner only)
- `GET /api/ratings/admin/all` - Get all ratings (Admin only)

### Users
- `POST /api/users` - Create user (Admin only)
- `GET /api/users/all` - Get all users (Admin only)
- `GET /api/users/:id` - Get user details (Admin only)
- `GET /api/users/dashboard` - Get dashboard stats (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## User Roles

1. **System Administrator**
   - Add new stores, users, and admin users
   - View dashboard with statistics
   - Manage all users and stores
   - Apply filters on listings

2. **Normal User**
   - Sign up and login
   - Update password
   - View registered stores
   - Search stores by name and address
   - Submit and modify store ratings

3. **Store Owner**
   - Login to platform
   - Update password
   - View users who rated their store
   - See average rating

## Form Validations

- **Name:** Min 20 characters, Max 60 characters
- **Address:** Max 400 characters
- **Password:** 8-16 characters, must include 1 uppercase letter and 1 special character
- **Email:** Must follow standard email validation rules

## Commit History

All changes are organized with small, focused commits:
1. Database schema creation
2. Environment configuration
3. Authentication setup
4. Validation schemas
5. Middleware implementation
6. Controller implementations
7. Route definitions
8. Error handling
9. Frontend initialization
10. Page components
11. Styling

Each commit can be pushed to GitHub individually.

## License

ISC
