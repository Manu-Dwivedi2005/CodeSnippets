import React from 'react';
import { Container } from 'react-bootstrap';
import SnippetList from './components/SnippetList';
import { ThemeProvider } from './context/ThemeContext';
import './App.css'; // This is fine, it imports the (now clean) component-specific styles.

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Container fluid className="px-3 px-md-4 py-3 py-md-4 app-container">
        <SnippetList />
      </Container>
    </ThemeProvider>
  );
};

export default App;