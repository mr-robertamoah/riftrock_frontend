import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { Projects } from './components/Projects';
import { Equipment } from './components/Equipment';

function App() {
  return (
    <div className="bg-slate-900">
      <Navbar />
      <Hero />
      <About />
      <Equipment />
      <Projects />
      <Services />
      <Contact />
    </div>
  );
}

export default App;