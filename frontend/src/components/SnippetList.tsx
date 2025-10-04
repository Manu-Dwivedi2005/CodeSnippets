
import React, { useEffect, useState, useCallback } from 'react';
import { Button, Modal, Form, Stack, Table, ButtonGroup } from 'react-bootstrap';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Interface to match MongoDB object
interface Snippet {
    _id: string;
    title: string;
    language: string;
    code: string;
}

const SnippetList: React.FC = () => {
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
    const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [languageFilter, setLanguageFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [formData, setFormData] = useState({ title: '', language: '', code: '' });

    // Fetch snippets with search and filter functionality
    const fetchSnippets = async (search = '', language = '') => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (language) params.append('language', language);

            const response = await fetch(`/api/snippets?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch snippets');
            }

            const data = await response.json();
            const snippetArray = data.snippets || data; // Handle both old and new API response formats
            setSnippets(snippetArray);
            setFilteredSnippets(snippetArray);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Failed to fetch snippets:', err);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchSnippets();
    }, []);

    // Search and filter effect
    useEffect(() => {
        let filtered = snippets;

        if (searchTerm) {
            filtered = filtered.filter((snippet: Snippet) =>
                snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                snippet.code.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (languageFilter) {
            filtered = filtered.filter((snippet: Snippet) =>
                snippet.language.toLowerCase().includes(languageFilter.toLowerCase())
            );
        }

        setFilteredSnippets(filtered);
    }, [snippets, searchTerm, languageFilter]);

    // Get unique languages for filter dropdown
    const uniqueLanguages = Array.from(new Set(snippets.map((s: Snippet) => s.language))).sort();

    // Keyboard shortcuts
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            searchInput?.focus();
        } else if (e.key === 'Escape') {
            setShowAddModal(false);
            setShowEditModal(false);
            setShowViewModal(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // --- Event Handlers ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    // Create a new snippet (POST) and optimistically update UI
    const handleAdd = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/snippets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add snippet');
            }

            const result = await response.json();
            const addedSnippet = result.snippet || result; // Handle both old and new API response formats
            // Prepend to list so newly added appears at top
            setSnippets((prev: Snippet[]) => [addedSnippet, ...prev]);
            setShowAddModal(false);
            setFormData({ title: '', language: '', code: '' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add snippet');
            console.error('Failed to add snippet:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update snippet (PUT)
    const handleUpdate = async () => {
        if (!selectedSnippet) return;

        try {
            setLoading(true);
            const response = await fetch(`/api/snippets/${selectedSnippet._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update snippet');
            }

            const updatedSnippet = await response.json();
            // Replace the updated snippet in the local list
            setSnippets((prev: Snippet[]) => prev.map((s: Snippet) => s._id === updatedSnippet._id ? updatedSnippet : s));
            setShowEditModal(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update snippet');
            console.error('Failed to update snippet:', err);
        } finally {
            setLoading(false);
        }
    };

    // Delete snippet (DELETE)
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this snippet? This action cannot be undone.')) {
            try {
                setLoading(true);
                const response = await fetch(`/api/snippets/${id}`, { method: 'DELETE' });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete snippet');
                }

                // Remove from list after successful deletion
                setSnippets((prev: Snippet[]) => prev.filter((s: Snippet) => s._id !== id));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete snippet');
                console.error('Failed to delete snippet:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    // --- Modal Control ---
    const openAddModal = () => {
        setFormData({ title: '', language: '', code: '' });
        setShowAddModal(true);
    };

    const openEditModal = (snippet: Snippet) => {
        setSelectedSnippet(snippet);
        setFormData({ title: snippet.title, language: snippet.language, code: snippet.code });
        setShowEditModal(true);
    };

    const openViewModal = (snippet: Snippet) => {
        setSelectedSnippet(snippet);
        setShowViewModal(true);
    };

    return (
        <>
            <Stack direction="horizontal" className="mb-4 align-items-center">
                <h1 className="me-auto app-title">My Code Snippets <small className="text-muted">({filteredSnippets.length})</small></h1>
                <Button variant="primary" onClick={openAddModal} disabled={loading} aria-label="Add Snippet">Add Snippet</Button>
            </Stack>

            {/* Search and Filter Controls */}
            <Stack direction="horizontal" gap={3} className="mb-4 search-row">
                <Form.Control
                    type="text"
                    placeholder="Search snippets by title or code... (Ctrl+K)"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="flex-grow-1"
                    aria-label="Search snippets"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.ctrlKey && e.key === 'k') {
                            e.preventDefault();
                            e.currentTarget.focus();
                        }
                    }}
                />
                <Form.Select
                    value={languageFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLanguageFilter(e.target.value)}
                    style={{ width: '200px' }}
                    aria-label="Filter by language"
                >
                    <option value="">All Languages</option>
                    {uniqueLanguages.map((lang: string) => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </Form.Select>
                {(searchTerm || languageFilter) && (
                    <Button
                        variant="outline-secondary"
                        onClick={() => { setSearchTerm(''); setLanguageFilter(''); }}
                        aria-label="Clear search and filters"
                    >
                        Clear
                    </Button>
                )}
            </Stack>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-danger mb-4" role="alert">
                    <strong>Error:</strong> {error}
                    <button
                        type="button"
                        className="btn-close float-end"
                        onClick={() => setError(null)}
                    ></button>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center mb-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {filteredSnippets.length === 0 && !loading ? (
                <div className="text-center py-5">
                    <h3 className="text-muted mb-3">
                        {searchTerm || languageFilter ? 'No snippets found' : 'No snippets yet'}
                    </h3>
                    <p className="text-muted mb-3">
                        {searchTerm || languageFilter
                            ? 'Try adjusting your search or filter criteria'
                            : 'Create your first code snippet to get started!'}
                    </p>
                    {!(searchTerm || languageFilter) && (
                        <Button variant="primary" onClick={openAddModal}>
                            Add Your First Snippet
                        </Button>
                    )}
                </div>
            ) : (
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Language</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSnippets.map((snippet: Snippet, index: number) => (
                            <tr key={snippet._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <strong>{snippet.title}</strong>
                                    {snippet.code.length > 100 && (
                                        <small className="text-muted d-block">
                                            {snippet.code.substring(0, 100)}...
                                        </small>
                                    )}
                                </td>
                                <td>
                                    <span className="badge bg-secondary">{snippet.language}</span>
                                </td>
                                <td>
                                    <ButtonGroup size="sm">
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => openViewModal(snippet)}
                                            title="View snippet (V)"
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => openEditModal(snippet)}
                                            title="Edit snippet (E)"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => handleDelete(snippet._id)}
                                            title="Delete snippet (Del)"
                                        >
                                            Delete
                                        </Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Add/Edit Modal */}
            <Modal show={showAddModal || showEditModal} onHide={() => { setShowAddModal(false); setShowEditModal(false); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{showEditModal ? 'Edit Snippet' : 'Add New Snippet'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                maxLength={100}
                                placeholder="Enter a descriptive title..."
                            />
                            <Form.Text className="text-muted">
                                {formData.title.length}/100 characters
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Language <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                list="languages"
                                type="text"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                required
                                placeholder="e.g., javascript, python, java..."
                            />
                            <datalist id="languages">
                                {uniqueLanguages.map(lang => (
                                    <option key={lang} value={lang} />
                                ))}
                                <option value="javascript" />
                                <option value="python" />
                                <option value="java" />
                                <option value="typescript" />
                                <option value="html" />
                                <option value="css" />
                                <option value="sql" />
                                <option value="bash" />
                            </datalist>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Code <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                name="code"
                                rows={12}
                                value={formData.code}
                                onChange={handleChange}
                                required
                                placeholder="Paste your code here..."
                                style={{ fontFamily: 'monospace' }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Close</Button>
                    <Button
                        variant="primary"
                        onClick={showEditModal ? handleUpdate : handleAdd}
                        disabled={!formData.title.trim() || !formData.language.trim() || !formData.code.trim() || loading}
                    >
                        {loading ? 'Saving...' : (showEditModal ? 'Save Changes' : 'Save Snippet')}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* View Modal */}
            {selectedSnippet && (
                <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title className="d-flex justify-content-between align-items-center">
                            <span>{selectedSnippet.title}</span>
                            <span className="badge bg-secondary ms-2">{selectedSnippet.language}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="position-relative">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="position-absolute top-0 end-0 mt-2 me-2"
                                style={{ zIndex: 10 }}
                                onClick={() => {
                                    navigator.clipboard.writeText(selectedSnippet.code);
                                    // You could add a toast notification here
                                }}
                                title="Copy to clipboard"
                            >
                                Copy
                            </Button>
                            <SyntaxHighlighter
                                language={selectedSnippet.language}
                                style={tomorrow}
                                customStyle={{
                                    maxHeight: '60vh',
                                    overflowY: 'auto',
                                    fontSize: '14px'
                                }}
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
