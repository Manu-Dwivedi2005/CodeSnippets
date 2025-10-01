
import React, { useEffect, useState } from 'react';
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
    const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [formData, setFormData] = useState({ title: '', language: '', code: '' });

    // Fetch all snippets
    useEffect(() => {
        fetch('/api/snippets')
            .then(res => res.json())
            .then(data => setSnippets(data))
            .catch(err => console.error("Failed to fetch snippets:", err));
    }, []);

    // --- Event Handlers ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAdd = () => {
        fetch('/api/snippets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        .then(res => res.json())
        .then(addedSnippet => {
            setSnippets(prev => [...prev, addedSnippet]);
            setShowAddModal(false);
            setFormData({ title: '', language: '', code: '' });
        })
        .catch(err => console.error("Failed to add snippet:", err));
    };

    const handleUpdate = () => {
        if (!selectedSnippet) return;
        fetch(`/api/snippets/${selectedSnippet._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        .then(res => res.json())
        .then(updatedSnippet => {
            setSnippets(prev => prev.map(s => s._id === updatedSnippet._id ? updatedSnippet : s));
            setShowEditModal(false);
        })
        .catch(err => console.error("Failed to update snippet:", err));
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this snippet?')) {
            fetch(`/api/snippets/${id}`, { method: 'DELETE' })
                .then(res => {
                    if (res.ok) {
                        setSnippets(prev => prev.filter(s => s._id !== id));
                    }
                })
                .catch(err => console.error("Failed to delete snippet:", err));
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
            <Stack direction="horizontal" className="mb-4">
                <h1 className="me-auto">My Code Snippets</h1>
                <Button variant="primary" onClick={openAddModal}>Add Snippet</Button>
            </Stack>

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
                    {snippets.map((snippet, index) => (
                        <tr key={snippet._id}>
                            <td>{index + 1}</td>
                            <td>{snippet.title}</td>
                            <td>{snippet.language}</td>
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

            {/* Add/Edit Modal */}
            <Modal show={showAddModal || showEditModal} onHide={() => { setShowAddModal(false); setShowEditModal(false); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{showEditModal ? 'Edit Snippet' : 'Add New Snippet'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Language</Form.Label>
                            <Form.Control type="text" name="language" value={formData.language} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Code</Form.Label>
                            <Form.Control as="textarea" name="code" rows={10} value={formData.code} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Close</Button>
                    <Button variant="primary" onClick={showEditModal ? handleUpdate : handleAdd}>
                        {showEditModal ? 'Save Changes' : 'Save Snippet'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* View Modal */}
            {selectedSnippet && (
                <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedSnippet.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SyntaxHighlighter language={selectedSnippet.language} style={tomorrow} customStyle={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {selectedSnippet.code}
                        </SyntaxHighlighter>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default SnippetList;
