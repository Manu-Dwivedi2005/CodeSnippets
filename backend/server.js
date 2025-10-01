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
const port = 5000;

app.use(cors());
app.use(express.json());



// Routes
app.get('/api/snippets', async (req, res) => {
    try {
        const snippets = await Snippet.find({});
        res.json(snippets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/snippets', async (req, res) => {
    try {
        const { title, language, code } = req.body;
        if (!title || !language || !code) {
            return res.status(400).json({ message: 'Title, language, and code are required.' });
        }
        
        const newSnippet = await Snippet.create({ title, language, code });
        res.status(201).json(newSnippet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});