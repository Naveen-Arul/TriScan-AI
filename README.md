# TriScan AI

A powerful AI-powered document processing platform that combines OCR, web scraping, and file comparison capabilities with intelligent chat functionality.

## What Can You Do With TriScan AI?

### 1. 📄 OCR Mode - Extract Text from Documents
- Upload any image (PNG, JPG, JPEG) or document (PDF, DOC, DOCX, TXT)
- AI automatically extracts all text using advanced OCR technology
- View extracted text in a clean, formatted interface
- Ask questions about the extracted content using AI chat
- Download results as TXT or PDF
- Process multiple documents in separate chat sessions

**Use Cases:**
- Digitize scanned documents and receipts
- Extract text from images and screenshots
- Convert handwritten notes to digital text
- Process business cards and forms

### 2. 🌐 Web Scraping Mode - Extract Website Content
- Enter any website URL to extract its content
- AI cleans and formats the scraped content
- Get structured, readable text from any webpage
- Ask the AI questions about the scraped content
- Download content as TXT or PDF
- Analyze multiple websites in different sessions

**Use Cases:**
- Research and gather information from websites
- Extract articles and blog posts
- Analyze competitor websites
- Collect data for analysis or archiving

### 3. 📊 File Comparison Mode - Compare Multiple Documents
- Upload 2-5 files for intelligent comparison
- Supports PDF, DOC, DOCX, TXT, and images
- AI analyzes and highlights key differences
- Get detailed comparison summaries with:
  - Similarities between files
  - Differences and variations
  - Missing content in each file
  - Overall similarity percentage
- Ask AI questions about the comparison
- Download comparison reports as TXT or PDF

**Use Cases:**
- Compare contract versions
- Analyze document revisions
- Check for plagiarism or duplicates
- Verify document accuracy

### 4. 💬 AI-Powered Chat Interface
- Every mode includes an intelligent chat feature
- Ask follow-up questions about your content
- Get detailed explanations and insights
- Request summaries, translations, or reformatting
- Interactive conversation history
- Context-aware responses based on your uploaded content

### 5. 📂 Organized Workspace
- All your work is organized by mode (OCR, Web, Compare)
- Chat history saved for easy access
- Quick navigation between different sessions
- Timeline view showing processing steps
- Secure user authentication
- Personal profile management

### 6. 🎯 Smart Features
- **Multi-format Support**: Images, PDFs, Word documents, text files
- **Drag & Drop**: Easy file uploads with drag-and-drop interface
- **Real-time Processing**: Watch your content being processed
- **Export Options**: Download results as TXT or PDF
- **Copy to Clipboard**: Quick copy functionality for all content
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode UI**: Easy on the eyes with modern design

## How It Works - Step by Step

### Getting Started
1. **Sign Up / Login**: Create an account or login to access the platform
2. **Dashboard**: Land on the main dashboard with three mode options
3. **Choose Your Mode**: Select OCR, Web Scraping, or File Comparison
4. **Create New Chat**: Start a new session for your task

### Using OCR Mode
1. Click "New Chat" and select "OCR" mode
2. Upload your image or document (drag & drop or click to browse)
3. Wait for AI to extract the text (usually 5-10 seconds)
4. View the extracted text in a clean, formatted display
5. Ask questions about the content using the chat input
6. Download results or copy to clipboard
7. Continue the conversation or start a new chat

### Using Web Scraping Mode
1. Click "New Chat" and select "Web Scraping" mode
2. Enter the URL of the website you want to scrape
3. Click "Scrape" and wait for AI to extract the content
4. View the cleaned, formatted content
5. Ask AI to analyze, summarize, or explain the content
6. Download or copy the results
7. Scrape additional URLs in new sessions

### Using File Comparison Mode
1. Click "New Chat" and select "Compare" mode
2. Upload 2-5 files you want to compare
3. Wait for AI to analyze all files (may take 10-20 seconds)
4. Review the detailed comparison report showing:
   - Common elements across files
   - Differences between files
   - Missing content in each file
   - Overall similarity score
5. Ask specific questions about the differences
6. Download the comparison report
7. Upload new file sets for additional comparisons

### Managing Your Work
- All chats are automatically saved and organized by mode
- Access your chat history from the sidebar
- Click on any previous chat to view its content
- Delete chats you no longer need
- Switch between modes anytime from the dashboard

## Tech Stack

**Frontend:**
- React with TypeScript
- Vite, Tailwind CSS + shadcn/ui
- React Router, React Query, Zustand

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- Groq API for AI/LLM
- Tesseract.js for OCR
- Cheerio for web scraping

## Supported File Formats

### OCR Mode
- **Images**: PNG, JPG, JPEG
- **Documents**: PDF, DOC, DOCX, TXT

### File Comparison Mode
- **Documents**: PDF, DOC, DOCX, TXT
- **Images**: PNG, JPG, JPEG (up to 5 files)

### Web Scraping Mode
- Any valid HTTP/HTTPS URL

## Getting Started

For local development setup and deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

**Quick Start:**
- Frontend runs on `http://localhost:5173`
- Backend API runs on `http://localhost:5000`

## Screenshots & Demo

*Experience the future of document processing with AI*

## Why Choose TriScan AI?

✅ **All-in-One Solution**: OCR, web scraping, and file comparison in one platform  
✅ **AI-Powered**: Advanced AI for intelligent content analysis  
✅ **User-Friendly**: Intuitive interface with drag-and-drop functionality  
✅ **Secure**: JWT-based authentication and secure data handling  
✅ **Fast Processing**: Quick results with real-time feedback  
✅ **Export Ready**: Download results in multiple formats  
✅ **Chat Integration**: Ask questions and get instant AI responses  
✅ **Organized**: Automatic chat history and session management  

## Use Cases Across Industries

**Education**: Digitize notes, compare assignments, research websites  
**Legal**: Compare contract versions, extract text from scanned documents  
**Business**: Analyze documents, scrape competitor data, process invoices  
**Research**: Gather web data, compare research papers, extract information  
**Personal**: Digitize receipts, save articles, organize documents  

## License

This project is licensed under the MIT License.

## Built With ❤️

- shadcn/ui for beautiful UI components
- Groq for AI/LLM capabilities
- Tesseract.js for OCR functionality

---

**Ready to transform how you work with documents?** Start using TriScan AI today!

## Available Scripts

In the frontend directory, you can run:

- `npm run dev`: Starts the development server
- `npm run build`: Builds the production-ready application
- `npm run preview`: Previews the production build locally

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.