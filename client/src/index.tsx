import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import  VConsole  from  'vconsole';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
  // let vConsole = new VConsole();
console.log("test")
root.render(
    <App />
);

