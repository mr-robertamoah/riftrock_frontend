import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Projects } from './components/Projects';

function App() {
  return (
    <div className="bg-slate-900">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Services />
    </div>
  );
}

export default App;