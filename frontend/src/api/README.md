# TriScan AI - Frontend API Layer

Complete API service layer for React frontend.

## 📁 Structure

```
src/api/
├── apiClient.js    # Core HTTP client with token management
├── auth.js         # Authentication endpoints
├── chat.js         # Chat session management
├── ocr.js          # OCR file processing
├── web.js          # Web scraping
├── compare.js      # File comparison
└── index.js        # Central exports
```

## 🚀 Usage

### Import API Services

```javascript
// Import specific API
import { authApi, chatApi, ocrApi, webApi, compareApi } from '@/api';

// Or import all
import api from '@/api';
```

### Authentication

```javascript
import { authApi } from '@/api';

// Signup
const response = await authApi.signup({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePass123',
  dob: '1990-01-01',
  gender: 'Male',
  country: 'United States'
});

// Login
const response = await authApi.login({
  email: 'john@example.com',
  password: 'securePass123'
});

// Logout
authApi.logout();
```

### Chat Management

```javascript
import { chatApi } from '@/api';

// Create new chat session
const chat = await chatApi.createChat('ocr'); // or 'web', 'compare'

// Get chat history
const history = await chatApi.getHistory();
```

### OCR Processing

```javascript
import { ocrApi } from '@/api';

// Upload files for OCR
const files = document.querySelector('input[type="file"]').files;
const result = await ocrApi.uploadOCR(chatId, files);

console.log(result.clean_text); // Cleaned OCR text

// Validate file
const isValid = ocrApi.isValidOCRFile(file);

// Get supported types
const types = ocrApi.getSupportedFileTypes();
```

### Web Scraping

```javascript
import { webApi } from '@/api';

// Scrape a URL
const result = await webApi.scrape(chatId, 'https://example.com');

console.log(result.clean_text); // Cleaned scraped content

// Validate URL
const isValid = webApi.isValidUrl(url);

// Extract domain
const domain = webApi.extractDomain(url);
```

### File Comparison

```javascript
import { compareApi } from '@/api';

// Compare files
const files = document.querySelector('input[type="file"]').files;
const result = await compareApi.compareFiles(chatId, files);

console.log(result.summary); // Comparison summary
console.log(result.differences); // Differences
console.log(result.similarities); // Common content

// Format results
const formatted = compareApi.formatComparisonResult(result);
```

## 🔐 Authentication Flow

The API client automatically handles JWT tokens:

1. **Login/Signup** - Token stored in localStorage
2. **Subsequent requests** - Token automatically attached to headers
3. **401 Unauthorized** - Automatic redirect to login
4. **Logout** - Token removed, redirect to login

## ⚙️ Configuration

Create `.env` file:

```bash
VITE_API_URL=http://localhost:5000
```

## 🛡️ Error Handling

All API functions throw errors with descriptive messages:

```javascript
try {
  const result = await ocrApi.uploadOCR(chatId, files);
} catch (error) {
  console.error(error.message); // User-friendly error message
  // Show error to user
}
```

## 📝 API Client Methods

### `apiClient.js` exports:

- `get(endpoint)` - GET request
- `post(endpoint, body)` - POST with JSON
- `postForm(endpoint, formData)` - POST with files
- `put(endpoint, body)` - PUT request
- `del(endpoint)` - DELETE request
- `isAuthenticated()` - Check if user is logged in

## 🎯 Production Ready

- ✅ Automatic token management
- ✅ Error handling
- ✅ Type validation
- ✅ Clean exports
- ✅ Async/await
- ✅ Native Fetch API
- ✅ No external dependencies
