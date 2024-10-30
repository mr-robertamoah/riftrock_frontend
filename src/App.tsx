import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';

function App() {
  return (
    <div className="bg-slate-900">
      <Navbar />
      <Hero />
    </div>
  );
}

export default App;