
import React from 'react';
import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
    return (
        <footer className="footer mt-auto py-3">
            <Container className="text-center">
                <span>Created by Manu © 2025 | <a href="#" style={{color: '#adb5bd'}}>View on GitHub</a></span>
            </Container>
        </footer>
    );
};

export default Footer;
