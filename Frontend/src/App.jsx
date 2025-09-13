import { useState } from 'react';
import axios from 'axios';
import Editor from 'react-simple-code-editor';
import Markdown from 'react-markdown';
import prism from 'prismjs';
import rehypeHighlight from 'rehype-highlight';

import 'prismjs/themes/prism-okaidia.css';
import 'highlight.js/styles/atom-one-dark.css';
import './App.css';

const defaultCode = `function sayHello(name) {
  if (!name) {
    console.log("Hello, World!");
  } else {
    console.log("Hello, " + name);
  }
}`;

function App() {
  const [code, setCode] = useState(defaultCode);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function getCodeReview() {
    setIsLoading(true);
    setError('');
    setReview('');

    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(response.data.data || response.data);
    } catch (err) {
      setError('Failed to get code review. Please ensure the backend is running.');
      console.error('Error reviewing code:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-wrapper"> 
      <header className="app-header">
        <h1>CodeGuardian 🛡️</h1>
        <p>Your personal AI-powered code reviewer</p>
      </header>
      <main className="app-main">
        <section className="editor-container">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) => prism.highlight(code, prism.languages.javascript, 'javascript')}
            padding={16}
            className="code-editor"
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 16,
            }}
          />
          <button className="review-button" onClick={getCodeReview} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Review Code'}
          </button>
        </section>
        <section className="review-container">
          {isLoading && <div className="loading-spinner"></div>}
          {error && <p className="error-message">{error}</p>}
          {!isLoading && !error && !review && (
            <p className="placeholder-text">Your code review will appear here...</p>
          )}
          {review && (
            <div className="markdown-body">
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;