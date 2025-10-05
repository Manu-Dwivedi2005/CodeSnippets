import React, { useEffect, useState, useCallback } from 'react';
import { Button, Modal, Form, Stack, Table, ButtonGroup } from 'react-bootstrap';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Import both a light and a dark theme for the code viewer
import { tomorrow, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../context/ThemeContext';

// --- SVG Icons for the new Toggle Button ---
const MoonIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);
const SunIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

// Interface to match data object
interface Snippet {
    _id: string;
    title: string;
    language: string;
    code: string;
}

const SnippetList: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
    const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [languageFilter, setLanguageFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', language: '', code: '' });

    // Fetch snippets from the API
    const fetchSnippets = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/snippets');
            if (!response.ok) {
                throw new Error('Failed to fetch snippets');
            }
            const data = await response.json();
            const snippetArray = data.snippets || data; // Handle different API response structures
            setSnippets(snippetArray);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Failed to fetch snippets:', err);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchSnippets();
    }, []);

    // Search and filter effect (runs on the client side)
    useEffect(() => {
        let filtered = snippets;
        if (searchTerm) { filtered = filtered.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase())); }
        if (languageFilter) { filtered = filtered.filter(s => s.language.toLowerCase().includes(languageFilter.toLowerCase())); }
        setFilteredSnippets(filtered);
    }, [snippets, searchTerm, languageFilter]);
    
    const uniqueLanguages = Array.from(new Set(snippets.map(s => s.language))).sort();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'k') { e.preventDefault(); (document.querySelector('input[placeholder*="Search"]') as HTMLInputElement)?.focus(); }
        else if (e.key === 'Escape') { setShowAddModal(false); setShowEditModal(false); setShowViewModal(false); }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    
    // --- API-based CRUD Operations ---
    
    const handleAdd = async () => {
        try {
            const response = await fetch('/api/snippets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Failed to add snippet');
            const newSnippet = await response.json();
            setSnippets(prev => [newSnippet, ...prev]); // Optimistic update
            setShowAddModal(false);
            setFormData({ title: '', language: '', code: '' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleUpdate = async () => {
        if (!selectedSnippet) return;
        try {
            const response = await fetch(`/api/snippets/${selectedSnippet._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Failed to update snippet');
            const updatedSnippet = await response.json();
            setSnippets(prev => prev.map(s => (s._id === updatedSnippet._id ? updatedSnippet : s)));
            setShowEditModal(false);
            setFormData({ title: '', language: '', code: '' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this snippet?')) {
            try {
                const response = await fetch(`/api/snippets/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete snippet');
                setSnippets(prev => prev.filter(s => s._id !== id));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        }
    };

    // --- Modal Control ---
    const openAddModal = () => { setFormData({ title: '', language: '', code: '' }); setShowAddModal(true); };
    const openEditModal = (snippet: Snippet) => { setSelectedSnippet(snippet); setFormData({ title: snippet.title, language: snippet.language, code: snippet.code }); setShowEditModal(true); };
    const openViewModal = (snippet: Snippet) => { setSelectedSnippet(snippet); setShowViewModal(true); };
    const bgblue = { color: 'blue' };
    return (
        <>
            <Stack direction="horizontal" className="mb-4 align-items-center header-row">
            <h1 className="me-auto app-title" style={bgblue}>
                    My Code Snippets 
                    <small className="text-muted ms-2">({filteredSnippets.length})</small>
                </h1>
                <div className="d-flex align-items-center gap-3 header-controls">
                    <Button variant="outline-secondary" onClick={toggleTheme} className="theme-toggle-btn">
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </Button>
                    <Button variant="primary" onClick={openAddModal}>
                        Add Snippet
                    </Button>
                </div>
            </Stack>

            <Stack direction="horizontal" gap={3} className="mb-4 search-row">
                <Form.Control type="text" placeholder="Search snippets by title or code... (Ctrl+K)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-grow-1"/>
                <Form.Select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} style={{ width: '200px' }}>
                    <option value="">All Languages</option>
                    {uniqueLanguages.map((lang) => (<option key={lang} value={lang}>{lang}</option>))}
                </Form.Select>
                {(searchTerm || languageFilter) && (<Button variant="outline-secondary" onClick={() => { setSearchTerm(''); setLanguageFilter(''); }}>Clear</Button>)}
            </Stack>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="text-center"><div className="spinner-border text-primary" /></div>}

            {!loading && filteredSnippets.length === 0 ? (
                <div className="text-center py-5">
                    <h3 className="text-muted mb-3">{searchTerm || languageFilter ? 'No snippets found' : 'No snippets yet'}</h3>
                    <p className="text-muted mb-3">{searchTerm || languageFilter ? 'Try adjusting your search or filter criteria' : 'Create your first code snippet to get started!'}</p>
                    {!(searchTerm || languageFilter) && (<Button variant="primary" onClick={openAddModal}>Add Your First Snippet</Button>)}
                </div>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover variant={theme === 'dark' ? 'dark' : 'light'}>
                        <thead>
                            <tr><th>#</th><th>Title</th><th>Language</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filteredSnippets.map((snippet, index) => (
                                <tr key={snippet._id}>
                                    <td>{index + 1}</td>
                                    <td><strong>{snippet.title}</strong><small className="text-muted d-block">{snippet.code.substring(0, 100)}...</small></td>
                                    <td><span className="badge bg-secondary">{snippet.language}</span></td>
                                    <td>
                                        <ButtonGroup size="sm">
                                            <Button variant="outline-primary" onClick={() => openViewModal(snippet)}>View</Button>
                                            <Button variant="outline-secondary" onClick={() => openEditModal(snippet)}>Edit</Button>
                                            <Button variant="outline-danger" onClick={() => handleDelete(snippet._id)}>Delete</Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Modals */}
            <Modal show={showAddModal || showEditModal} onHide={() => { setShowAddModal(false); setShowEditModal(false); }} centered>
                 <Modal.Header closeButton><Modal.Title>{showEditModal ? 'Edit Snippet' : 'Add New Snippet'}</Modal.Title></Modal.Header>
                 <Modal.Body>
                     <Form>
                         <Form.Group className="mb-3"><Form.Label>Title <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Enter a descriptive title..." /></Form.Group>
                         <Form.Group className="mb-3"><Form.Label>Language <span className="text-danger">*</span></Form.Label><Form.Control type="text" name="language" value={formData.language} onChange={handleChange} required placeholder="e.g., javascript, python..." /></Form.Group>
                         <Form.Group className="mb-3"><Form.Label>Code <span className="text-danger">*</span></Form.Label><Form.Control as="textarea" name="code" rows={12} value={formData.code} onChange={handleChange} required placeholder="Paste your code here..." style={{ fontFamily: 'monospace' }} /></Form.Group>
                     </Form>
                 </Modal.Body>
                 <Modal.Footer>
                     <Button variant="secondary" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Close</Button>
                     <Button variant="primary" onClick={showEditModal ? handleUpdate : handleAdd} disabled={!formData.title.trim() || !formData.language.trim() || !formData.code.trim()}>{showEditModal ? 'Save Changes' : 'Save Snippet'}</Button>
                 </Modal.Footer>
            </Modal>

            {selectedSnippet && (
                <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
                    <Modal.Header closeButton><Modal.Title className="d-flex justify-content-between align-items-center w-100"><span>{selectedSnippet.title}</span><span className="badge bg-secondary ms-2">{selectedSnippet.language}</span></Modal.Title></Modal.Header>
                    <Modal.Body>
                        <div className="position-relative">
                            <Button variant="outline-secondary" size="sm" className="position-absolute top-0 end-0 mt-2 me-2" style={{ zIndex: 10 }} onClick={() => navigator.clipboard.writeText(selectedSnippet.code)} title="Copy to clipboard">Copy</Button>
                            <SyntaxHighlighter
                                language={selectedSnippet.language}
                                style={theme === 'dark' ? vscDarkPlus : tomorrow}
                                customStyle={{ maxHeight: '60vh', overflowY: 'auto', fontSize: '14px', borderRadius: '8px' }}
                                showLineNumbers
                            >
                                {selectedSnippet.code}
                            </SyntaxHighlighter>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default SnippetList;