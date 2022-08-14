import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import './index.css';
import TheDotsGame from './TheDotsGame';


const container = document.getElementById('root');
if (!container) {
  throw new Error("Element #root wasn't found");
}

const root = ReactDOM.createRoot(container);
root.render(
  <TheDotsGame />
);
