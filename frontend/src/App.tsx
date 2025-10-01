import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import SnippetList from './components/SnippetList';
import Footer from './components/Footer';

const App: React.FC = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand href="#home">DevSnippet</Navbar.Brand>
                </Container>
            </Navbar>
            <Container className="flex-grow-1">
                <SnippetList />
            </Container>
            <Footer />
        </div>
    );
};

export default App;