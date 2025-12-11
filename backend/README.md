# TriScan AI Backend

Node.js Express backend with MongoDB for TriScan AI application.

## Features

- User authentication (Signup)
- JWT token-based authentication
- Password hashing with bcryptjs
- MongoDB integration with Mongoose
- CORS enabled for frontend communication

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and update the following:

- **MONGO_URI**: Your MongoDB connection string
  - Local: `mongodb://localhost:27017/triscan-ai`
  - Atlas: `mongodb+srv://<username>:<password>@cluster.mongodb.net/triscan-ai`
- **JWT_SECRET**: A strong secret key for JWT tokens
  - Generate one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **PORT**: Server port (default: 5000)

### 3. Start MongoDB

If using local MongoDB:

```bash
# Make sure MongoDB is running
mongod
```

If using MongoDB Atlas, ensure your connection string is correct in `.env`.

### 4. Run the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/auth/signup

Register a new user.

**Request Body:**
```json
{
  "name": "Naveen",
  "email": "n@mail.com",
  "password": "Pass123!",
  "dob": "2005-08-24",
  "gender": "Male",
  "country": "India"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Naveen",
    "email": "n@mail.com",
    "dob": "2005-08-24T00:00:00.000Z",
    "gender": "Male",
    "country": "India"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Missing required fields
- `409`: User already exists
- `500`: Server error

### Testing with cURL

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Naveen","email":"n@mail.com","password":"Pass123!","dob":"2005-08-24","gender":"Male","country":"India"}'
```

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   └── User.js            # User schema
├── routes/
│   └── auth.js            # Authentication routes
├── .env.example           # Environment variables template
├── package.json           # Dependencies
└── server.js              # Express app entry point
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Development

The backend is configured to work with the frontend at `http://localhost:5173` (Vite default port).

CORS is enabled for all origins in development. Update CORS settings in `server.js` for production.
