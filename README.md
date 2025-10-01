
# DevSnippet - Code Snippet Manager

DevSnippet is a modern, fast, and visually appealing web application for developers to store, manage, and quickly access their favorite code snippets. Built with the MERN stack (MongoDB, Express, React, Node.js), it features a clean, dark-themed UI perfect for a developer's toolkit.

## Features

- **Sleek, Dark-Themed UI:** A modern interface that's easy on the eyes.
- **Snippet Organization:** View all your code snippets in a clean, card-based layout.
- **Add New Snippets:** Easily add new snippets with a title, programming language, and code block.
- **Syntax Highlighting:** Code is automatically highlighted for improved readability, powered by `react-syntax-highlighter`.
- **Persistent Storage:** Your snippets are saved securely in a MongoDB Atlas database.
- **Responsive Design:** The application is fully responsive and works on all screen sizes.

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
# 3. Start the backend server
node server.js
```

The server will start on `http://localhost:5000` and connect to your database.

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

## How to Use

- **View Snippets:** All your saved snippets are displayed on the main page.
- **Add a Snippet:** Click the **"Add Snippet"** button at the top right.
- **Fill out the Form:** Provide a title, the programming language (e.g., `javascript`, `python`), and paste your code.
- **Save:** Click **"Save Snippet"**, and it will be instantly added to your collection.
