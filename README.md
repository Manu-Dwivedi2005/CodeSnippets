
# DevSnippet - Smart Code Snippet Manager 📝

DevSnippet is a modern, fast, and intelligent web application for developers to store, organize, and quickly access their favorite code snippets. Built with the MERN stack (MongoDB, Express, React, Node.js), it features a clean, dark-themed UI, powerful search capabilities, and smart filtering - perfect for a developer's toolkit.

## Features

- **Sleek, Dark-Themed UI:** A modern interface that's easy on the eyes.
- **Snippet Organization:** View all your code snippets in a clean, card-based layout.
- **Smart Search:** Search through your snippets by title or code content with real-time filtering.
- **Language Filtering:** Filter snippets by programming language for better organization.
- **Add New Snippets:** Easily add new snippets with a title, programming language, and code block.
- **Syntax Highlighting:** Code is automatically highlighted for improved readability, powered by `react-syntax-highlighter`.
- **Persistent Storage:** Your snippets are saved securely in a MongoDB Atlas database.
- **Responsive Design:** The application is fully responsive and works on all screen sizes.
- **Health Monitoring:** Built-in health check endpoint for monitoring server status.

## Tech Stack

- **Frontend:**
  - React (with Vite)
  - TypeScript
  - React-Bootstrap
  - Bootstrap

- **Backend:**
  - Node.js
  - Express.js
  - Mongoose

- **Database:**
  - MongoDB Atlas

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js and npm](https://nodejs.org/en/)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Backend Setup

First, set up the server and connect it to your database.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install
```

Next, you need to connect to your MongoDB Atlas database.

- Create a new file named `.env` inside the `backend` directory.
- Add your MongoDB Atlas connection string to this file. For detailed instructions, see the [official guide](https://docs.atlas.mongodb.com/getting-started/).

Your `backend/.env` file should look like this:

```
MONGO_URI=mongodb+srv://your_username:your_password@cluster_url/your_database_name?retryWrites=true&w=majority
```

Once the `.env` file is configured, you can start the server:

```bash
# 3. Start the backend server (production)
npm start

# OR for development with auto-reload
npm run dev
```

The server will start on `http://localhost:5000` and connect to your database. You can check the server health at `http://localhost:5000/api/health`.

### 2. Frontend Setup

In a separate terminal, set up and run the React client.

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the frontend development server
npm run dev
```

The React application will start, and your browser should automatically open to `http://localhost:5173` (or a similar port).

## API Endpoints

The backend provides the following REST API endpoints:

### GET `/api/snippets`
Retrieve all snippets with optional search and filtering.

**Query Parameters:**
- `search` (optional): Search snippets by title or code content
- `language` (optional): Filter snippets by programming language

**Example:**
```bash
GET /api/snippets?search=react&language=javascript
```

### POST `/api/snippets`
Create a new code snippet.

**Request Body:**
```json
{
  "title": "React Hook Example",
  "language": "javascript",
  "code": "const [count, setCount] = useState(0);"
}
```

### PUT `/api/snippets/:id`
Update an existing snippet by ID.

### DELETE `/api/snippets/:id`
Delete a snippet by ID.

### GET `/api/health`
Health check endpoint to monitor server status.

## How to Use

- **View Snippets:** All your saved snippets are displayed on the main page.
- **Search Snippets:** Use the search bar to find snippets by title or code content.
- **Filter by Language:** Use the language filter to show only snippets of a specific programming language.
- **Add a Snippet:** Click the **"Add Snippet"** button at the top right.
- **Fill out the Form:** Provide a title, the programming language (e.g., `javascript`, `python`), and paste your code.
- **Save:** Click **"Save Snippet"**, and it will be instantly added to your collection.

## Troubleshooting

### Common Issues

**Database Connection Issues:**
- Ensure your MongoDB Atlas cluster is running and accessible
- Check your `.env` file for correct MONGO_URI format
- Verify your IP address is whitelisted in MongoDB Atlas

**Port Already in Use:**
- The backend runs on port 5000 by default
- Set a custom port using environment variable: `PORT=3001 npm start`

**CORS Issues:**
- The backend is configured to accept requests from any origin
- For production, update CORS settings in `server.js`

**Search Not Working:**
- Ensure MongoDB connection is stable
- Check browser console for any JavaScript errors

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes** and test them thoroughly
4. **Commit your changes:** `git commit -m 'Add amazing feature'`
5. **Push to the branch:** `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Add comments for complex functionality
- Test your changes before submitting
- Update documentation if needed

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information

---

**Happy Coding!** 🚀

````
