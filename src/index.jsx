import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import $ from 'jquery';

// Make jQuery available globally
window.$ = window.jQuery = $;

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);