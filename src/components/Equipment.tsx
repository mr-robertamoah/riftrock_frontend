import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Truck, Cog, Battery, Shield } from 'lucide-react';

const equipment = [
  {
    name: 'Heavy Machinery',
    specs: ['500-ton capacity', 'GPS-guided operation', 'AI-assisted controls'],
    image: 'https://images.unsplash.com/photo-1563185628-4bc6e5c95c18?auto=format&fit=crop&q=80',
    icon: Truck
  },
  {
    name: 'Processing Units',
    specs: ['Advanced filtration', 'Automated sorting', 'Real-time monitoring'],
    image: 'https://images.unsplash.com/photo-1565365029925-fecab2cbfb69?auto=format&fit=crop&q=80',
    icon: Cog
  },
  {
    name: 'Power Systems',
    specs: ['Hybrid power solution', 'Smart grid integration', 'Energy recovery'],
    image: 'https://images.unsplash.com/photo-1574170623305-6f7f76d9f15a?auto=format&fit=crop&q=80',
    icon: Battery
  },
  {
    name: 'Safety Equipment',
    specs: ['Emergency protocols', 'Environmental sensors', '24/7 monitoring'],
    image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80',
    icon: Shield
  }
];

export const Equipment = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="equipment" className="py-20 dark:bg-slate-900 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold dark:text-white text-black/80 mb-4">Our Equipment</h2>
          <p className="dark:text-gray-400 text-gray-700 max-w-2xl mx-auto">
            State-of-the-art machinery and technology for optimal mining operations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {equipment.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="dark:bg-slate-800 bg-slate-600 rounded-lg overflow-hidden group dark:hover:bg-slate-700 hover:bg-slate-500 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                  <div className="p-2 dark:bg-yellow-500 bg-yellow-700 rounded-lg">
                    <item.icon className="w-5 h-5 dark:text-slate-900 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {item.specs.map((spec, i) => (
                    <li key={i} className="dark:text-gray-400 text-gray-300 flex items-center">
                      <span className="w-2 h-2 dark:bg-yellow-500 bg-yellow-700 rounded-full mr-2" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};