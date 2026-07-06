import React, { useState } from 'react';
import './App.css';
import Header from './components/header.jsx';
import Main from './components/Main.jsx';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ChatApp">
      <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <Main sidebarOpen={sidebarOpen} onCloseSidebar={() => setSidebarOpen(false)} />
    </div>
  );
}

export default App;
