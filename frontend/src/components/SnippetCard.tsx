import React from 'react';
import { Card, Button, Stack } from 'react-bootstrap';

interface Snippet {
    _id: string; // Changed from id to _id to match MongoDB
    title: string;
    language: string;
    code: string;
}

interface SnippetCardProps {
    snippet: Snippet;
    onDelete: (id: string) => void;
    onEdit: (snippet: Snippet) => void;
    onView: (snippet: Snippet) => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet, onDelete, onEdit, onView }) => {
    return (
        <Card className="h-100">
            <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-2">{snippet.title}</Card.Title>
                <Card.Subtitle className="mb-3 text-muted">Language: {snippet.language}</Card.Subtitle>
                <div className="mt-auto">
                    <Stack direction="horizontal" gap={2}>
                        <Button variant="outline-primary" size="sm" onClick={() => onView(snippet)}>View</Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => onEdit(snippet)}>Edit</Button>
                        <Button variant="outline-danger" size="sm" onClick={() => onDelete(snippet._id)}>Delete</Button>
                    </Stack>
                </div>
            </Card.Body>
        </Card>
    );
};

export default SnippetCard;