import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { About } from './About';
import { Services } from './Services';
import { Contact } from './Contact';
import { Projects } from './Projects';
import { Equipment } from './Equipment';

function Home() {

  const  [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDarkMode(localStorage.getItem('theme') === 'dark')
      return
    }

    setIsDarkMode(false)
  }, [])

  function toggleTheme(theme: boolean) {
    setIsDarkMode(theme)
  }

  return (
    <div className="bg-slate-900">
      <Navbar isDarkMode={isDarkMode} />
      <Hero onToggle={toggleTheme} />
      <About isDarkMode={isDarkMode} />
      <Equipment />
      <Projects />
      <Services />
      <Contact isDarkMode={isDarkMode} />
    </div>
  );
}

export default Home;
