import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HardHat, Truck, Bus, Wrench } from 'lucide-react';

const services = [
  {
    icon: HardHat,
    title: 'General Mining Consumables',
    description: 'Equip your team with essential mining consumables including PPE, hand tools, first aid kits, water, and more for enhanced safety and efficiency.',
  },
  {
    icon: Truck,
    title: '⁠Civil & Earth works',
    description: 'At RiftRock Mining Services, we make moving of materials easier and less costly.'
  },
  {
    icon: Wrench,
    title: 'Mining Ancilliary Services',
    description: 'Access specialized equipment rentals like HME, graders, and dozers to meet your unique project requirements and ensure operational success.'
  },
  {
    icon: Bus,
    title: 'Reliable Human Transportation',
    description: 'Ensure smooth and efficient transportation for your staff with our reliable services, providing the right buses to meet your logistical needs.'
  }
];

export const Services = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="services" className="py-20 dark:bg-slate-900 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold dark:text-white text-black/80 mb-4">Our Services</h2>
          <p className="dark:text-gray-400 text-gray-700 max-w-2xl mx-auto">
            Comprehensive mining solutions tailored to meet your specific needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-slate-600 dark:bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-yellow-700 dark:bg-yellow-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <service.icon className="w-6 h-6 dark:text-slate-900 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
              <p className="dark:text-gray-400 text-gray-300">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};