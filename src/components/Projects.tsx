import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mountain, Globe, Building2, Trees } from 'lucide-react';

const projects = [
  {
    title: 'Mountain Peak Extraction',
    location: 'Colorado, USA',
    description: 'Sustainable copper mining operation with minimal environmental impact',
    image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&q=80',
    icon: Mountain
  },
  {
    title: 'Global Resources Initiative',
    location: 'Western Australia',
    description: 'Large-scale iron ore extraction using advanced automation',
    image: 'https://images.unsplash.com/photo-1597384491567-1547996d8a7f?auto=format&fit=crop&q=80',
    icon: Globe
  },
  {
    title: 'Urban Mining Complex',
    location: 'Ontario, Canada',
    description: 'Revolutionary underground mining facility in urban proximity',
    image: 'https://images.unsplash.com/photo-1581093458791-9d42d2c63d96?auto=format&fit=crop&q=80',
    icon: Building2
  },
  {
    title: 'Green Valley Operations',
    location: 'Chile',
    description: 'Environmentally conscious lithium extraction project',
    image: 'https://images.unsplash.com/photo-1578323851363-cf6c1a0ed8e6?auto=format&fit=crop&q=80',
    icon: Trees
  }
];

export const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="projects" className="py-20 dark:bg-slate-800 bg-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold dark:text-white text-black/80 mb-4">Featured Projects</h2>
          <p className="dark:text-gray-400 text-gray-700 max-w-2xl mx-auto">
            Discover our global portfolio of innovative mining operations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative overflow-hidden rounded-xl dark:bg-slate-900 bg-slate-600"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 p-6 w-full">
                <div className="flex items-center space-x-2 mb-2">
                  <project.icon className="w-5 h-5 dark:text-yellow-500 text-yellow-600 font-bold" />
                  <span className="dark:text-yellow-500 text-yellow-600 font-bold text-sm">{project.location}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="dark:text-gray-300 text-gray-400">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};