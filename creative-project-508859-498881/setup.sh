#!/bin/bash

# Set up the client directory
echo "Setting up client..."
npm create vite@latest client -- --template react
cd client
npm install

# Create App.jsx in the src directory
cat <<EOF > src/App.jsx
import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    fetch('/api/greet')
      .then(response => response.json())
      .then(data => setGreeting(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <div>
        <p>{greeting || 'Loading...'}</p>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
EOF

cd ..

# Set up the server directory
echo "Setting up server..."
mkdir server
cd server
npm init -y
npm install express
touch index.js

# Create the Express server file
cat <<EOF > index.js
const express = require('express');
const path = require('path');
const app = express();
const port = 1488;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// API endpoint
app.get('/api/greet', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(port, () => {
  console.log(\`Server running on port ${port}\`);
});
EOF

cd ..

