const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const Snippet = require('./models/Snippet');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit



// Routes
app.get('/api/snippets', async (req, res) => {
    try {
        const { search, language } = req.query;
        let query = {};

        // Add search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by language if specified
        if (language) {
            query.language = { $regex: language, $options: 'i' };
        }

        const snippets = await Snippet.find(query).sort({ createdAt: -1 });
        res.json({
            count: snippets.length,
            snippets: snippets
        });
    } catch (error) {
        console.error('Error fetching snippets:', error);
        res.status(500).json({ message: 'Failed to fetch snippets' });
    }
});

app.post('/api/snippets', async (req, res) => {
    try {
        const { title, language, code } = req.body;

        // Enhanced validation
        if (!title || !language || !code) {
            return res.status(400).json({
                message: 'Title, language, and code are required.',
                missing: {
                    title: !title,
                    language: !language,
                    code: !code
                }
            });
        }

        // Trim whitespace and validate length
        const trimmedTitle = title.trim();
        const trimmedLanguage = language.trim();
        const trimmedCode = code.trim();

        if (trimmedTitle.length > 100) {
            return res.status(400).json({ message: 'Title must be 100 characters or less.' });
        }

        const newSnippet = await Snippet.create({
            title: trimmedTitle,
            language: trimmedLanguage.toLowerCase(),
            code: trimmedCode
        });
        res.status(201).json({
            message: 'Snippet created successfully',
            snippet: newSnippet
        });
    } catch (error) {
        console.error('Error creating snippet:', error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to create snippet' });
        }
    }
});

app.put('/api/snippets/:id', async (req, res) => {
    try {
        const snippet = await Snippet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!snippet) {
            return res.status(404).json({ message: 'Snippet not found' });
        }

        res.json(snippet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

app.delete('/api/snippets/:id', async (req, res) => {
    try {
        const snippet = await Snippet.findById(req.params.id);

        if (!snippet) {
            return res.status(404).json({ message: 'Snippet not found' });
        }

        await snippet.deleteOne(); // Changed from snippet.remove() which is deprecated
        res.json({ message: 'Snippet removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📊 Health check available at http://localhost:${port}/api/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});