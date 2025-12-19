# TriScan AI

A powerful AI-powered document processing platform that combines OCR, web scraping, and file comparison capabilities.

## Features

- 🔍 **OCR (Optical Character Recognition)**: Extract text from images and documents
- 🌐 **Web Scraping**: Extract and analyze content from websites
- 📊 **File Comparison**: Compare multiple documents and analyze differences
- 💬 **AI Chat**: Interact with your processed content using AI
- 🔐 **Authentication**: Secure user authentication and authorization

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS + shadcn/ui for styling
- React Router for navigation
- React Query for data fetching
- Zustand for state management

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- Groq API for AI/LLM capabilities
- Tesseract.js for OCR
- Cheerio for web scraping

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Groq API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/triscan-ai.git
   cd triscan-ai
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp ../.env.example .env
   # Edit .env and add your MongoDB URI, JWT secret, and Groq API key
   
   # Start backend
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env.local file
   cp .env.example .env.local
   # Edit .env.local if needed (default points to localhost:5000)
   
   # Start frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for Vercel (frontend) and Render (backend).

## Project Structure

```
triscan-ai/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilities
│   │   ├── pages/       # Page components
│   │   └── store/       # Zustand stores
│   └── public/          # Static assets
├── .env.example         # Backend environment template
├── vercel.json          # Vercel deployment config
├── render.yaml          # Render deployment config
└── DEPLOYMENT.md        # Deployment guide
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Chat
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/create` - Create new chat
- `DELETE /api/chat/:chatId` - Delete chat

### OCR
- `POST /api/ocr/upload` - Upload and process document
- `GET /api/ocr/messages/:chatId` - Get OCR chat messages
- `POST /api/ocr/ask` - Ask questions about extracted text

### Web Scraping
- `POST /api/web/scrape` - Scrape website
- `GET /api/web/messages/:chatId` - Get web scraping messages
- `POST /api/web/ask` - Ask questions about scraped content

### File Comparison
- `POST /api/compare/upload` - Upload and compare files
- `GET /api/compare/messages/:chatId` - Get comparison messages
- `POST /api/compare/ask` - Ask questions about comparison

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- shadcn/ui for beautiful UI components
- Groq for AI/LLM capabilities
- Tesseract.js for OCR functionality

## Available Scripts

In the frontend directory, you can run:

- `npm run dev`: Starts the development server
- `npm run build`: Builds the production-ready application
- `npm run preview`: Previews the production build locally

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.